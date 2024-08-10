// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'xyuzh', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/xyuzh/xyuzh.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/xyuzh/portfolio, then set base to '/portfolio/'.
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
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'JIPCAD',
          description:
            'Supervised by professor Carlo Sequin at UC Berkeley, I led the JIPCAD project which utilizes powerful math parsing capabilities to generate elegant, artistic geometries that embrace the beauty of math.',
          imageUrl:
            'https://jipcad.github.io/assets/images/lumpysphere-1d893b3795ce9cceb88ed095414f9778.gif',
          link: 'https://jipcad.github.io/',
        },
      ],
    },
  },
  seo: {
    title: 'Dream bold & Work hard',
    description: 'The mission of Xinyu Zhang at birth is undefined, but when I realize I can use my brain to think and body to build, I immediately want to colonize the outer space!',
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
    '🏓 Pingpong',
    '🪂 Sky diving',
    '☕ Latte art',
    '⛷️ Ski',
    '🧑‍🍳 Cooking'
  ],
  experiences: [
    {
      company: 'Alphice',
      position: 'Founder',
      from: '2024',
      to: 'Present',
      companyLink: 'https:/alphice.com',
    },
    {
      company: 'Meta',
      position: 'Software Engineer',
      from: 'Sep 2023',
      to: 'Present',
      companyLink: 'https://example.com',
    },
  ],
  certifications: [
    {
      body: 'National Olympiad in Mathematics',
    },
  ],
  educations: [
    {
      institution: 'Carnegie Mellon Univeristy',
      degree: 'School of Computer Science',
      from: 'Jan 2022',
      to: 'Aug 2023',
    },
    {
      institution: 'Massachusetts Institute of Technology',
      degree: 'Advanced Study',
      from: 'Jan 2022',
      to: 'May 2022',
    },
  ],
  publications: [
    {
      title: 'CLRN: A reasoning network for multi-relation question answering over Cross-lingual Knowledge Graphs',
      conferenceName: 'Expert Systems with Applications',
      journalName: '',
      authors: '',
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
