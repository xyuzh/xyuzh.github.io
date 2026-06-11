---
title: RL fine-tuning is just weighted pretraining
date: 2026-06-09
author: Xinyu Zhang
readTime: ~14 min read
description: PPO and GRPO compute the same gradient you have been using since pretraining — on a corpus the model writes itself, with each sequence's learning rate set by its advantage. Every parameter and hyperparameter, mapped back to a pretraining concept you already know, with four interactive demos.
---

*Strip away the jargon and PPO, GRPO, RLHF all run one update: the pretraining gradient. What changes is who writes the training data (the model itself) and what multiplies each sequence's loss (a signed weight instead of +1). Hold onto that, and every parameter and hyperparameter in the papers maps onto a pretraining concept you already know. This post walks the whole map, with four demos you can play with.*

If you come from language-model land, you already know the only loss function in this story. Pretraining minimizes cross-entropy: for every token in the corpus, push up the log-probability of that token given its context. As a gradient step over one batch of documents, it looks like this:

```
update  =  Σ_documents   1  ·  Σ_t  ∇ log π_θ( y_t ∣ y_<t )
                         ↑
            every document enters with weight +1
```

I wrote the `1` explicitly, which looks silly — until you see the update that PPO and GRPO perform underneath all that RL notation:

```
update  =  Σ_samples   A(x, y)  ·  Σ_t  ∇ log π_θ( y_t ∣ x, y_<t )
                       ↑
            each sample enters with weight A — its advantage
```

The inner sum is *identical*. Same log-probabilities, same gradient, same optimizer. Exactly two things changed:

1. **Who writes the data.** The documents are no longer scraped from the web — the model *samples* them itself, conditioned on prompts.
2. **What the weight is.** The constant `+1` becomes a per-sequence number `A` that can be large, small, or **negative**.

That is the entire conceptual content of RL fine-tuning: **pretraining on a corpus the model writes itself, where each document's learning rate is set by how good it turned out to be.** Everything else — the Greek letters, the clipping, the KL term, every hyperparameter — is bookkeeping around those two changes. Let's build it up from the bottom.

> **◆ The one sentence to hold onto**
>
> RL fine-tuning = a pretraining step on self-generated documents, where "how much do I learn from this document" is no longer the constant +1 but a signed, per-document weight called the advantage.

**01 · One loss, four data sources**

## The ladder from pretraining to RL

Here is the cleanest way I know to see it: keep the loss function *fixed* and only ask, at each stage of training, **(a) who wrote this document, and (b) what weight does it enter the loss with?** Four answers give you the four stages of the modern pipeline.

| Stage | Who writes the data | Weight per document |
|---|---|---|
| Pretraining | the internet | `+1`, always |
| SFT | curated demonstrations | `+1`, always |
| Rejection sampling (RFT / STaR) | **the model**, then a grader filters | `+1` if kept, dropped otherwise |
| RL (PPO / GRPO) | **the model**, then a grader scores | `A` — continuous and **signed** |

Read it top to bottom and each rung changes exactly one thing:

- **Pretraining → SFT**: nothing about the math changes. You just swap the corpus for a smaller, curated one. SFT is pretraining on the corpus you wish the internet had been.
- **SFT → rejection sampling**: now the *model* writes candidate documents (sample several answers per prompt), a grader keeps the good ones, and you do ordinary SFT on the keepers. The model has started writing its own textbook; an editor decides what makes it in. The weight is still +1 — the grader's verdict only controls *whether* a document gets in, not *how much* it teaches.
- **Rejection sampling → RL**: stop throwing data away. Keep *every* sample, and let the grader's verdict become the document's **weight**. Good answers enter with positive weight — learn this. Bad answers enter with negative weight — and a negative weight in front of a log-likelihood gradient means *actively unlearn this*: push the probability of that exact sequence down.

Click through the four rungs below. Watch the formula at the bottom: it never changes — only the data source and the weight chip do.

::widget ladder

> **Negative weight is the genuinely new thing**
>
> Every other ingredient of RL fine-tuning exists somewhere in pretraining land. The one true newcomer is the negative weight. Pretraining can only say "be more like this corpus." A signed weight lets training say "be *less* like this thing you just did" — without anyone having to write down what you should have done instead. That's the mechanic that lets a model surpass its teachers: it learns from graded attempts, not just from examples.

**02 · The model is the data loader now**

## Why RL papers talk like game-players

Once the model writes its own training data, you need vocabulary for the *act of writing* — something pretraining never needed, because its corpus sat in a file. RL has that vocabulary, inherited from agents that learned to play games: the half-finished document is a *state*, emitting one more token is an *action*, the finished document is a *trajectory* or *rollout*, and the grader's verdict is a *reward*. The words feel alien, but they all name pieces of a loop you already know cold: autoregressive sampling.

Here is the entire dictionary in one table — every symbol you'll meet in the PPO/GRPO papers, with its LM name, its RL name, and its job in the data factory:

| Notation | LM name | RL name | Job in the data factory |
|---|---|---|---|
| `ρ` | prompt dataset | initial-state distribution | the question bank documents get written about |
| `x` | prompt | initial state `s₀` | the assignment for one document |
| `π_θ` | the model | the **policy** | the author of the corpus |
| `y` | sampled response | **rollout** / trajectory / episode | one self-written document |
| `y_<t` | prefix | state `s_t` | the document so far — all the author conditions on |
| `y_t` | next token | action `a_t` | one keystroke |
| `len(y)` | response length | horizon `T` | how long the document runs |
| `r(y∣x)` | grade / score | terminal **reward** | the raw verdict, one number per document |
| `G` | samples per prompt | group size | duplicate attempts, for grading on a curve |
| `A` | advantage | **advantage** | the weight the document enters training with |

Press play and watch one document get written, move by move — then flip the toggle to see the same loop in RL vocabulary:

::widget rollout

Two details worth pausing on. First, the probability of a whole document factorizes into the per-token choices — which is exactly why the RL gradient decomposes into the per-token sum that matches pretraining. Second, the reward arrives only once, at the end: the grader reads finished documents, not keystrokes. RL calls this a *sparse, terminal* reward, and it's why we need one more idea before the verdict is usable as a weight.

**03 · From raw grade to weight**

## Why the reward itself is a bad weight

The naive move is to use the grade directly as the weight: reward 1 → weight +1, reward 0 → weight 0. That's just rejection sampling again, and it wastes most of the signal. Worse, a raw grade ignores *difficulty*. If the model already solves a prompt 90% of the time, the ninety-first correct answer teaches nothing new — yet raw-reward weighting keeps reinforcing it, while a hard prompt the model usually fails generates mostly zero-weight data and never gets learned.

What you want is a weight that measures **surprise relative to the model's own current ability**: "how much better than *your usual* was this attempt?" Statisticians would say: subtract a baseline. GRPO's elegant move is to get that baseline for free — make the model attempt the *same prompt* `G` times, and grade each attempt against the group:

```
              r(y_j ∣ x)  −  mean of the group's rewards
A(j)   =   ─────────────────────────────────────────────
                  std of the group's rewards
```

Attempts above the group average get positive weight (learn this), attempts below get negative weight (unlearn this), and dividing by the spread puts easy prompts and hard prompts on the same scale. The group grades itself on a curve — no second network needed. (PPO instead trains a separate *value network* to predict the baseline; that's the main practical difference between the two algorithms.)

Play with it below. Drag the model's accuracy, change the group size `G`, and watch the training weight each answer earns:

::widget grpo

The widget exposes the most important failure mode in this whole business, so push the sliders to the extremes. When *all* `G` attempts tie — all correct or all wrong — the spread is zero and every weight collapses to zero. The group is **dead**: that prompt contributes nothing this step. For 0/1 rewards the probability of a dead group is `p^G + (1−p)^G`, where `p` is the model's accuracy on the prompt — the widget tracks it live. This one quantity quietly drives several hyperparameter choices, as we'll see next: it's why `G` matters, why sampling temperature matters, and why curricula try to keep prompts near a 50% solve-rate, where the learning signal is richest.

**04 · The hyperparameters, mapped back**

## Every knob is a pretraining knob in disguise

Now the payoff. Because the update *is* a weighted pretraining step, every hyperparameter in a PPO/GRPO config answers one of three questions you already know from pretraining: **what's in the batch?** (corpus knobs), **how big a step?** (optimizer knobs), and **how do I keep the run from going off a cliff?** (stability knobs).

### Corpus knobs — what's in the batch

| RL knob | Pretraining concept | What goes wrong at the extremes |
|---|---|---|
| `B` — prompts per step | documents per batch | too small → noisy gradient, overfits a few prompts |
| `G` — samples per prompt | *(no analog — deliberate duplicates)* | too small → noisy baseline, more dead groups |
| `T_max` — generation cap | context / document length | too small → truncated reasoning graded as failure |
| `τ` — sampling temperature | corpus diversity | τ→0 → all G samples identical → every group dead; too high → gibberish corpus |
| `B·G·L̄` — tokens per step | **batch size in tokens** | the single number to compare across eras |

`B` is exactly the document count of a pretraining batch — the diversity of contexts in one gradient step. `G` is the strange one, the knob with *no* pretraining analog: you deliberately put near-duplicates in the batch, because duplicates are what make grading-on-a-curve possible. `G` does two jobs at once: it sharpens the baseline (noise shrinks like `1/√G`) and it keeps prompts alive (the dead-group probability `p^G + (1−p)^G` falls as `G` grows). And temperature — a *taste* parameter at deployment — becomes a *learning* parameter at training time: at τ=0 the model writes the same document `G` times, every group dies, and the run learns nothing at all. Exploration, translated into LM terms, is simply corpus diversity.

The bridging number is `B·G·L̄` — tokens entering the loss per step. It puts RL runs and pretraining runs on the same axis, and the comparison is striking: GPT-3 was pretrained with 3.2M-token batches, while a DAPO-style reasoning run (B=512 prompts, G=16 samples, generations up to 20k tokens) feeds each optimizer step from a self-written corpus several times *larger* than that — every word of it written by the model minutes earlier. Set the sliders yourself, and load the real configs:

::widget cockpit

### Optimizer knobs — how big a step

**Learning rate** is the same word in both worlds, but look at the values: pretraining runs at `1e-4` to `3e-4`; DeepSeekMath and DAPO both run RL at `1e-6` — a couple hundred times smaller. The reason is the deepest difference between the two regimes. A pretraining corpus is *stationary*: step 1000 and step 1001 draw from the same distribution, so a slightly-too-big step gets averaged away. In RL, **the author of the next batch is the model you just updated.** Break the model and it writes a broken corpus, which trains a more broken model, which writes worse data — the loop amplifies its own mistakes. The tiny learning rate isn't caution; it's feedback control.

**Data reuse** — how many gradient passes you take over each batch of rollouts — is exactly *multi-epoch training*. Pretraining mostly avoids repeating data; RL is tempted to, because generating rollouts is the expensive part and you'd like to squeeze each batch dry. But after one update the corpus is *stale*: it was written by a slightly older model, and the weights `A` were computed under the old probabilities. DeepSeekMath plays it safest — exactly one update per batch of rollouts, perfectly on-policy, no staleness at all.

### Stability knobs — the leash

**Clip `ε`** exists *because* of data reuse. When training on stale rollouts, PPO and GRPO multiply each token's gradient by the ratio `π_new(token) / π_old(token)` — an importance correction — and then clip that ratio to `[1−ε, 1+ε]`. In pretraining terms: a guard rail that says *no token's probability may be pushed more than ~20% past where the data-writing model had it, per reuse pass*. The default is ε=0.2; DAPO's "clip-higher" raises only the upper bound to 0.28, deliberately letting rare exploratory tokens rise faster than the symmetric clip would allow — a hand-tuned bias toward corpus diversity.

**KL coefficient `β`** is the anti-forgetting knob. Chasing reward with signed weights can shred abilities that pretraining paid millions of GPU-hours for, so a penalty `β · KL(π_θ ‖ π_ref)` tethers the model to a frozen reference copy of itself. The pretraining-land analog is replaying old data to prevent catastrophic forgetting — same purpose, implemented as a leash instead of a replay buffer. It's also the defense against *reward hacking*: with a learned reward model, an unleashed policy will happily drift toward gibberish that the grader mistakes for quality. Hence the pattern in real configs: classic RLHF and DeepSeekMath (hackable, learned-model signals) keep β at 0.02–0.04, while DAPO — graded by a rule-based math verifier with nothing to hack — removes the KL term entirely and lets the model travel as far as the rewards justify.

> **The whole config file, in one breath**
>
> Corpus knobs decide what the model writes (`B`, `G`, `T_max`, `τ`); the advantage decides each document's weight; optimizer knobs decide step size and reuse (`lr`, epochs per batch); stability knobs keep the self-amplifying loop on the rails (`ε`, `β`). There is no fifth category. Any PPO/GRPO config you open is these four groups, renamed.

Here is the whole machine in one picture — each knob group lives on the stage of the loop it controls:

![The RL fine-tuning loop: the model writes a corpus, a grader scores it, scores become signed weights, and one weighted pretraining step updates the author — while a frozen reference copy holds the KL leash.](/blog-assets/rl-loop.svg)

*Figure · closed-loop pretraining. Write (corpus knobs B, G, T_max, τ) → grade (the reward) → weight (the advantage, signed) → one pretraining step (lr, μ, clip ε) — and the slightly-better author writes the next batch. The dashed box is the frozen reference model holding the KL leash β.*

**05 · Where the analogy bends**

## The fine print

The weighted-pretraining picture is accurate, but four places deserve honesty about where it creaks:

- **The corpus is non-stationary.** Pretraining samples from a fixed distribution; RL's data distribution moves every step, *because the model moves*. This is why RL runs can collapse in ways pretraining runs can't — and why the stability knobs aren't optional.
- **One weight, many tokens.** The advantage is computed per *document* but applied to every *token* in it — the brilliant insight and the lucky guess in the same proof get the same weight. Credit assignment within a sequence is the open seam; per-token and process-reward schemes are attempts to stitch it.
- **Negative weights are spicier than they look.** Maximizing likelihood is bounded and well-behaved; *minimizing* likelihood of specific sequences is unbounded and can drag probability mass somewhere unpredictable. A good chunk of PPO/GRPO's machinery — clipping especially — exists to keep the negative-weight half of the batch from doing damage.
- **The group baseline is an estimate, not the truth.** Classically the advantage compares an action against the *true* expected value from that state; the group mean is a `G`-sample stand-in for it. Cheap, biased in known ways (some variants drop the `÷ std` for exactly this reason), and in practice good enough to have largely displaced the learned critic.

---

**— The view from here**

## Wrap-up

A language model improving by RL is a model locked in a loop with its own printing press and a grader: **write a batch of documents about the prompts, grade them on a curve, let each grade set that document's learning rate — including negative — then take one ordinary pretraining step and hand the press back to the slightly-better author.**

That's the whole picture. The parameters are the nouns of the press (`ρ`, `x`, `π_θ`, `y`, `r`, `A`); the hyperparameters are the four knob groups on the loop (corpus, weight, optimizer, stability); PPO versus GRPO is a bookkeeping choice about where the baseline comes from. When a paper says "we sample a group of rollouts, compute group-relative advantages, and take a clipped policy-gradient step under a KL penalty," you can now read it at sight: *write, grade on a curve, weight, pretrain-step — carefully.*

*The natural next pit: where does the policy-gradient theorem itself come from — why is advantage-times-log-prob an unbiased gradient of expected reward? That derivation is a story for another post; you now own every concept it needs.*

---

**Notes.** Real-run numbers quoted above: DeepSeekMath 7B GRPO (lr 1e-6, KL β=0.04, G=64, max length 1024, batch 1024, single update per rollout batch) from [arXiv:2402.03300](https://arxiv.org/abs/2402.03300); DAPO (B=512 prompts, G=16, max generation 20,480 tokens, lr 1e-6, ε_low=0.2 / ε_high=0.28, KL removed) from [arXiv:2503.14476](https://arxiv.org/abs/2503.14476); GPT-3 pretraining (3.2M-token batches, peak lr 0.6e-4 for the 175B model) from [arXiv:2005.14165](https://arxiv.org/abs/2005.14165); classic RLHF PPO (one sample per prompt with a value network, per-token KL β=0.02) from InstructGPT, [arXiv:2203.02155](https://arxiv.org/abs/2203.02155). The demos are illustrative toys: synthetic 0/1 rewards and fixed example texts — real runs grade with reward models or verifiers over many prompts at once. Corrections and quibbles welcome.
