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
            'AI agentic framework with tool calling and browser-use to reproduce Manus. 38k+ GitHub stars.',
          imageUrl:
            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-ZoLi0ewIEm3B0XcMMLTxtbAptDzgTV.png',
          link: 'https://github.com/mannaandpoem/OpenManus',
        },
        {
          title: 'Go-Viral',
          description:
            'Trained on millions of viral tweets to copy the pattern into your tweets.',
          imageUrl:
            'go-viral.png',
          link: 'https://go-viral.org/',
        },
        {
          title: 'JIPCAD',
          description:
            'Supervised by professor Carlo Sequin at UC Berkeley, I led the JIPCAD project which utilizes powerful math parsing capabilities to generate elegant, artistic geometries.',
          imageUrl:
            'https://jipcad.github.io/assets/images/lumpysphere-1d893b3795ce9cceb88ed095414f9778.gif',
          link: 'https://jipcad.github.io/',
        },
      ],
    },
  },
  seo: {
    title: 'Xinyu Zhang - Developer & Researcher',
    description: 'Software Engineer at Meta, AI Researcher, and Founder of Alphice with experience at Carnegie Mellon, MIT, and UC Berkeley.',
    imageURL: 'https://cdn.cara.app/production/posts/90150109-c03f-426b-bdfe-fe766c7c4603/carolcao-DesYvvET19XWhP2CIep4i-BA817950-CE37-4C4F-A7CD-B563EF648B36.jpg',
  },
  social: {
    linkedin: 'zhxy',
    twitter: 'xinyzng',
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
      company: 'Meta',
      position: 'Software Developer Engineer Intern',
      from: 'May 2022',
      to: 'Aug 2022',
      companyLink: 'https://meta.com',
      description: 'Best rating in the cohort and top 5% in performance. Implemented an identity matching framework for facebook ads that produced 8-figures revenue gain.'
    },
    {
      company: 'Southeast University',
      position: 'AI Researcher',
      from: 'Jun 2021',
      to: 'Jan 2022',
      companyLink: 'https://www.seu.edu.cn/english/',
      description: 'Implemented the SOTA approach for cross-lingual knowledge graph question answering. Achieved > 1% improvement compared with the previous SOTA on cross-lingual QA. Paper accepted by top AI journal(Q1) Expert Systems with Applications.'
    },
    {
      company: 'UC Berkeley',
      position: 'Research Apprentice',
      from: 'Jan 2020',
      to: 'May 2021',
      companyLink: 'https://berkeley.edu',
      description: 'Advised by Professor Carlo Sequin to lead JIPCAD: graphics generation through interactive procedure.'
    },
    {
      company: 'Alphice',
      position: 'Founder',
      from: '2023',
      to: 'Present',
      companyLink: 'https://alphice.com',
      description: 'Built immersive AI storytelling platform with 30k+ users across iOS and Android. Got into YC and A16Z interviews.'
    },
  ],
  certifications: [
    {
      name: 'International Design Award',
      body: 'Recognition for Excellence in Design Innovation',
      year: '2024',
      link: 'https://www.idesignawards.com/winners/zoom.php?eid=9-55678-24'
    },
    {
      name: 'European Product Design Award',
      body: 'Distinguished Achievement in Product Design',
      year: '2024',
      link: 'https://www.productdesignaward.eu/winners/epda/2024/11916/'
    },
    {
      body: 'National Olympiad in Mathematics',
    },
  ],
  educations: [
    {
      institution: 'Carnegie Mellon University',
      degree: "Master's in Computational Data Science (AI+System Track)",
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
      degree: 'EECS, Operating Systems: A, GPA: 4.0',
      from: 'May 2020',
      to: 'Aug 2021',
    },
    {
      institution: 'Southeast University',
      degree: 'Bachelor of Engineering in Information Engineering',
      from: 'Sep 2017',
      to: 'May 2021',
    },
  ],
  publications: [
    {
      title: 'CLRN: A Reasoning Network for Multi-Relation Question Answering',
      conferenceName: '',
      journalName: 'Expert Systems with Applications',
      authors: 'Xinyu Zhang',
      link: 'https://www.sciencedirect.com/science/article/pii/S095741742301223X',
      description: 'Introduces CLRN, a novel CLKGQA model that enables multi-hop reasoning across different language KGs without merging. It addresses two key issues: removing dependency on fused KGs and improving entity alignment. CLRN uses an iterative framework with Entity Alignment, extracting potential alignment triple pairs and mining missing relations. Experiments demonstrate improved performance in both QA and EA tasks, contributing insights into their correlation.',
    },
  ],
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
    defaultTheme: 'pastel',

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
