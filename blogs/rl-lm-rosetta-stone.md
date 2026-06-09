---
title: Your language model is secretly playing a game
date: 2026-06-08
author: Xinyu Zhang
readTime: ~10 min read
description: RLHF, PPO and GRPO look alien until you notice they're just text generation renamed in the vocabulary of game-playing agents. Here is the dictionary, with two interactive visualizations.
---

*RLHF, PPO, GRPO — the jargon looks alien until you notice it's just text generation, renamed in the vocabulary of agents that learned to play. Here's the whole dictionary, and the one picture that makes every entry obvious.*

If you've spent your life in language-model land — prompts, tokens, next-token probabilities — and then opened a PPO or GRPO paper, you've hit the wall. Suddenly everything is `ρ` and `π_θ` and `s_t` and `a_t`, *advantages* and *trajectories* and *rollouts*. It reads like a foreign language.

Here's the secret, worth saying before anything else: it *is* a foreign language — but it describes something you already understand cold. Reinforcement learning grew up training agents to play games and steer robots, so it named everything in *that* world. RLHF didn't invent new machinery for language models; it took plain text generation and re-labelled it with RL's vocabulary. Learn the dictionary and the fog lifts.

So this post is that dictionary. We'll take the cleaned-up table — the one mapping each symbol to its LM name and its RL name — and, row by row, pin every entry to a *single* running picture until "advantage" and "rollout" feel as natural as "token" and "prompt." No formula will be dropped on you cold.

> **◆ The one sentence to hold onto**
>
> Generating a response is *playing one episode of a game*. The prompt is the opening position, each token you emit is *a move*, and the reward is *the score you get when the game ends*.

Every row of every table below is just one noun from this picture, seen from either the game side (RL) or the keyboard side (LM).

**00 · Where the words come from**

## Why RL talks like that

Let's not rush to the table. First: why does RL use this vocabulary at all? Because a reinforcement-learning agent lives in a loop. It sees a *state* (the screen of the game), picks an *action* (press a button), and the world hands back a new state and maybe some *reward* (points). The strategy mapping "what I see" to "what I do" is the *policy*. One full play-through, start screen to game-over, is a *trajectory*. That's the entire ontology: state, action, reward, policy, trajectory.

Now watch what a language model does when it writes an answer. It sees everything written so far (*a state*), picks the next token (*an action*), appends it, and looks again. When it emits the end-of-sequence token, the episode is over and a grader — a reward model, a human, or a unit test — hands back a *score*. Same loop. Same five nouns. The only difference is that the "screen" is a string of text and the "button" is a token.

That correspondence *is* the post. The three tables that follow are just it, spelled out — so let's read them in the order the game is actually played: set up, play, score.

**01 · Environment & setup**

## Setting the stage

Before any game is played, you need a supply of games to play. In RL that's the environment's *initial-state distribution*; for a language model it's your *prompt dataset*. Same thing, two names.

| Notation | LM term | RL term | What it actually is |
|---|---|---|---|
| `ρ` | Prompt distribution / dataset | Initial-state distribution | The pool of prompts (problems) your model might face. |
| `x` | Prompt / question | Initial state (`s_0`) | One specific prompt, drawn from ρ. |
| `B` | Prompts per batch | Batch size | How many distinct prompts you process in one step. |

*Table 1 · the supply of games*

The real-world version: a student with a question bank. `ρ` is the whole bank — the distribution of questions they might be asked. `x` is the one drawn today: *"What is 17 × 24?"* `B` is how many different questions you put on the desk in one sitting. Nothing exotic — `ρ` is "all the prompts," `x` is "this prompt," `B` is "how many at once."

**02 · Policy & generation — the loop**

## Playing one move at a time

Now the student starts writing. This is the heart of the mapping — the loop itself — so it's the table to slow down on.

| Notation | LM term | RL term | What it actually is |
|---|---|---|---|
| `π_θ` | Model / LM | Policy | A model with weights θ giving a probability `π_θ(y∣x)` to a whole response y. |
| `y` | Response / completion | Rollout / trajectory | One complete sampled answer to x — one full play-through. |
| `y_<t` | Prefix | State / history (`s_t`) | Every token written before position t — all the model conditions on. |
| `y_t` | Token | Action (`a_t`) | The single token chosen at step t. |
| `π_θ(y_t∣x, y_<t)` | Next-token distribution | Policy at step t | Probability of each next token given the prompt and what's written so far. |
| `len(y) · L` | Response length | Horizon (`T`) | Number of generated tokens — how many moves the game lasts. |

*Table 2 · the move-by-move loop*

Read it as one sentence. The model `π_θ` is the student's brain: given a question and whatever's been written, it scores every possible next word. The whole answer `y` is one trajectory. The prefix `y_<t` — everything so far — *is* the state `s_t`. The next token `y_t` is the action `a_t`. And `π_θ(y_t∣x, y_<t)` is the policy at that step. Press play below and watch one episode unfold — flip the labels to see the same loop in both vocabularies.

::widget rollout

Two things deserve a pause. **First**, the probability of a whole response factorizes into the product of those per-step choices: the game is played one move at a time, so the chance of any particular play-through is just the move-by-move chances multiplied together. **Second**, the *horizon* `T` is nothing but the response length — a terse answer is a short game, a long chain-of-thought is a long one.

> **A reader objects**
>
> In a real game you get reward at *every* step — a coin here, damage there. Here a score arrives only at the very end. Isn't that broken?
>
> Not broken — just *sparse*. Plenty of games are like this: chess gives you nothing until the final checkmate. The sparseness is exactly *why* we'll need the next idea. When the only feedback is one number at the end, you face a credit-assignment problem — which of the 200 moves actually deserve the praise? **Advantage** is the tool that answers it.

**03 · Evaluation & optimization**

## Keeping score — and learning from it

A game you can't score is a game you can't learn from. The last three symbols turn answers into a training signal.

| Notation | LM term | RL term | What it actually is |
|---|---|---|---|
| `G` | Generations per prompt | Group size | How many independent answers you sample for one prompt (the "G" in GRPO). |
| `r(y∣x)` | Reward / score | Terminal reward | One scalar for the whole answer — e.g. 1 if correct, 0 if not. |
| `A(i, j)` | Advantage | Advantage | How much better answer j was for prompt i than a baseline — usually the group mean, normalized by spread. |

*Table 3 · turning answers into a gradient*

The first two are easy. `r(y∣x)` is the *reward*: one number for the whole answer — 1 if the student wrote 408, 0 otherwise; or a reward model's quality score. Because it lands only at the end of the episode, RL calls it a *terminal reward*. `G` is just how many times you let the student attempt the *same* question.

The third symbol, `A(i,j)`, is where GRPO lives — and it's worth slowing down, because a raw score is a surprisingly poor teacher.

Suppose your student scores 1. Should you shove the model hard toward that answer? It depends — on whether scoring 1 was *easy* or *hard for this question*. If the model already nails this one nine times out of ten, another correct answer is no news. If it usually fails and this time succeeded, that attempt is gold. Put plainly: a teacher who only ever says "good" or "bad" isn't much use; a *coach* who says "that was better than your usual" is. That comparison — this attempt versus your own average — is the **advantage**.

And here is the move that defines GRPO, which is genuinely elegant: instead of training a *separate* network to estimate "your usual," just make the student answer the same question `G` times, and use the group's own average as the baseline.

```
              r(y_i,j ∣ x_i)  −  mean_j r(y_i,· ∣ x_i)
A(i, j)  =  ─────────────────────────────────────────────
                       std_j r(y_i,· ∣ x_i)
```

Put in words: take how each of the `G` answers scored, subtract the group average, divide by the spread. Answers that beat the group get a positive advantage and are reinforced; answers below it get a negative advantage and are pushed down. The group grades itself on a curve, and no external critic is needed. Play with it — drag the model's accuracy and re-sample the group:

::widget grpo

This is why `G` sits right next to `B` back in Table 1. You sample `B` prompts and `G` answers each — `B×G` play-throughs per step — precisely so every prompt arrives with its own little leaderboard to measure advantage against.

> **But isn't that wasteful?**
>
> Generating the same prompt G times instead of once — that's G× the rollouts. Why pay it?
>
> It's the price of skipping the critic. PPO trains a *second* network — a value function — just to predict the baseline, and tuning that network is its own headache. GRPO replaces the entire thing with `G` samples and a mean. You trade compute (more rollouts) for simplicity (no critic to train, no critic to go wrong). For verifiable tasks like math and code — where rewards are cheap, clean, and 0/1 — that's frequently a great bargain.

One pretty consequence is sitting in the demo, if you push the accuracy slider to the extremes. When all `G` answers *tie* — all right, or all wrong — the spread is zero and every advantage collapses to zero. That batch teaches nothing. It's not a bug; it's the math being honest: if every attempt looked the same, there's no signal about which move to prefer. (In practice you guard the divide-by-`σ`, and such prompts simply contribute nothing to the step.)

**04 · Putting it together**

## So what are PPO and GRPO, really?

With the dictionary in hand, the famous algorithms shrink to one sentence. Both run the *same* four-beat loop:

1. **Play** — Sample G responses from `π_θ` for each prompt.
2. **Score** — Grade each one — get a reward `r(y∣x)`.
3. **Compare** — Turn rewards into advantages `A(i,j)`.
4. **Nudge** — Raise the prob of above-average moves, lower the rest — on a leash.

That's it. **PPO** computes the baseline in beat 3 with a learned value network, and clips the update in beat 4 so it can't lunge too far. **GRPO** computes the baseline from the group mean (the demo above) and drops the value network entirely. The intimidating difference you were squinting at in the papers is, essentially, *that one swap*.

### ⚒ The fine print — where the clean map bends

- **Reward is per-sequence, but learning is per-token.** The score lands once, at the very end, yet the gradient touches every token. GRPO's shortcut is to broadcast that single sequence-level advantage to all tokens in the response. Finer schemes (per-token or process rewards) exist and try to do better.
- **This "advantage" isn't the textbook advantage.** Classically A = Q(s,a) − V(s): how much better an action is than average *from this exact state*. GRPO's group-normalized reward is an empirical stand-in, with "this prompt" playing the role of the state. Cruder, cleaner, and for these tasks, it works.
- **There's a leash the table doesn't show.** Both PPO and GRPO add a KL penalty pulling `π_θ` back toward the original reference model, so chasing reward doesn't shred fluency. The table maps the skeleton; the leash lives in the loss, not the vocabulary.
- **The "state" really is the whole prefix.** `y_<t` is the literal RL state — which makes an LM a Markov decision process with an astronomically large, text-shaped state space. That it works at all is part of what makes this translation feel a little magical.

---

**— The view from here**

## Wrap-up

So the wall was an illusion. `ρ`, `x`, `π_θ`, `y`, `y_<t`, `y_t`, the horizon, `G`, the reward, the advantage — every one is a noun from a single picture: your model at a keyboard, playing one episode of a game, getting a score, and being coached toward the moves that beat its own average.

Internalize that and the papers change character. "Sample a group of rollouts, compute group-relative advantages, take a clipped policy-gradient step" stops being incantation and becomes obvious — it's *play, score, compare, nudge*. The math on top is just bookkeeping over a picture you now own.

If there's a single line to keep: **generation is gameplay, and training is coaching.** Everything else in the table — and most of what's in the papers — is notation hanging off those two ideas.

*A natural next "pit" to fall into: where does the policy-gradient update in beat 4 actually come from, and why does multiplying log-probabilities by the advantage push the model the right way? That's a story for another post — but you now have every noun you'd need to read it.*

---

**Notes.** The RL↔LM mapping follows the standard MDP-over-tokens framing used by RLHF / PPO / GRPO. The two demos are illustrative toys: the rollout uses a fixed example response, and the advantage sandbox samples synthetic 0/1 rewards so you can *feel* the group-relative computation — real runs use learned or rule-based reward models over many prompts at once. Corrections and quibbles welcome.
