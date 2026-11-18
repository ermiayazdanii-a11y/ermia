import {
  PORTRAIT_CUTOUT_FALLBACK_PATH,
  PORTRAIT_CUTOUT_PATH,
  PORTRAIT_IMAGE_PATH,
} from '../styles/designTokens';

export type Locale = 'en' | 'fa';

export interface JourneyLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface JourneyMilestone {
  id: string;
  number: string;
  date: string;
  year: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  imageAlt?: string;
  conceptTag?: string;
  importance: 'standard' | 'highlight';
  whyItMatters?: string;
  links?: JourneyLink[];
}

export interface FlowScreenshot {
  id: string;
  src: string;
  alt: string;
  caption: string;
  device: 'desktop' | 'mobile';
}

export interface ProjectCaseStudy {
  id: string;
  index: string;
  status: string;
  title: string;
  subtitle: string;
  introduction: string;
  purpose: string;
  mainConcept: string;
  designDirection: string;
  features: {
    title: string;
    stage: 'implemented' | 'planned' | 'conceptual';
    stateLabel: string;
    detail: string;
  }[];
  progressSteps: {
    phase: string;
    status: 'active' | 'exploring' | 'completed';
    note: string;
  }[];
  technologies: {
    name: string;
    levelNote: string;
  }[];
  comparisonTitle: string;
  comparisonRows: {
    aspect: string;
    earlierExperiments: string;
    flowDirection: string;
  }[];
  screenshots: FlowScreenshot[];
}

export interface SkillGroup {
  id: 'current' | 'learning' | 'interests';
  title: string;
  subtitle: string;
  items: {
    name: string;
    levelLabel: string;
    description: string;
  }[];
}

export interface JournalEntry {
  id: string;
  index: string;
  category: string;
  dateLabel: string;
  readTime: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
}

export interface ErmiaLocaleContent {
    nav: {
      home: string;
      about: string;
      journey: string;
      projects: string;
      skills: string;
      journal: string;
      contact: string;
      caseStudyCta: string;
      toggleLangLabel: string;
      themeLightLabel: string;
      themeDarkLabel: string;
    };
    hero: {
      kicker: string;
      fullName: string;
      headline: string;
      intro: string;
      journeyCta: string;
      projectsCta: string;
      portraitAlt: string;
      marqueeItems: string[];
      highlights: {
        label: string;
        value: string;
      }[];
    };
    about: {
      kicker: string;
      title: string;
      intro: string;
      githubCtaLabel: string;
      pillars: {
        index: string;
        heading: string;
        body: string;
      }[];
    };
    journey: {
      kicker: string;
      title: string;
      subtitle: string;
      jumpLabel: string;
      allMilestonesLabel: string;
      turningPointsLabel: string;
      startLabel: string;
      highlightBadge: string;
      whyItMattersLabel: string;
      milestones: JourneyMilestone[];
      summaryTitle: string;
      summaryItems: {
        label: string;
        value: string;
      }[];
    };
    projects: {
      kicker: string;
      title: string;
      subtitle: string;
      tabs: {
        overview: string;
        concept: string;
        progress: string;
        architecture: string;
      };
      purposeLabel: string;
      conceptLabel: string;
      designLabel: string;
      featuresLabel: string;
      progressLabel: string;
      techLabel: string;
      devStateLabel: string;
      devStateTitle: string;
      devStateBody: string;
      devStateBadge: string;
      devStatePillars: {
        index: string;
        title: string;
        stage: 'implemented' | 'planned' | 'conceptual';
        detail: string;
      }[];
      openCaseStudyLabel: string;
      conceptPreviewLabel: string;
      conceptLayerHint: string;
      stageLabels: {
        implemented: string;
        planned: string;
        conceptual: string;
      };
      comparisonHeaders: {
        aspect: string;
        earlier: string;
        flow: string;
      };
      featured: ProjectCaseStudy;
      futureNoteTitle: string;
      futureNoteBody: string;
      caseStudyPage: {
        backToPortfolio: string;
        breadcrumbCurrent: string;
        pageKicker: string;
        pageTitle: string;
        pageLead: string;
        architectureHeading: string;
        layers: {
          number: string;
          name: string;
          stage: 'implemented' | 'planned' | 'conceptual';
          role: string;
          summary: string;
          details: string[];
        }[];
        designPrinciplesHeading: string;
        designPrinciples: {
          title: string;
          body: string;
        }[];
        statusNoteTitle: string;
        statusNoteBody: string;
        nextChapterLabel: string;
        nextChapterCta: string;
      };
    };
  skills: {
    kicker: string;
    title: string;
    subtitle: string;
    groups: SkillGroup[];
  };
  journal: {
    kicker: string;
    title: string;
    subtitle: string;
    readNoteLabel: string;
    closeAria: string;
    entries: JournalEntry[];
  };
  today: {
    kicker: string;
    title: string;
    description: string;
    focusItems: {
      index: string;
      title: string;
      detail: string;
    }[];
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    githubCardLabel: string;
    githubButtonLabel: string;
    privacyNote: string;
    nameLabel: string;
    namePlaceholder: string;
    senderEmailLabel: string;
    senderEmailPlaceholder: string;
    topicLabel: string;
    topicOptions: string[];
    messageLabel: string;
    messagePlaceholder: string;
    validationRequiredError: string;
    validationEmailError: string;
    submitLabel: string;
    draftReadyTitle: string;
    draftReadyMailtoBody: string;
    draftReadyPrivateBody: string;
    openMailLabel: string;
    copyDraftLabel: string;
    copiedDraftLabel: string;
    resetLabel: string;
    footerTagline: string;
    footerNavHeading: string;
    footerConnectHeading: string;
    footerGithubLabel: string;
    copyright: string;
  };
}

export const MEDIA_ASSETS = {
  portrait: PORTRAIT_IMAGE_PATH,
  portraitCutout: PORTRAIT_CUTOUT_PATH,
  portraitCutoutFallback: PORTRAIT_CUTOUT_FALLBACK_PATH,
};

export const ERMIA_CONTENT: Record<Locale, ErmiaLocaleContent> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      journey: 'My Journey',
      projects: 'Projects',
      skills: 'Skills',
      journal: 'Journal',
      contact: 'Contact',
      caseStudyCta: 'FLOW Study',
      toggleLangLabel: 'فارسی',
      themeLightLabel: 'Switch to light theme',
      themeDarkLabel: 'Switch to dark theme',
    },
    hero: {
      kicker: 'Personal Portfolio · ERMIA',
      fullName: 'Ermia Yazdani',
      headline: 'Ideas Become Reality',
      intro:
        "Welcome to my personal portfolio. I'm Ermia Yazdani. This website is where I share my projects, creative interests, and learning journey.",
      journeyCta: 'Read My Journey',
      projectsCta: 'Explore FLOW',
      portraitAlt: 'Stylized portrait of Ermia Yazdani',
      marqueeItems: [
        'BUILDING',
        'LEARNING',
        'EXPLORING',
        'CREATING',
        'PYTHON',
        'FLOW',
        'GUITAR',
      ],
      highlights: [
        { label: 'Active Focus', value: 'Learning Python' },
        { label: 'Web Foundation', value: 'HTML Basics' },
        { label: 'Personal Project', value: 'FLOW (In Progress)' },
        { label: 'Creative Practice', value: 'Guitar & Music' },
      ],
    },
    about: {
      kicker: 'About Ermia',
      title: 'An honest look at who I am and why I build.',
      intro:
        "I'm Ermia Yazdani. Programming is a relatively recent chapter in my life—I am currently learning Python, building on basic HTML, playing guitar, and shaping FLOW without exaggerated titles or invented claims.",
      githubCtaLabel: 'Follow on GitHub',
      pillars: [
        {
          index: '01',
          heading: 'Who I Am',
          body: 'I am naturally curious and drawn to how well-crafted things feel—whether it is the tone of a guitar chord or the clarity of a dark screen. I value steady effort over exaggeration.',
        },
        {
          index: '02',
          heading: 'Technology & Programming',
          body: 'My relationship with programming is relatively recent. I started by understanding basic HTML structure and am currently focused on learning Python to think more clearly in logic and systems.',
        },
        {
          index: '03',
          heading: 'What I Enjoy Building',
          body: 'I enjoy creating calm, useful tools for everyday life. Earlier app experiments did not always work out as expected, and each imperfect attempt taught me how to keep ideas simpler and more intentional.',
        },
        {
          index: '04',
          heading: 'Interests & Current Study',
          body: 'Outside of screens, guitar and music keep my sense of rhythm and patience grounded. Right now, I am combining Python study with interface design exploration while developing FLOW.',
        },
      ],
    },
    journey: {
      kicker: 'My Journey',
      title: 'Step by step—from early curiosity to building FLOW.',
      subtitle:
        'A chronological, editable record of how my interests in music, technology, failed experiments, and programming came together. Jump to any period below.',
      jumpLabel: 'Jump to period',
      allMilestonesLabel: 'All Milestones',
      turningPointsLabel: 'Turning Points',
      startLabel: 'Follow the timeline from the beginning',
      highlightBadge: 'Turning Point',
      whyItMattersLabel: 'Why this matters',
      milestones: [
        {
          id: 'origins-music',
          number: '01',
          date: 'Period 01',
          year: 'Origins',
          title: 'Guitar, Music & Creative Rhythm',
          description:
            'Before writing any code, music and playing guitar shaped how I think about practice. Learning an instrument teaches you that clumsy repetitions gradually turn into muscle memory and expression.',
          category: 'Interests & Foundation',
          importance: 'standard',
          whyItMatters:
            'Patience learned through music carries directly into debugging code and refining ideas that feel unfamiliar at first.',
        },
        {
          id: 'first-html',
          number: '02',
          date: 'Period 02',
          year: 'HTML',
          title: 'Discovering How the Web Is Built',
          description:
            'I picked up HTML at a basic level to understand what actually sits behind a webpage—headings, links, containers, and structure. Seeing plain markup turn into a readable page made technology feel approachable.',
          category: 'Web Basics',
          importance: 'standard',
          whyItMatters:
            'Understanding basic HTML removed the mystery of the browser and sparked the urge to create a space of my own.',
        },
        {
          id: 'early-experiments',
          number: '03',
          date: 'Period 03',
          year: 'Experiments',
          title: 'Early App Experiments That Did Not Work as Expected',
          description:
            'Excited to build quickly, I tried putting together early app concepts before having strong programming fundamentals. Several of those attempts broke down, felt cluttered, or never worked the way I imagined.',
          category: 'Honest Lessons',
          importance: 'highlight',
          whyItMatters:
            'Those unfinished experiments were not wasted time—they showed me that clarity of purpose matters more than rushing features.',
          links: [{ label: 'See how this shaped FLOW', href: '#projects' }],
        },
        {
          id: 'learning-python',
          number: '04',
          date: 'Period 04',
          year: 'Python',
          title: 'Starting a Focused Python Learning Journey',
          description:
            'To move past trial-and-error, I began learning Python as a recent programming focus—practicing variables, conditions, loops, and clean problem-solving step by step.',
          category: 'Active Learning',
          importance: 'standard',
          whyItMatters:
            'Learning Python gives me real programming foundations so future versions of my ideas are built on solid logic rather than guesswork.',
        },
        {
          id: 'building-flow',
          number: '05',
          date: 'Ongoing',
          year: 'FLOW',
          title: 'Conceiving & Designing FLOW for Daily Life',
          description:
            'Drawing from what failed in earlier app attempts, I started shaping FLOW—a personal daily-life application designed to keep everyday focus, habits, and reflections calm and manageable.',
          category: 'Personal Project',
          conceptTag: 'FLOW · Concept Preview (Unreleased)',
          importance: 'highlight',
          whyItMatters:
            'FLOW is the bridge between everything I am learning: personal discipline, clean design direction, and practical coding.',
          links: [{ label: 'Read the FLOW Case Study', href: '#projects' }],
        },
        {
          id: 'today-ermia',
          number: '06',
          date: 'Present',
          year: 'Today',
          title: 'Building ERMIA & Continuing the Work',
          description:
            'Today I am actively practicing Python, keeping my HTML foundations sharp, refining the FLOW concept without rushing to claim it is finished, and continuing to play guitar.',
          category: 'Current Chapter',
          importance: 'standard',
          whyItMatters:
            'Documenting where I actually stand keeps me accountable to real growth.',
          links: [{ label: "See What's Next", href: '#today' }],
        },
      ],
      summaryTitle: 'Where the Journey Stands (Honest Snapshot)',
      summaryItems: [
        { label: 'Programming Journey', value: 'Recent & Active' },
        { label: 'Language in Study', value: 'Python' },
        { label: 'Web Markup', value: 'HTML (Basic)' },
        { label: 'Flagship Concept', value: 'FLOW (In Progress)' },
      ],
    },
    projects: {
      kicker: 'Projects & Case Study',
      title: 'FLOW — A personal daily-life application in progress.',
      subtitle:
        'Rather than listing invented client work, this section explores FLOW honestly: why it exists, what I am designing, and what still needs to be built.',
      tabs: {
        overview: 'Purpose & Intro',
        concept: 'Concept & Design',
        progress: 'Progress & Tech',
        architecture: 'Development State',
      },
      purposeLabel: 'Why I Started FLOW',
      conceptLabel: 'Main Concept',
      designLabel: 'Design Direction',
      featuresLabel: 'Planned & Explored Features',
      progressLabel: 'Honest Development Progress',
      techLabel: 'Confirmed Technology & Study Alignment',
      devStateLabel: 'Active Development Snapshot',
      devStateTitle: 'In Active Development · Unreleased Concept Architecture',
      devStateBody:
        'FLOW is currently focused on daily structure and foundational Python logic before public UI capture. Every module below distinguishes clearly between implemented architecture decisions, planned builds, and early-stage concepts.',
      devStateBadge: 'Pre-Release Build',
      devStatePillars: [
        {
          index: '01',
          title: 'Three-Layer Daily Cadence',
          stage: 'implemented',
          detail:
            'Concept model settled: Priorities, Practice Blocks, and Evening Reflection inside one non-noisy routine.',
        },
        {
          index: '02',
          title: 'Python Core Logic & Data Shape',
          stage: 'planned',
          detail:
            'Currently translating Python study exercises into clean, predictable task state and habit persistence.',
        },
        {
          index: '03',
          title: 'Focused Interface Capture',
          stage: 'conceptual',
          detail:
            'Authentic screen captures will publish here once the interactive daily view reaches working prototype milestones.',
        },
      ],
      openCaseStudyLabel: 'Open Dedicated FLOW Case Study',
      conceptPreviewLabel: 'FLOW · Interactive Concept Preview (Unreleased)',
      conceptLayerHint: 'Select any layer to inspect its daily role.',
      stageLabels: {
        implemented: 'Implemented',
        planned: 'Planned',
        conceptual: 'Conceptual',
      },
      comparisonHeaders: {
        aspect: 'Focus Area',
        earlier: 'Earlier App Experiments',
        flow: 'FLOW Approach',
      },
      featured: {
        id: 'flow',
        index: '01',
        status: 'Personal Project · In Active Development (Unreleased)',
        title: 'FLOW',
        subtitle: 'A calm daily-life application built around everyday clarity.',
        introduction:
          'FLOW is my personal daily-life application project. It grew out of wanting a single, uncluttered space to organize daily priorities, small routines, and personal reflections without noisy notifications or overwhelming dashboards.',
        purpose:
          'Most productivity apps feel like corporate spreadsheets or demand constant maintenance. FLOW is meant to feel like an evening desk—quiet, focused, and easy to return to every day.',
        mainConcept:
          'Break the day into three gentle layers: what truly matters today, small habits or practice blocks (like coding or guitar), and a brief closing reflection—all inside one cohesive flow.',
        designDirection:
          'Deep obsidian and crisp light-paper surfaces to minimize eye strain, high-contrast typography for instant readability, subtle Liquid Glass navigation cues, and zero visual clutter.',
        features: [
          {
            title: 'Core Purpose & Concept Definition',
            stage: 'implemented',
            stateLabel: 'Implemented in Project Spec',
            detail:
              'Clarified the three-layer daily structure based directly on lessons from earlier failed app experiments.',
          },
          {
            title: 'Daily Focus & Priority Flow',
            stage: 'conceptual',
            stateLabel: 'Conceptual',
            detail:
              'A stripped-back daily view highlighting only the few tasks that actually move the day forward.',
          },
          {
            title: 'Practice & Routine Blocks',
            stage: 'planned',
            stateLabel: 'Planned',
            detail:
              'Dedicated quiet space to track daily learning habits such as Python exercises or guitar practice.',
          },
          {
            title: 'Evening Reflection Notes',
            stage: 'conceptual',
            stateLabel: 'Conceptual',
            detail:
              'Simple prompts to capture what worked, what felt difficult, and what to adjust tomorrow.',
          },
        ],
        progressSteps: [
          {
            phase: '01. Problem & Personal Purpose',
            status: 'completed',
            note: 'Defined why earlier app attempts failed and clarified FLOW around daily simplicity.',
          },
          {
            phase: '02. Visual Language & Interface Concept',
            status: 'active',
            note: 'Refining dark and light readability, layout hierarchy, and daily user flow.',
          },
          {
            phase: '03. Core Logic & Python Practice',
            status: 'exploring',
            note: 'Learning Python fundamentals to build clean backend logic and data handling.',
          },
          {
            phase: '04. Public Release',
            status: 'exploring',
            note: 'Not yet released—taking time to build it properly rather than shipping half-working features.',
          },
        ],
        technologies: [
          {
            name: 'Python',
            levelNote: 'Currently learning for core logic & structure',
          },
          {
            name: 'HTML',
            levelNote: 'Basic foundational understanding for web structure',
          },
          {
            name: 'UI/UX Exploration',
            levelNote: 'Crafting calm layouts and user-friendly daily flows',
          },
        ],
        comparisonTitle: 'What Earlier Experiments Taught Me for FLOW',
        comparisonRows: [
          {
            aspect: 'Scope & Complexity',
            earlierExperiments:
              'Tried to add too many features at once before basics worked',
            flowDirection:
              'Starts intentionally small around core daily-life essentials',
          },
          {
            aspect: 'Technical Foundation',
            earlierExperiments:
              'Jumped straight into building without understanding core logic',
            flowDirection:
              'Paired directly with structured Python learning and HTML basics',
          },
          {
            aspect: 'User Experience',
            earlierExperiments:
              'Felt scattered and hard to maintain on a daily basis',
            flowDirection:
              'Guided by a calm, uncluttered flow with clear priorities',
          },
        ],
        screenshots: [],
      },
      futureNoteTitle: 'Why Honesty Drives the Roadmap',
      futureNoteBody:
        'Every additional project or build preview enters this space only after core logic runs reliably—prioritizing clarity and genuine progress over rushing features.',
      caseStudyPage: {
        backToPortfolio: 'Back to Portfolio',
        breadcrumbCurrent: 'FLOW Case Study',
        pageKicker: 'Project Case Study · Unreleased Concept',
        pageTitle: 'FLOW — Designing a calmer daily-life tool from scratch.',
        pageLead:
          'FLOW grew directly out of earlier app experiments that tried to do too much too soon. Here is the complete thinking behind its three-layer structure, honest engineering progress, and visual direction.',
        architectureHeading: 'Three-Layer Daily Concept Architecture',
        layers: [
          {
            number: '01',
            name: 'Morning Focus & Priorities',
            stage: 'conceptual',
            role: 'Quiet Daily Anchor',
            summary:
              'Highlight only one to three concrete priorities for the day without buried subfolders or noisy badge counters.',
            details: [
              'Designed to keep morning check-ins under two minutes',
              'Clear distinction between non-negotiable focus and optional notes',
              'No aggressive overdue counters designed to create stress',
            ],
          },
          {
            number: '02',
            name: 'Deliberate Practice Blocks',
            stage: 'planned',
            role: 'Steady Skill Habit',
            summary:
              'Simple session blocks dedicated to recurring practice such as Python fundamentals, HTML structure, or guitar rehearsal.',
            details: [
              'Tracks consistency rather than gamified streak pressure',
              'Built to pair directly with Python script logic in active study',
              'Calm low-glare surface tuned for long focus sessions',
            ],
          },
          {
            number: '03',
            name: 'Evening Closing Reflection',
            stage: 'implemented',
            role: 'Mindful Closure',
            summary:
              'Brief closing prompts asking what actually moved forward today and what can stay simpler tomorrow.',
            details: [
              'Core structural specification settled from journal learnings',
              'Transforms finished days into clear context for the next morning',
              'Zero cluttered analytics charts or fabricated productivity scores',
            ],
          },
        ],
        designPrinciplesHeading: 'Visual & Ergonomic Restraint',
        designPrinciples: [
          {
            title: 'Obsidian & Paper Comfort',
            body: 'Engineered with deep obsidian dark tones for evening desk comfort and crisp warm-paper daylight contrast so returning to the app feels calm.',
          },
          {
            title: 'Bilingual LTR / RTL Symmetry',
            body: 'Every rhythm, alignment, and typographic scale is shaped to support both English and Persian seamlessly without broken spacing.',
          },
          {
            title: 'Earn Every Screen State',
            body: 'No fabricated dashboards or rushed visual fluff—interface views grow strictly in step with real underlying Python logic.',
          },
        ],
        statusNoteTitle: 'Where FLOW Stands Right Now',
        statusNoteBody:
          'FLOW is not released yet. Building it honestly means practicing Python fundamentals step by step, keeping HTML & UI structure disciplined, and sharing authentic captures once live screens are complete.',
        nextChapterLabel: 'Continue Exploring',
        nextChapterCta: 'Read Learning Journal & Contact',
      },
    },
    skills: {
      kicker: 'Learning, Skills & Interests',
      title: 'Distinguishing what I know today from what I am actively exploring.',
      subtitle:
        'Honest clarity about my current foundation, ongoing programming study, and the creative interests that keep me curious.',
      groups: [
        {
          id: 'current',
          title: 'Current Abilities',
          subtitle: 'Foundations I can use right now',
          items: [
            {
              name: 'HTML (Basic Level)',
              levelLabel: 'Foundation',
              description:
                'Understanding semantic page structure, headings, links, media containers, and organizing content cleanly.',
            },
            {
              name: 'Product Concepting & Visual Taste',
              levelLabel: 'Strength',
              description:
                'Shaping clean obsidian aesthetics, recognizing clutter, and focusing interfaces around real daily needs.',
            },
            {
              name: 'Iterating From Mistakes',
              levelLabel: 'Practice',
              description:
                'Reviewing why earlier app experiments fell short and turning friction into clearer next steps.',
            },
          ],
        },
        {
          id: 'learning',
          title: 'Currently Learning',
          subtitle: 'Active programming & web study',
          items: [
            {
              name: 'Python',
              levelLabel: 'Active Study',
              description:
                'Learning syntax, data structures, control flow, and logical problem-solving to build real application behavior.',
            },
            {
              name: 'Web Layout & CSS Craft',
              levelLabel: 'Exploring',
              description:
                'Improving responsive spacing, bilingual RTL/LTR alignment, and smooth interactive transitions.',
            },
            {
              name: 'Application Architecture Basics',
              levelLabel: 'Exploring',
              description:
                'Understanding how user interfaces connect cleanly to data models as FLOW grows.',
            },
          ],
        },
        {
          id: 'interests',
          title: 'Personal Interests',
          subtitle: 'What fuels creativity outside code',
          items: [
            {
              name: 'Guitar & Music',
              levelLabel: 'Passion',
              description:
                'Playing guitar, exploring melodies, and appreciating how daily musical practice builds focus and patience.',
            },
            {
              name: 'Daily-Life Tools',
              levelLabel: 'Curiosity',
              description:
                'Thinking about how software can feel calmer and genuinely helpful in ordinary routines.',
            },
            {
              name: 'Digital Identity & Storytelling',
              levelLabel: 'Craft',
              description:
                'Designing personal web spaces that reflect real growth instead of generic templates.',
            },
          ],
        },
      ],
    },
    journal: {
      kicker: 'Journal',
      title: 'Notes from a recent learning journey.',
      subtitle:
        'Short personal reflections on learning to code, building FLOW, and balancing technology with music. Easily expandable in data files.',
      readNoteLabel: 'Read Note',
      closeAria: 'Close journal note',
      entries: [
        {
          id: 'lessons-from-failed-experiments',
          index: '01',
          category: 'Reflection',
          dateLabel: 'Note 01',
          readTime: '3 min read',
          title:
            'What Earlier App Experiments Taught Me When They Did Not Work',
          excerpt:
            'Trying to build before knowing the fundamentals led to messy prototypes—and eventually to a much clearer mindset.',
          paragraphs: [
            'My earliest attempts at making apps did not turn out the way I hoped. I wanted to jump straight to finished screens before truly understanding how logic, structure, and scope fit together.',
            'At first, an experiment falling short feels discouraging. Looking back, those moments were the exact reason I slowed down, started studying Python properly, and redesigned FLOW around one simple daily purpose instead of ten half-built ideas.',
            'Treating failed experiments as honest data rather than something to hide makes every next attempt noticeably calmer and sharper.',
          ],
        },
        {
          id: 'learning-python-after-html',
          index: '02',
          category: 'Learning',
          dateLabel: 'Note 02',
          readTime: '3 min read',
          title: 'Learning Python Step by Step After Basic HTML',
          excerpt:
            'Moving from static webpage tags to thinking in variables, functions, and real application logic.',
          paragraphs: [
            'Learning HTML at a basic level taught me how information is arranged on a screen. It is satisfying to see structure appear in a browser, yet static pages only take you so far.',
            'Picking up Python as a recent focus feels like opening the engine room. Every small script that runs cleanly reinforces how breaking a problem into small pieces makes intimidating challenges manageable.',
          ],
        },
        {
          id: 'guitar-and-coding-patience',
          index: '03',
          category: 'Music & Focus',
          dateLabel: 'Note 03',
          readTime: '2 min read',
          title: 'Why Guitar Practice and Programming Share the Same Patience',
          excerpt:
            'Neither music nor code rewards rushing—both reward showing up with curiosity every day.',
          paragraphs: [
            'When you learn a new chord progression on guitar, your fingers hesitate at first. Speed only shows up after calm, accurate repetition.',
            'Learning programming feels surprisingly similar. Taking time with fundamentals—rather than pretending to know everything overnight—is what eventually lets you create something genuinely yours.',
          ],
        },
      ],
    },
    today: {
      kicker: 'Today & What Is Next',
      title: 'Focused on steady growth, real foundations, and FLOW.',
      description:
        'Right now, ERMIA is a living snapshot of where I am: learning with humility, building with intention, and enjoying the process of turning curiosity into craft.',
      focusItems: [
        {
          index: '01',
          title: 'Deepening Python Fundamentals',
          detail:
            'Practicing core programming logic consistently so future builds stand on solid ground.',
        },
        {
          index: '02',
          title: 'Iterating on FLOW',
          detail:
            'Refining the daily-life experience, user flow, and interface details one honest step at a time.',
        },
        {
          index: '03',
          title: 'Guitar, Music & Creative Balance',
          detail:
            'Keeping music close as a daily source of rhythm, clarity, and creative inspiration.',
        },
      ],
    },
    contact: {
      kicker: 'Contact',
      title: 'Connect & follow the journey.',
      subtitle:
        'Follow my public profile on GitHub or prepare a formatted note below. For privacy, my personal email address is kept hidden unless a mailto target is explicitly configured.',
      githubCardLabel: 'Verified Public GitHub Profile',
      githubButtonLabel: 'Open GitHub Profile',
      privacyNote:
        'This static site does not automatically transmit messages over a server or expose private email addresses.',
      nameLabel: 'Your Name',
      namePlaceholder: 'Your name',
      senderEmailLabel: 'Your Email',
      senderEmailPlaceholder: 'you@example.com',
      topicLabel: 'Topic',
      topicOptions: [
        'About FLOW',
        'Learning & Tech',
        'Music & Creative Ideas',
        'General Hello',
      ],
      messageLabel: 'Message',
      messagePlaceholder: 'Write a short note...',
      validationRequiredError:
        'Please complete your name, email address, and message before preparing a draft.',
      validationEmailError: 'Please enter a valid email address.',
      submitLabel: 'Prepare Message Draft',
      draftReadyTitle: 'Message draft prepared locally',
      draftReadyMailtoBody:
        'Your note has been formatted locally (nothing was sent automatically). Use your email client below to send it.',
      draftReadyPrivateBody:
        'Your note has been formatted locally—no message was transmitted because direct email publishing is disabled for privacy. You can copy your formatted note below or connect via GitHub.',
      openMailLabel: 'Open in Email App',
      copyDraftLabel: 'Copy Formatted Note',
      copiedDraftLabel: 'Copied to Clipboard',
      resetLabel: 'Write Another Note',
      footerTagline:
        'ERMIA — Personal digital space documenting curiosity, Python & web learning, FLOW, and music.',
      footerNavHeading: 'Explore',
      footerConnectHeading: 'Connect',
      footerGithubLabel: 'GitHub',
      copyright: '© ERMIA — Ermia Yazdani',
    },
  },
  fa: {
    nav: {
      home: 'خانه',
      about: 'درباره من',
      journey: 'مسیر من',
      projects: 'پروژه‌ها',
      skills: 'مهارت‌ها',
      journal: 'ژورنال',
      contact: 'تماس',
      caseStudyCta: 'پروژه FLOW',
      toggleLangLabel: 'EN',
      themeLightLabel: 'تغییر به حالت روشن',
      themeDarkLabel: 'تغییر به حالت تیره',
    },
    hero: {
      kicker: 'پورتفولیوی شخصی · ERMIA',
      fullName: 'ارمیا یزدانی',
      headline: 'ایده‌ها به واقعیت تبدیل می‌شوند.',
      intro:
        'به پورتفولیوی شخصی من خوش آمدید. من ارمیا یزدانی هستم. اینجا جایی است که پروژه‌ها، علایق خلاقانه و مسیر یادگیری خودم را به اشتراک می‌گذارم.',
      journeyCta: 'مشاهده مسیر من',
      projectsCta: 'آشنایی با FLOW',
      portraitAlt: 'پرتره استایل‌شده ارمیا یزدانی',
      marqueeItems: [
        'ساختن',
        'یادگیری',
        'کشف کردن',
        'خلق کردن',
        'پایتون',
        'FLOW',
        'گیتار',
      ],
      highlights: [
        { label: 'تمرکز فعلی', value: 'یادگیری پایتون' },
        { label: 'پایه وب', value: 'آشنایی با HTML' },
        { label: 'پروژه شخصی', value: 'FLOW (در حال توسعه)' },
        { label: 'علاقه شخصی', value: 'گیتار و موسیقی' },
      ],
    },
    about: {
      kicker: 'درباره ارمیا',
      title: 'نگاهی صادقانه به اینکه کیستم و چرا به ساختن علاقه دارم.',
      intro:
        'من ارمیا یزدانی هستم و اینجا خبری از عناوین ساختگی یا ادعاهای اغراق‌آمیز نیست. ERMIA فضای دیجیتال شخصی من برای ثبت پیشرفت واقعی است؛ یادگیری پایتون، پایه HTML، نواختن گیتار و شکل‌دادن به ایده FLOW.',
      githubCtaLabel: 'مشاهده در گیت‌هاب',
      pillars: [
        {
          index: '۰۱',
          heading: 'من کیستم',
          body: 'به‌طور طبیعی کنجکاو هستم و به حس‌وحال جزئیات خوب اهمیت می‌دهم؛ چه صدای یک آکورد گیتار باشد و چه شفافیت یک صفحه تیره و مرتب. پیشرفت پیوسته را به نمایشِ بی‌اساس ترجیح می‌دهم.',
        },
        {
          index: '۰۲',
          heading: 'رابطه من با فناوری و برنامه‌نویسی',
          body: 'آشنایی من با برنامه‌نویسی یک تجربه نسبتاً تازه است. با مفاهیم پایه HTML شروع کردم تا ساختار صفحات وب را بفهمم و اکنون به‌صورت جدی در حال یادگیری پایتون برای تقویت تفکر منطقی هستم.',
        },
        {
          index: '۰۳',
          heading: 'چه چیزهایی را دوست دارم بسازم',
          body: 'ساخت ابزارهای آرام و کاربردی برای زندگی روزمره برایم جذاب است. برخی آزمایش‌های قبلی من در ساخت اپ مطابق انتظار پیش نرفتند، اما همان تجربه‌های ناقص به من یاد دادند سادگی و هدف روشن از همه‌چیز مهم‌تر است.',
        },
        {
          index: '۰۴',
          heading: 'علایق و مسیر یادگیری امروز',
          body: 'در کنار کد و طراحی، گیتار و موسیقی به من ریتم، تمرکز و صبر می‌دهند. در حال حاضر یادگیری پایتون و تمرین طراحی تجربه کاربری را هم‌زمان با شکل‌دادن به FLOW دنبال می‌کنم.',
        },
      ],
    },
    journey: {
      kicker: 'مسیر من',
      title: 'قدم‌به‌قدم؛ از کنجکاوی‌های اولیه تا شکل‌گیری FLOW.',
      subtitle:
        'روایتی زمانی و قابل ویرایش از اینکه چگونه علاقه به موسیقی، تجربه‌های ناموفق اولیه و یادگیری برنامه‌نویسی کنار هم قرار گرفتند.',
      jumpLabel: 'پرش به دوره',
      allMilestonesLabel: 'همه مراحل',
      turningPointsLabel: 'نقاط عطف',
      startLabel: 'مسیر را از ابتدا دنبال کنید',
      highlightBadge: 'نقطه عطف',
      whyItMattersLabel: 'چرا این مرحله مهم است',
      milestones: [
        {
          id: 'origins-music',
          number: '۰۱',
          date: 'مرحله ۰۱',
          year: 'آغاز',
          title: 'گیتار، موسیقی و درک ریتم تمرین',
          description:
            'پیش از نوشتن اولین خط کد، موسیقی و نواختن گیتار شکل نگاه من به تمرین را ساختند. ساز زدن به آدم یاد می‌دهد تکرارهای ناشیانه با صبر و حوصله به بیان روان تبدیل می‌شوند.',
          category: 'علایق و ریشه‌ها',
          importance: 'standard',
          whyItMatters:
            'صبوری‌ای که در تمرین موسیقی شکل می‌گیرد، هنگام یادگیری مفاهیم تازه کدنویسی و رفع خطاها دقیقاً به کمک می‌آید.',
        },
        {
          id: 'first-html',
          number: '۰۲',
          date: 'مرحله ۰۲',
          year: 'HTML',
          title: 'آشنایی با ساختار پایه وب و HTML',
          description:
            'در سطح مقدماتی سراغ HTML رفتم تا بفهمم پشت یک صفحه وب چه ساختاری قرار دارد؛ تیترها، لینک‌ها و چیدمان عناصر. دیدن اینکه چند خط ساده در مرورگر جان می‌گیرد، فناوری را برایم ملموس‌تر کرد.',
          category: 'پایه وب',
          importance: 'standard',
          whyItMatters:
            'یادگیری پایه HTML ترس از محیط مرورگر را از بین برد و انگیزه ساخت فضای شخصی خودم را ایجاد کرد.',
        },
        {
          id: 'early-experiments',
          number: '۰۳',
          date: 'مرحله ۰۳',
          year: 'تجربه‌ها',
          title: 'آزمایش‌های اولیه ساخت اپ که مطابق انتظار پیش نرفتند',
          description:
            'با هیجان ساختن سریع، پیش از آنکه پایه برنامه‌نویسی محکمی داشته باشم چند ایده اولیه اپلیکیشن را امتحان کردم. بعضی از آن‌ها به نتیجه نرسیدند، ساختار شلوغی داشتند یا آن‌طور که می‌خواستم کار نکردند.',
          category: 'تجربه واقعی',
          importance: 'highlight',
          whyItMatters:
            'آن تجربه‌های ناموفق وقت تلف‌شده نبودند؛ به من نشان دادند روشن بودن هدف و یادگیری اصول پایه از شتاب‌زدگی مهم‌تر است.',
          links: [{ label: 'ببینید چطور به شکل‌گیری FLOW کمک کرد', href: '#projects' }],
        },
        {
          id: 'learning-python',
          number: '۰۴',
          date: 'مرحله ۰۴',
          year: 'پایتون',
          title: 'شروع جدی یادگیری پایتون',
          description:
            'برای عبور از آزمون‌وخطای پراکنده، یادگیری پایتون را به‌عنوان تمرکز تازه برنامه‌نویسی آغاز کردم؛ تمرین متغیرها، شرط‌ها، حلقه‌ها و حل مسئله به شکل منظم.',
          category: 'یادگیری فعال',
          importance: 'standard',
          whyItMatters:
            'پایتون به من پایه واقعی منطق برنامه‌نویسی می‌دهد تا ایده‌های آینده روی ستون‌های محکم‌تری ساخته شوند.',
        },
        {
          id: 'building-flow',
          number: '۰۵',
          date: 'در جریان',
          year: 'FLOW',
          title: 'طراحی و شکل‌دهی اپلیکیشن روزمره FLOW',
          description:
            'با تکیه بر درس‌هایی که از تجربه‌های قبلی گرفتم، ایده FLOW را شروع کردم؛ یک اپلیکیشن شخصی برای زندگی روزمره با هدف ایجاد نظم آرام در کارها، عادت‌ها و یادداشت‌ها.',
          category: 'پروژه شخصی',
          conceptTag: 'FLOW · پیش‌نمایش مفهومی (منتشرنشده)',
          importance: 'highlight',
          whyItMatters:
            'FLOW نقطه تلاقی تمام چیزهایی است که در حال یادگیری آن‌ها هستم: نظم شخصی، سلیقه بصری و کدنویسی عملی.',
          links: [{ label: 'مطالعه صفحه پروژه FLOW', href: '#projects' }],
        },
        {
          id: 'today-ermia',
          number: '۰۶',
          date: 'اکنون',
          year: 'امروز',
          title: 'ساخت ERMIA و ادامه مسیر یادگیری',
          description:
            'امروز مشغول تمرین مستمر پایتون، تقویت پایه وب، تکمیل تدریجی مفهوم FLOW بدون ادعای انتشار نهایی، و البته نواختن گیتار هستم.',
          category: 'فصل فعلی',
          importance: 'standard',
          whyItMatters:
            'ثبت صادقانه جایگاه فعلی کمک می‌کند مسیر رشد واقعی و قابل لمس باقی بماند.',
          links: [{ label: 'ادامه مسیر و برنامه‌های بعدی', href: '#today' }],
        },
      ],
      summaryTitle: 'خلاصه صادقانه وضعیت فعلی',
      summaryItems: [
        { label: 'مسیر برنامه‌نویسی', value: 'تازه و در حال رشد' },
        { label: 'زبان در حال یادگیری', value: 'پایتون (Python)' },
        { label: 'آشنایی با وب', value: 'HTML در سطح پایه' },
        { label: 'پروژه اصلی', value: 'FLOW (در حال ساخت)' },
      ],
    },
    projects: {
      kicker: 'پروژه‌ها و مطالعه موردی',
      title: 'FLOW — یک اپلیکیشن شخصی برای زندگی روزمره (در حال توسعه).',
      subtitle:
        'به‌جای معرفی پروژه‌های ساختگی کارفرمایی، این بخش به‌صورت شفاف به FLOW می‌پردازد: چرا شکل گرفت، چه مفهومی دارد و هنوز در چه مرحله‌ای از ساخت است.',
      tabs: {
        overview: 'معرفی و هدف',
        concept: 'مفهوم و طراحی',
        progress: 'پیشرفت و فناوری',
        architecture: 'وضعیت توسعه',
      },
      purposeLabel: 'چرا FLOW را شروع کردم',
      conceptLabel: 'ایده محوری',
      designLabel: 'جهت‌گیری طراحی',
      featuresLabel: 'قابلیت‌های در حال طراحی و بررسی',
      progressLabel: 'وضعیت واقعی توسعه',
      techLabel: 'فناوری‌ها و مسیر یادگیری مرتبط',
      devStateLabel: 'نمای صادقانه توسعه',
      devStateTitle: 'در حال توسعه فعال · معماری مفهومی پیش از انتشار',
      devStateBody:
        'تمرکز فعلی FLOW بر شکل‌دهی منطق پایه با پایتون و ساختار آرام روزانه پیش از ثبت نماهای نهایی است. بخش‌های زیر به‌وضوح میان تصمیم‌های نهایی‌شده، برنامه‌ریزی‌شده و مفاهیم اولیه تفکیک قائل می‌شوند.',
      devStateBadge: 'نسخه پیش از انتشار',
      devStatePillars: [
        {
          index: '۰۱',
          title: 'ریتم سه‌لایه روزانه',
          stage: 'implemented',
          detail:
            'ساختار مفهومی نهایی‌شده: اولویت‌های روز، بلوک‌های تمرین آرام و مرور پایان روز در یک مسیر خلوت.',
        },
        {
          index: '۰۲',
          title: 'منطق پایتون و مدل داده',
          stage: 'planned',
          detail:
            'در حال تبدیل تمرین‌های پایتون به منطق تمیز برای نگهداری وضعیت کارهای روزانه و تمرین‌ها.',
        },
        {
          index: '۰۳',
          title: 'ثبت رابط کاربری واقعی',
          stage: 'conceptual',
          detail:
            'تصاویر واقعی از محیط نرم‌افزار زمانی اینجا منتشر می‌شوند که نمونه تعاملی به ثبات کامل برسد.',
        },
      ],
      openCaseStudyLabel: 'مطالعه صفحه کامل پروژه FLOW',
      conceptPreviewLabel: 'FLOW · پیش‌نمایش تعاملی مفهوم (منتشرنشده)',
      conceptLayerHint: 'روی هر لایه کلیک کنید تا نقش روزانه آن را ببینید.',
      stageLabels: {
        implemented: 'پیاده‌سازی‌شده',
        planned: 'برنامه‌ریزی‌شده',
        conceptual: 'مفهومی',
      },
      comparisonHeaders: {
        aspect: 'حوزه تمرکز',
        earlier: 'آزمایش‌های قبلی اپ',
        flow: 'رویکرد جدید در FLOW',
      },
      featured: {
        id: 'flow',
        index: '۰۱',
        status: 'پروژه شخصی · در حال طراحی و توسعه (منتشرنشده)',
        title: 'FLOW',
        subtitle: 'یک اپلیکیشن آرام برای نظم بخشیدن به جریان زندگی روزمره.',
        introduction:
          'FLOW پروژه شخصی من برای مدیریت زندگی روزمره است. این ایده از نیاز به یک فضای واحد و بدون شلوغی شکل گرفت؛ جایی برای اولویت‌های روز، عادت‌های کوچک و یادداشت‌های شخصی، بدون اعلان‌های آزاردهنده.',
        purpose:
          'بیشتر ابزارهای بهره‌وری شبیه جدول‌های پیچیده اداری هستند. هدف من در FLOW ساخت فضایی است که حس یک میز کار آرام شبانه را بدهد و بازگشت روزانه به آن دلپذیر باشد.',
        mainConcept:
          'تقسیم روز به سه لایه ساده: آنچه امروز واقعاً مهم است، بلوک‌های کوتاه تمرین و عادت (مثل تمرین پایتون یا گیتار) و یک مرور کوتاه در پایان روز.',
        designDirection:
          'سطوح تاریک ابسیدین و تم روشن خوانا برای کاهش خستگی چشم، تایپوگرافی شفاف با کنتراست استاندارد، جزئیات ظریف شیشه‌ای و پرهیز از شلوغی بصری.',
        features: [
          {
            title: 'تعریف هدف و معماری مفهومی سه‌لایه',
            stage: 'implemented',
            stateLabel: 'نهایی‌شده در طرح پایه',
            detail:
              'جمع‌بندی درس‌های تجربه‌های قبلی و تعریف ساختار ساده روزانه برای FLOW.',
          },
          {
            title: 'جریان اولویت‌های روزانه',
            stage: 'conceptual',
            stateLabel: 'مفهومی',
            detail:
              'نمای خلوت روزانه که فقط چند کار کلیدی امروز را در مرکز توجه نگه می‌دارد.',
          },
          {
            title: 'بخش تمرین و عادت‌های شخصی',
            stage: 'planned',
            stateLabel: 'برنامه‌ریزی‌شده',
            detail:
              'فضایی آرام برای پیگیری تمرین‌های روزانه مثل یادگیری پایتون یا تمرین گیتار.',
          },
          {
            title: 'یادداشت‌های مرور پایان روز',
            stage: 'conceptual',
            stateLabel: 'مفهومی',
            detail:
              'پرسش‌های کوتاه برای ثبت اینکه امروز چه چیزی خوب پیش رفت و فردا چه چیزی را ساده‌تر کنیم.',
          },
        ],
        progressSteps: [
          {
            phase: '۰۱. تعریف مسئله و هدف شخصی',
            status: 'completed',
            note: 'بررسی دلایل شکست آزمایش‌های قبلی و تمرکز FLOW روی سادگی روزمره.',
          },
          {
            phase: '۰۲. زبان بصری و تجربه کاربری',
            status: 'active',
            note: 'پالایش تم روشن و تیره، چیدمان بخش‌ها و جریان استفاده روزانه.',
          },
          {
            phase: '۰۳. منطق برنامه و تمرین پایتون',
            status: 'exploring',
            note: 'یادگیری اصول پایتون برای پیاده‌سازی منطق تمیز و مدیریت داده‌ها.',
          },
          {
            phase: '۰۴. انتشار عمومی',
            status: 'exploring',
            note: 'هنوز منتشر نشده است؛ تمرکز روی یادگیری و ساخت درست است، نه عجله در انتشار.',
          },
        ],
        technologies: [
          {
            name: 'Python',
            levelNote: 'در حال یادگیری برای منطق و ساختار برنامه',
          },
          {
            name: 'HTML',
            levelNote: 'آشنایی پایه با ساختار صفحات وب',
          },
          {
            name: 'طراحی رابط کاربری',
            levelNote: 'تمرین چیدمان خلوت و تجربه کاربری روان',
          },
        ],
        comparisonTitle: 'تفاوت FLOW با آزمایش‌های قبلی من',
        comparisonRows: [
          {
            aspect: 'دامنه و پیچیدگی',
            earlierExperiments:
              'تلاش برای افزودن قابلیت‌های زیاد پیش از کارکردن هسته اصلی',
            flowDirection:
              'شروع آگاهانه و کوچک با تمرکز بر نیازهای واقعی روزمره',
          },
          {
            aspect: 'پایه فنی',
            earlierExperiments:
              'ورود مستقیم به ساخت بدون تسلط کافی بر منطق برنامه‌نویسی',
            flowDirection:
              'هم‌گام با یادگیری منظم پایتون و تقویت مفاهیم پایه وب',
          },
          {
            aspect: 'تجربه کاربری',
            earlierExperiments:
              'پراکندگی صفحات و دشواری استفاده مداوم در طول روز',
            flowDirection:
              'یک جریان ساده، آرام و خوانا با اولویت‌بندی روشن',
          },
        ],
        screenshots: [],
      },
      futureNoteTitle: 'چرا شفافیت مسیر را هدایت می‌کند',
      futureNoteBody:
        'پروژه‌ها و تصاویر جدید فقط زمانی به این فضا اضافه می‌شوند که منطق اصلی آن‌ها به‌درستی کار کند؛ اولویت با کیفیت و یادگیری واقعی است نه عجله.',
      caseStudyPage: {
        backToPortfolio: 'بازگشت به پورتفولیو',
        breadcrumbCurrent: 'مطالعه موردی FLOW',
        pageKicker: 'مطالعه موردی پروژه · در حال توسعه',
        pageTitle: 'FLOW — طراحی یک ابزار آرام روزمره از پایه.',
        pageLead:
          'ایده FLOW مستقیماً از درس‌های آزمایش‌های قبلی شکل گرفت؛ تجربه‌هایی که خیلی زود سراغ شلوغی رفته بودند. در این صفحه، ساختار سه‌لایه، مسیر فنی واقعی و جهت‌گیری طراحی آن را می‌خوانید.',
        architectureHeading: 'معماری مفهومی سه‌لایه روزانه',
        layers: [
          {
            number: '۰۱',
            name: 'تمرکز صبحگاهی و اولویت‌ها',
            stage: 'conceptual',
            role: 'لنگر آرام روز',
            summary:
              'برجسته‌کردن فقط یک تا سه کار کلیدی امروز، بدون پوشه‌های تو در تو یا عددهای اضطراب‌آور.',
            details: [
              'طراحی‌شده برای مرور صبحگاهی کمتر از دو دقیقه',
              'تفکیک روشن میان کارهای اصلی روز و یادداشت‌های جانبی',
              'بدون شمارنده‌های استرس‌زا برای کارهای عقب‌افتاده',
            ],
          },
          {
            number: '۰۲',
            name: 'بلوک‌های تمرین آگاهانه',
            stage: 'planned',
            role: 'عادت یادگیری پیوسته',
            summary:
              'بخش‌های ساده برای پیگیری تمرین‌های مستمر مانند پایتون، ساختار وب یا تمرین گیتار.',
            details: [
              'تمرکز بر تداوم واقعی به جای امتیازهای نمایشی',
              'هم‌سو با منطق کدنویسی پایتون در مسیر یادگیری فعلی',
              'رابط کم‌نور و راحت برای تمرکز طولانی',
            ],
          },
          {
            number: '۰۳',
            name: 'مرور آرام پایان روز',
            stage: 'implemented',
            role: 'بستن آگاهانه روز',
            summary:
              'پرسش‌های کوتاه شبانه درباره اینکه امروز چه چیزی پیش رفت و فردا را چطور ساده‌تر کنیم.',
            details: [
              'طرح ساختاری بر پایه تجربه‌های ثبت‌شده در ژورنال نهایی شده است',
              'تبدیل پایان روز به نقطه شروع شفاف برای صبح فردا',
              'پرهیز از نمودارهای شلوغ و درصدهای ساختگی بهره‌وری',
            ],
          },
        ],
        designPrinciplesHeading: 'انضباط بصری و راحتی کاربری',
        designPrinciples: [
          {
            title: 'آرامش بصری در تاریکی و روز',
            body: 'پالت ابسیدین عمیق برای استفاده شبانه و کنتراست کاغذ روشن برای روز، تا بازگشت روزانه به برنامه خسته‌کننده نباشد.',
          },
          {
            title: 'هماهنگی کامل دوزبانه (RTL / LTR)',
            body: 'فاصله‌گذاری، سلسله‌مراتب تایپوگرافی و چیدمان برای پشتیبانی هم‌زمان از فارسی و انگلیسی بدون بهم‌ریختگی طراحی شده است.',
          },
          {
            title: 'رشد هم‌قدم با کد واقعی',
            body: 'هیچ تصویر یا صفحه نمایشی ساختگی وجود ندارد؛ رابط کاربری قدم‌به‌قدم همراه با منطق پایتون تکامل می‌یابد.',
          },
        ],
        statusNoteTitle: 'جایگاه فعلی پروژه FLOW',
        statusNoteBody:
          'این پروژه هنوز منتشر نشده است. پیشرفت واقعی یعنی تمرین منظم پایتون، محکم‌کردن پایه وب و انتشار تصاویر واقعی زمانی که هسته برنامه به بلوغ برسد.',
        nextChapterLabel: 'ادامه مطالعه',
        nextChapterCta: 'مشاهده ژورنال یادگیری و تماس',
      },
    },
    skills: {
      kicker: 'یادگیری، مهارت‌ها و علایق',
      title: 'تفکیک روشن میان توانایی‌های فعلی و موضوعاتی که در حال یادگیری هستم.',
      subtitle:
        'تصویری واقعی از نقطه فعلی من؛ بدون درصدهای ساختگی یا ادعای تسلط کامل.',
      groups: [
        {
          id: 'current',
          title: 'توانایی‌های فعلی',
          subtitle: 'مهارت‌هایی که اکنون با آن‌ها کار می‌کنم',
          items: [
            {
              name: 'HTML (سطح پایه)',
              levelLabel: 'پایه',
              description:
                'آشنایی با ساختار معنایی صفحه، تیترها، لینک‌ها، تصاویر و سازمان‌دهی ساده محتوا.',
            },
            {
              name: 'ایده‌پردازی محصول و سلیقه بصری',
              levelLabel: 'نقطه قوت',
              description:
                'درک زیبایی‌شناسی مینیمال ابسیدین، تشخیص شلوغی رابط و طراحی بر اساس نیاز واقعی روزانه.',
            },
            {
              name: 'یادگیری از تجربه‌های قبلی',
              levelLabel: 'تجربه عملی',
              description:
                'تحلیل اینکه چرا آزمایش‌های قبلی مطابق انتظار پیش نرفتند و تبدیل آن به تصمیم‌های بهتر.',
            },
          ],
        },
        {
          id: 'learning',
          title: 'در حال یادگیری',
          subtitle: 'مسیر فعال برنامه‌نویسی و وب',
          items: [
            {
              name: 'پایتون (Python)',
              levelLabel: 'مطالعه فعال',
              description:
                'یادگیری ساختار زبان، داده‌ها، شرط‌ها و حل مسئله برای ساخت منطق واقعی نرم‌افزار.',
            },
            {
              name: 'چیدمان وب و طراحی واکنش‌گرا',
              levelLabel: 'در حال کشف',
              description:
                'تمرین فاصله‌گذاری استاندارد، هماهنگی دوزبانه فارسی/انگلیسی و تعامل‌های نرم.',
            },
            {
              name: 'اصول معماری اپلیکیشن',
              levelLabel: 'در حال کشف',
              description:
                'آشنایی با چگونگی اتصال رابط کاربری به منطق برنامه و داده‌ها هم‌گام با رشد FLOW.',
            },
          ],
        },
        {
          id: 'interests',
          title: 'علایق شخصی',
          subtitle: 'منابع الهام در کنار دنیای کد',
          items: [
            {
              name: 'گیتار و موسیقی',
              levelLabel: 'علاقه عمیق',
              description:
                'نواختن گیتار، کشف ملودی‌ها و تجربه اینکه تمرین روزانه موسیقی چگونه صبر و تمرکز را تقویت می‌کند.',
            },
            {
              name: 'ابزارهای زندگی روزمره',
              levelLabel: 'کنجکاوی',
              description:
                'فکر کردن به اینکه چطور نرم‌افزار می‌تواند آرام‌تر و واقعاً مفیدتر در کنار زندگی روزانه قرار بگیرد.',
            },
            {
              name: 'هویت دیجیتال و روایت شخصی',
              levelLabel: 'خلاقیت',
              description:
                'طراحی فضاهای وب شخصی که رشد واقعی را بازتاب می‌دهند نه قالب‌های تکراری.',
            },
          ],
        },
      ],
    },
    journal: {
      kicker: 'ژورنال',
      title: 'یادداشت‌هایی از یک مسیر تازه یادگیری.',
      subtitle:
        'تأملات کوتاه درباره یادگیری کدنویسی، ساخت FLOW و پیوند موسیقی با صبوری در فناوری. قابل گسترش در فایل داده.',
      readNoteLabel: 'خواندن یادداشت',
      closeAria: 'بستن پنجره یادداشت',
      entries: [
        {
          id: 'lessons-from-failed-experiments',
          index: '۰۱',
          category: 'تجربه',
          dateLabel: 'یادداشت ۰۱',
          readTime: '۳ دقیقه مطالعه',
          title:
            'آزمایش‌های قبلی ساخت اپ وقتی کار نکردند چه چیزی به من یاد دادند',
          excerpt:
            'تلاش برای ساختن پیش از یادگیری اصول پایه به نمونه‌های شلوغ منجر شد و در نهایت نگاه من را شفاف‌تر کرد.',
          paragraphs: [
            'نخستین تلاش‌های من برای ساخت اپلیکیشن آن‌طور که امیدوار بودم پیش نرفت. می‌خواستم خیلی سریع به صفحه نهایی برسم، قبل از اینکه منطق، ساختار و محدوده پروژه را درست بشناسم.',
            'در لحظه اول، به نتیجه نرسیدن یک آزمایش دلسردکننده است؛ اما با نگاهی دقیق‌تر، همان تجربه‌ها باعث شدند سرعت را کم کنم، یادگیری پایتون را جدی بگیرم و FLOW را حول یک هدف روشن روزمره طراحی کنم.',
            'پذیرش صادقانه تجربه‌های ناموفق به‌عنوان بخشی از مسیر، قدم‌های بعدی را بسیار آرام‌تر و حساب‌شده‌تر می‌کند.',
          ],
        },
        {
          id: 'learning-python-after-html',
          index: '۰۲',
          category: 'یادگیری',
          dateLabel: 'یادداشت ۰۲',
          readTime: '۳ دقیقه مطالعه',
          title: 'یادگیری گام‌به‌گام پایتون پس از آشنایی با HTML پایه',
          excerpt:
            'حرکت از تگ‌های ایستا در صفحه وب به سمت تفکر در قالب متغیرها، توابع و منطق برنامه.',
          paragraphs: [
            'آشنایی اولیه با HTML به من نشان داد اطلاعات چطور در یک صفحه چیده می‌شوند. دیدن نتیجه فوری در مرورگر لذت‌بخش است، اما صفحات ایستا تنها بخش ظاهری ماجرا هستند.',
            'شروع یادگیری پایتون مثل باز کردن درِ اتاق موتور است. هر اسکریپت کوچکی که درست اجرا می‌شود یادآوری می‌کند تقسیم یک مسئله بزرگ به قدم‌های کوچک، کارهای ترسناک را شدنی می‌کند.',
          ],
        },
        {
          id: 'guitar-and-coding-patience',
          index: '۰۳',
          category: 'موسیقی و تمرکز',
          dateLabel: 'یادداشت ۰۳',
          readTime: '۲ دقیقه مطالعه',
          title: 'چرا تمرین گیتار و یادگیری کدنویسی به یک جنس از صبر نیاز دارند',
          excerpt:
            'نه موسیقی و نه برنامه‌نویسی با عجله به دست نمی‌آیند؛ هر دو پاداش حضور روزانه و کنجکاو هستند.',
          paragraphs: [
            'وقتی یک الگوی آکورد تازه را روی گیتار تمرین می‌کنید، در ابتدا انگشت‌ها مکث می‌کنند. روانی و سرعت فقط پس از تکرار آرام و دقیق به دست می‌آیند.',
            'یادگیری برنامه‌نویسی شباهت عجیبی به همین تجربه دارد. وقت گذاشتن روی مفاهیم پایه—به‌جای وانمود کردن به دانستن همه‌چیز در یک شب—همان چیزی است که در نهایت اجازه می‌دهد اثر واقعی خودتان را بسازید.',
          ],
        },
      ],
    },
    today: {
      kicker: 'امروز و قدم بعدی',
      title: 'تمرکز بر رشد واقعی، پایه‌های محکم و پروژه FLOW.',
      description:
        'امروز ERMIA تصویری زنده از جایی است که ایستاده‌ام: یادگیری با تواضع، ساختن با نیت روشن و لذت بردن از تبدیل کنجکاوی به مهارت.',
      focusItems: [
        {
          index: '۰۱',
          title: 'عمیق‌تر کردن پایتون',
          detail:
            'تمرین مستمر منطق برنامه‌نویسی تا پروژه‌های آینده روی بنیان فنی درستی بایستند.',
        },
        {
          index: '۰۲',
          title: 'تکامل تدریجی FLOW',
          detail:
            'پالایش جریان روزانه، تجربه کاربری و جزئیات رابط به‌صورت گام‌به‌گام و واقعی.',
        },
        {
          index: '۰۳',
          title: 'گیتار، موسیقی و تعادل خلاقانه',
          detail:
            'حفظ موسیقی در زندگی روزمره به‌عنوان منبع ریتم، آرامش و الهام خلاق.',
        },
      ],
    },
    contact: {
      kicker: 'تماس',
      title: 'در ارتباط باشید.',
      subtitle:
        'می‌توانید پروفایل گیت‌هاب من را دنبال کنید یا پیش‌نویس پیام خود را در بخش زیر آماده کنید. برای حفظ حریم خصوصی، آدرس ایمیل شخصی به‌صورت عمومی نمایش داده نمی‌شود.',
      githubCardLabel: 'پروفایل رسمی گیت‌هاب',
      githubButtonLabel: 'مشاهده پروفایل گیت‌هاب',
      privacyNote:
        'این وب‌سایت ایستا پیام‌ها را به‌صورت خودکار ارسال نمی‌کند و ایمیل شخصی را افشا نمی‌کند.',
      nameLabel: 'نام شما',
      namePlaceholder: 'نام خود را بنویسید',
      senderEmailLabel: 'ایمیل شما',
      senderEmailPlaceholder: 'you@example.com',
      topicLabel: 'موضوع پیام',
      topicOptions: [
        'درباره FLOW',
        'یادگیری و فناوری',
        'موسیقی و ایده‌ها',
        'سلام و آشنایی',
      ],
      messageLabel: 'پیام',
      messagePlaceholder: 'پیام کوتاه خود را بنویسید...',
      validationRequiredError: 'لطفاً نام، آدرس ایمیل و متن پیام خود را وارد کنید.',
      validationEmailError: 'لطفاً یک آدرس ایمیل معتبر وارد کنید.',
      submitLabel: 'آماده‌سازی پیش‌نویس پیام',
      draftReadyTitle: 'پیش‌نویس پیام به‌صورت محلی آماده شد',
      draftReadyMailtoBody:
        'متن پیام شما آماده شد (ارسال خودکار انجام نشده است). برای ارسال می‌توانید از دکمه زیر برنامه ایمیل خود را باز کنید.',
      draftReadyPrivateBody:
        'متن پیام شما به‌صورت محلی قالب‌بندی شد؛ چون ایمیل شخصی برای حفظ حریم خصوصی پنهان است، هیچ پیامی ارسال نشد. می‌توانید متن آماده را کپی کنید یا از طریق گیت‌هاب در ارتباط باشید.',
      openMailLabel: 'باز کردن در ایمیل',
      copyDraftLabel: 'کپی متن پیام',
      copiedDraftLabel: 'در حافظه کپی شد',
      resetLabel: 'نوشتن پیام دیگر',
      footerTagline:
        'ERMIA — فضای دیجیتال شخصی برای ثبت کنجکاوی، یادگیری پایتون و وب، پروژه FLOW و موسیقی.',
      footerNavHeading: 'بخش‌ها',
      footerConnectHeading: 'ارتباط',
      footerGithubLabel: 'گیت‌هاب',
      copyright: '© ERMIA — ارمیا یزدانی',
    },
  },
};
