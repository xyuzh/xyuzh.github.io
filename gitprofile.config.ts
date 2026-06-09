// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'xyuzh', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/xyuzh/xyuzh.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/xyuzh/portfolio, then set base to '/'.
   */
  base: '/',
  projects: {
    github: {
      display: false, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['xyuzh/my-project1', 'xyuzh/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['xyuzh/gitprofile', 'xyuzh/pandora'], // List of repository names to display. example: ['xyuzh/my-project1', 'xyuzh/my-project2']
      },
    },
    external: {
      header: 'Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Alphice',
          description:
            'Built immersive AI storytelling platform with 30k+ users across iOS and Android. Got into YC and A16Z interviews.',
          imageUrl:
            'https://www.alphice.com/static/media/alphice_2.16c84e5a5f9fdd72c0f6.gif',
          link: 'https://www.alphice.com/',
        },
        {
          title: 'OpenManus',
          description:
            'AI agentic framework with tool calling and browser-use to reproduce Manus.',
          imageUrl:
            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-ZoLi0ewIEm3B0XcMMLTxtbAptDzgTV.png',
          link: 'https://github.com/FoundationAgents/OpenManus',
        },
        {
          title: 'Go-Viral',
          description:
            'Trained on millions of viral tweets to copy the pattern into your tweets.',
          imageUrl: 'go-viral.png',
          link: 'https://go-viral.org/',
        },
        {
          title: 'JIPCAD',
          description: 'Parse algebraic formulas into beautiful geometries.',
          imageUrl:
            'https://jipcad.github.io/assets/images/lumpysphere-1d893b3795ce9cceb88ed095414f9778.gif',
          link: 'https://jipcad.github.io/',
        },
      ],
    },
  },
  bio: `I am currently at the special project team at [Anyscale](https://anyscale.com) where I work on post training research and maintain open-source project [Ray](https://github.com/ray-project/ray) to support scalable infra across pretraining data curation to inference and RL by working together with [Robert Nishihara](https://scholar.google.com/citations?user=zP0S_ikAAAAJ&hl=en).

Previously I received my M.S. degree from the [Language Technology Institute](https://www.lti.cs.cmu.edu/) at Carnegie Mellon University. I worked at Meta lauching experiments testing LLM product features. I also initiated the effort of world model product for which I won [International Design Awards](https://www.idesignawards.com/winners/zoom.php?eid=9-55678-24) and [European Product Design Award](https://www.productdesignaward.eu/winners/epda/2024/11916/). I also worked as cofounder and CTO of [better.new](https://better.new) where I explored post training research and agent harness.`,
  seo: {
    title: 'Xinyu Zhang - Developer & Researcher',
    description: 'Software Engineer at Meta, AI Researcher, and Founder of Alphice with experience at Carnegie Mellon, MIT, and UC Berkeley.',
    imageURL: 'https://cdn.cara.app/production/posts/90150109-c03f-426b-bdfe-fe766c7c4603/carolcao-DesYvvET19XWhP2CIep4i-BA817950-CE37-4C4F-A7CD-B563EF648B36.jpg',
  },
  social: {
    linkedin: 'zhxy',
    twitter: 'xinyzng',
    googleScholar:
      'https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=2OvXQj4AAAAJ',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    skype: '',
    telegram: '',
    website: '',
    phone: '',
    email: 'xinyzng@gmail.com',
  },
  resume: {
    fileUrl:
      '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'JavaScript/TypeScript',
    'React/Vue',
    'Python/C++',
    'Machine Learning',
    'Systems Design',
    '🏓 Pingpong',
    '🪂 Sky diving',
    '☕ Latte art',
    '⛷️ Ski',
    '🧑‍🍳 Cooking'
  ],
  experiences: [
    {
      company: 'Meta',
      position: 'Software Development Engineer',
      from: 'Sep 2023',
      to: 'Present',
      companyLink: 'https://meta.com',
      description: 'Designed pipeline to retrieve and summarize posts in 5M+ groups with genAI. Launched full-stack mobile screens for facebook app used by 2B+ users. Launched A/B test for notifications that boosted user session by 4%.'
    },
    {
      company: 'Alphice',
      position: 'CEO',
      from: '2023',
      to: '2024',
      companyLink: 'https://alphice.com',
      description: 'Built immersive AI storytelling platform with 30k+ users across iOS and Android. Got into YC and A16Z interviews.'
    },
  ],
  certifications: [
    {
      name: 'International Design Awards (IDA)',
      body: 'Honorable Mention — Graphic Design, Mobile/Web App — Alphice',
      year: '2024',
      link: 'https://www.idesignawards.com/winners/zoom.php?eid=9-55678-24',
      logoUrl: '/logo-ida-badge.png',
    },
    {
      name: 'European Product Design Award (EPDA)',
      body: 'Winner — Product Design — Alphice',
      year: '2024',
      link: 'https://www.productdesignaward.eu/winners/epda/2024/11916/',
      logoUrl: '/logo-epda.png',
    },
  ],
  educations: [
    {
      institution: 'Carnegie Mellon University',
      degree: "Master's in Computational Data Science",
      from: 'Jan 2022',
      to: 'Sep 2023',
    },
    {
      institution: 'Massachusetts Institute of Technology',
      degree: 'Advanced Study in Computer Science',
      from: 'Jan 2022',
      to: 'May 2022',
    },
    {
      institution: 'University of California Berkeley',
      degree: 'EECS',
      from: 'May 2020',
      to: 'Aug 2021',
    },
  ],
  publications: [
    {
      title: 'Gradient-Aware Scheduling: Coupling Curriculum and Staleness for Async Reinforcement Learning',
      conferenceName: 'International Conference on Machine Learning (ICML), 2026',
      journalName: '',
      authors: 'Xinyu Zhang',
      link: 'https://icml.cc/virtual/2026/poster/65913',
      description: 'Formalizes a staleness budget optimization problem in asynchronous RL, proving optimal allocation follows exponential decay with task difficulty. Introduces ACEAS (Adaptive Curriculum with Execution-Aware Async Scheduling), combining bandit-based curriculum selection with execution-aware staleness budgets. Achieves 2× higher throughput vs. synchronous baselines and improves Pass@1 from 39.7% to 60.1% on code generation benchmarks.',
    },
    {
      title:
        'What Do World Models Learn in RL? Probing Latent Representations in Learned Environment Simulators',
      conferenceName: 'ICLR Workshop on World Models, 2026',
      journalName: '',
      authors: 'Xinyu Zhang',
      link: 'https://openreview.net/forum?id=VE7JJLVKG1',
      description:
        'Probes two architecturally distinct world models (transformer and diffusion) and finds they develop structured, approximately linear internal representations of game state, confirmed by causal interventions.',
    },
    {
      title:
        'Stabilizing Iterative Self-Training with Verified Reasoning via Symbolic Recursive Self-Alignment',
      conferenceName: 'ICLR Workshop on LLM Reasoning, 2026',
      journalName: '',
      authors: 'Xinyu Zhang',
      link: 'https://openreview.net/forum?id=nf2omuZ9wn',
      description:
        'Stabilizes recursive self-improvement by embedding symbolic verification (via sympy) into the self-training loop, filtering training data at the reasoning-step level to eliminate "lucky guesses" and enable deeper iterative self-training.',
    },
    {
      title: 'CLRN: A Reasoning Network for Multi-Relation Question Answering over Cross-Lingual Knowledge Graphs',
      conferenceName: '',
      journalName: 'Expert Systems with Applications, Volume 231, 2023.',
      authors: 'Yiming Tan, Xinyu Zhang, Yongrui Chen, Zafar Ali, Yuncheng Hua, Guilin Qi',
      link: 'https://www.sciencedirect.com/science/article/pii/S095741742301223X',
      description: '',
    },
  ],
  // Invited talks (rendered as: Title, Venue, Location, Year [video])
  talks: [
    {
      title: 'Fault tolerant SGLang serving with Ray actor backend',
      venue: 'SGLang Office Hour',
      year: '2026',
      link: 'https://www.youtube.com/watch?v=JiC_KQFoCLk&t=73s',
    },
  ],
  // Academic service (rendered as its own section; supports markdown links)
  service: ['Reviewer: ICLR, NeurIPS, ICML'],
  // Display articles from your medium or dev account. (Optional)
  blog: {
    source: 'medium', // medium | dev
    username: 'xinyzng', // to hide blog section, keep it empty
    limit: 2, // How many articles to display. Max is 10.
  },
  googleAnalytics: {
    id: 'G-MCVEMXQ6Y0', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: {
    id: '',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'dark',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: true,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'procyon',
    ],

    // Custom theme, applied to `procyon` theme
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with ❤️`,

  enablePWA: true,
};

export default CONFIG;
