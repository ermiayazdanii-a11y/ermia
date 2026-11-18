import type { FlowScreenshot, Locale } from './ermiaData';

export type FlowFeatureStatus = 'available' | 'in_development' | 'planned';

export interface FlowAppMediaScreen extends FlowScreenshot {
  webpSrc: string;
  screenName: string;
  screenSubtitle: string;
  highlights: string[];
}

export interface FlowFeatureModule {
  id:
    | 'dashboard'
    | 'avatar-studio'
    | 'widgets'
    | 'routines'
    | 'memories'
    | 'themes'
    | 'levels';
  index: string;
  title: string;
  status: FlowFeatureStatus;
  summary: string;
  details: string[];
  screenId?: string;
}

export interface FlowVersionHistoryEntry {
  version: string;
  releaseDate: string;
  developmentStatus: string;
  newFeatures: string[];
  improvements: string[];
  bugFixes: string[];
}

export interface FlowDemoLocaleContent {
  kicker: string;
  title: string;
  subtitle: string;
  disclaimerBadge: string;
  tabs: {
    today: string;
    themes: string;
    companion: string;
    widgets: string;
  };
  themeLabels: {
    heading: string;
    obsidianMist: string;
    auroraDusk: string;
    daylightPaper: string;
    accentHeading: string;
    cyan: string;
    violet: string;
    amber: string;
  };
  todayCopy: {
    greeting: string;
    dayPulseLabel: string;
    moods: string[];
    intentionsLabel: string;
    defaultIntentions: string[];
    focusLabel: string;
    addSessionBtn: string;
  };
  companionCopy: {
    heading: string;
    note: string;
    presets: {
      id: 'mochi' | 'sora' | 'kumo';
      name: string;
      breed: string;
      status: string;
      badge: string;
    }[];
    actions: {
      pet: string;
      tilt: string;
      wag: string;
    };
    reactionMessages: {
      pet: string;
      tilt: string;
      wag: string;
    };
  };
  widgetsCopy: {
    heading: string;
    plannedNote: string;
    cards: {
      id: string;
      title: string;
      subtitle: string;
      meta: string;
    }[];
  };
}

export interface FlowStoryChapter {
  id: string;
  progressPercent: number;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  screenId: 'today-dashboard' | 'living-space-studio' | 'companion-sanctuary' | 'focus-nebula';
  statusTag: string;
  accentLabel: string;
  floatingPanels: {
    eyebrow: string;
    value: string;
    meta: string;
  }[];
}

export interface FlowProductLocaleContent {
  storySection: {
    chapters: FlowStoryChapter[];
    scrollHint: string;
    jumpToChapterAria: string;
    inspect3DHint: string;
    inspectCurrentScreenCta: string;
    releaseTransitionCta: string;
  };
  hero: {
    platformTag: string;
    appName: string;
    headline: string;
    subtitle: string;
    description: string;
    primaryShowcaseCta: string;
    secondaryDemoCta: string;
    inspectScreensLabel: string;
    screensCountLabel: string;
  };
  statusLabels: Record<FlowFeatureStatus, string>;
  screensSection: {
    kicker: string;
    title: string;
    subtitle: string;
    previousLabel: string;
    nextLabel: string;
    openFullscreenLabel: string;
    dragOrSwipeHint: string;
    detailsHeading: string;
  };
  modulesSection: {
    kicker: string;
    title: string;
    subtitle: string;
    inspectScreenCta: string;
    scrollSyncHint: string;
    noScreenshotNote: string;
  };
  modules: FlowFeatureModule[];
  demo: FlowDemoLocaleContent;
  downloadSection: {
    kicker: string;
    title: string;
    subtitle: string;
    statusTitles: {
      coming_soon: string;
      private_beta: string;
      public_apk: string;
      google_play: string;
    };
    statusDescriptions: {
      coming_soon: string;
      private_beta: string;
      public_apk: string;
      google_play: string;
    };
    ctaLabels: {
      coming_soon: string;
      private_beta: string;
      public_apk: string;
      google_play: string;
    };
    externalHostNotice: string;
    specLabels: {
      platform: string;
      version: string;
      releaseDate: string;
      downloadSize: string;
      compatibility: string;
      distributionStatus: string;
    };
    platformValue: string;
    releaseInfoHeading: string;
    journalKicker: string;
    journalHeading: string;
    journalLabels: {
      version: string;
      releaseDate: string;
      status: string;
      newFeatures: string;
      improvements: string;
      bugFixes: string;
    };
    whatsNewHeading: string;
    releaseNotesLinkLabel: string;
    privacyLinkLabel: string;
    privacyTitle: string;
    privacyBody: string;
    supportLinkLabel: string;
    whatsNewItems: string[];
    versionHistory: FlowVersionHistoryEntry[];
  };
}

export const FLOW_MEDIA_ASSETS = {
  icon: {
    src: '/assets/aistudio/photo_2026-11-18_19-56-44_435b76d3.jpg',
    webpSrc: '/images/flow/flow-icon.webp',
    altEn: 'FLOW Android app icon — luminous iridescent glass orb on dark obsidian squircle',
    altFa: 'آیکون اپلیکیشن اندروید FLOW — گوی شیشه‌ای نورانی روی پس‌زمینه ابسیدین',
  },
  screens: {
    dashboard: {
      src: '/assets/aistudio/photo_2026-11-18_19-56-43_dbf92142.jpg',
      webpSrc: '/images/flow/flow-dashboard.webp',
    },
    themes: {
      src: '/assets/aistudio/photo_2026-11-18_19-56-41_0cda4cbe.jpg',
      webpSrc: '/images/flow/flow-themes.webp',
    },
    companion: {
      src: '/assets/aistudio/photo_2026-11-18_19-56-39_2e542892.jpg',
      webpSrc: '/images/flow/flow-companion.webp',
    },
    focus: {
      src: '/assets/aistudio/photo_2026-11-18_19-56-35_c4bdb792.jpg',
      webpSrc: '/images/flow/flow-focus.webp',
    },
  },
} as const;

export const FLOW_SCREENS_BY_LOCALE: Record<Locale, FlowAppMediaScreen[]> = {
  en: [
    {
      id: 'today-dashboard',
      src: FLOW_MEDIA_ASSETS.screens.dashboard.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.dashboard.webpSrc,
      device: 'mobile',
      screenName: 'Today Dashboard',
      screenSubtitle: 'Day Pulse · Companion · Open Horizon',
      caption: 'FLOW Today Dashboard — Real Android Capture',
      alt: 'FLOW Android Today Dashboard showing Mochi Golden Retriever companion card, Twilight Drift Day Pulse wave slider, Open Horizon intention prompt, and five-tab floating dock',
      highlights: [
        'Evening greeting ("Softening down, ermia") with a calm atmospheric Space switch',
        'Live Mochi companion summary ("Calm & Ready") with Open Companion and Wave actions',
        'Day Pulse rhythm wave slider showing Focus today, Habits, and current rhythm timestamp',
        'Open Horizon intention prompt (+ Intend) alongside Enter Focus and Avatar Studio shortcuts',
      ],
    },
    {
      id: 'living-space-studio',
      src: FLOW_MEDIA_ASSETS.screens.themes.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.themes.webpSrc,
      device: 'mobile',
      screenName: 'Living Space Studio',
      screenSubtitle: 'Appearance · Palettes · Motion',
      caption: 'FLOW Living Space Studio — Real Android Capture',
      alt: 'FLOW Android Living Space Studio screen displaying Atmosphere and Abstract Avatar switcher, Obsidian/Daylight/System modes, Obsidian Mist and Aurora Dusk palettes, accent light swatches, and motion controls',
      highlights: [
        'Top mode selector switching cleanly between Atmosphere and Abstract Avatar',
        'Three appearance presets: Obsidian, Daylight, and System follow',
        'Curated theme palettes (Obsidian Mist, Aurora Dusk) paired with Accent Light hues',
        'Living Background style (Liquid Drift, Aurora Wave), Dock Style, and Visual Quality tiers',
      ],
    },
    {
      id: 'companion-sanctuary',
      src: FLOW_MEDIA_ASSETS.screens.companion.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.companion.webpSrc,
      device: 'mobile',
      screenName: 'Companion Sanctuary',
      screenSubtitle: 'Collection (16) · 2D & 3D Preview',
      caption: 'FLOW Companion Sanctuary — Real Android Capture',
      alt: 'FLOW Android Companion Sanctuary showing Mochi Golden Retriever in 2D Preview with Pet, Head Tilt, and Tail Wag controls, plus Collection (16) filter tabs including 3D-ready Shiba Inu',
      highlights: [
        'Interactive companion actions (Pet, Head Tilt, Tail Wag) inside a calm translucent stage',
        'Transparent build note directly in-app: "Stylized 2D illustration • 3D model for Golden Retriever coming soon"',
        'Expandable Collection (16) filterable across All, Dogs (6), Cats (4), and additional companions',
        'Live mix of 3D-ready companions (Shiba Inu) and 2D interactive previews',
      ],
    },
    {
      id: 'focus-nebula',
      src: FLOW_MEDIA_ASSETS.screens.focus.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.focus.webpSrc,
      device: 'mobile',
      screenName: 'Focus Nebula',
      screenSubtitle: 'Deep Flow Timer · Soundscapes',
      caption: 'FLOW Focus Nebula — Real Android Capture',
      alt: 'FLOW Android Focus Nebula screen displaying Deep Flow intention input, 15m/25m/45m/60m duration controls, Break afterward options, ambient soundscape selector, and Recent Sessions list',
      highlights: [
        'Set a focused intention (such as "Deep Flow") before entering an uninterrupted session',
        'Flexible presets (15m, 25m, 45m, 60m) with continuous slider control and optional break lengths',
        'Built-in ambient soundscape selector: Silence, Rain Mist, Warm Tide, and Deep presets',
        'Quiet Recent Sessions area designed to reflect completed focus blocks without noisy charts',
      ],
    },
  ],
  fa: [
    {
      id: 'today-dashboard',
      src: FLOW_MEDIA_ASSETS.screens.dashboard.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.dashboard.webpSrc,
      device: 'mobile',
      screenName: 'داشبورد امروز (Today)',
      screenSubtitle: 'Day Pulse · همراه · Open Horizon',
      caption: 'نمای واقعی داشبورد Today در اپلیکیشن اندروید FLOW',
      alt: 'تصویر واقعی داشبورد امروز اپلیکیشن اندروید FLOW شامل کارت همراه Mochi، موج Day Pulse، بخش نیت روز Open Horizon و نوار پنج‌بخشی پایین',
      highlights: [
        'خوش‌آمدگویی آرام متناسب با زمان روز همراه با دکمه دسترسی سریع به Space',
        'کارت همراه Mochi با وضعیت «Calm & Ready» و دکمه‌های Open Companion و Wave',
        'نمودار موج Day Pulse برای نمایش میزان تمرکز امروز، عادت‌ها و ریتم زمانی',
        'بخش Open Horizon (+ Intend) در کنار میانبرهای سریع Enter Focus و Avatar Studio',
      ],
    },
    {
      id: 'living-space-studio',
      src: FLOW_MEDIA_ASSETS.screens.themes.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.themes.webpSrc,
      device: 'mobile',
      screenName: 'استودیوی فضای زنده (Living Space Studio)',
      screenSubtitle: 'ظاهر · پالت‌ها · کیفیت حرکت',
      caption: 'نمای واقعی استودیوی تم و فضا در اپلیکیشن اندروید FLOW',
      alt: 'تصویر واقعی صفحه Living Space Studio در اندروید شامل انتخاب بین Atmosphere و Abstract Avatar، حالت‌های Obsidian و Daylight و پالت‌های رنگی',
      highlights: [
        'سوییچر دوحالته میان تنظیمات اتمسفر فضا (Atmosphere) و آواتار انتزاعی (Abstract Avatar)',
        'سه حالت نمایش پایه: Obsidian، Daylight و هماهنگ با سیستم (System)',
        'پالت‌های طراحی‌شده (Obsidian Mist و Aurora Dusk) همراه با انتخاب نور تاکیدی',
        'تنظیم پس‌زمینه زنده (Liquid Drift و Aurora Wave)، سبک نوار پایین و سطح نرمی حرکت',
      ],
    },
    {
      id: 'companion-sanctuary',
      src: FLOW_MEDIA_ASSETS.screens.companion.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.companion.webpSrc,
      device: 'mobile',
      screenName: 'پناهگاه همراه (Companion Sanctuary)',
      screenSubtitle: 'مجموعه (۱۶) · پیش‌نمایش دو‌بعدی و سه‌بعدی',
      caption: 'نمای واقعی بخش Companion Sanctuary در اپلیکیشن اندروید FLOW',
      alt: 'تصویر واقعی بخش Companion Sanctuary اپلیکیشن FLOW شامل همراه Mochi در حالت 2D Preview با دکمه‌های تعاملی Pet و Head Tilt و لیست مجموعه ۱۶تایی',
      highlights: [
        'تعامل‌های زنده با همراه مثل Pet، چرخش سر (Head Tilt) و تکان دادن دم (Tail Wag)',
        'توضیح شفاف درون برنامه درباره وضعیت فعلی: تصویرسازی دوبعدی و مدل سه‌بعدی در راه است',
        'مجموعه ۱۶ همراه با فیلترهای دسته‌بندی All، Dogs (6) و Cats (4)',
        'ترکیبی از مدل‌های آماده سه‌بعدی (مانند Shiba Inu) و پیش‌نمایش‌های تعاملی دوبعدی',
      ],
    },
    {
      id: 'focus-nebula',
      src: FLOW_MEDIA_ASSETS.screens.focus.src,
      webpSrc: FLOW_MEDIA_ASSETS.screens.focus.webpSrc,
      device: 'mobile',
      screenName: 'نبولای تمرکز (Focus Nebula)',
      screenSubtitle: 'تایمر جریان عمیق · صداهای محیطی',
      caption: 'نمای واقعی تایمر تمرکز Focus Nebula در اپلیکیشن اندروید FLOW',
      alt: 'تصویر واقعی صفحه Focus Nebula در اپلیکیشن اندروید FLOW شامل نیت تمرکز Deep Flow، انتخابگرهای زمان ۱۵ تا ۶۰ دقیقه، زمان استراحت و صداهای محیطی',
      highlights: [
        'ثبت نیت تمرکز (مانند Deep Flow) پیش از شروع یک جلسه بدون مزاحمت',
        'بازه زمان‌های پیش‌فرض ۱۵، ۲۵، ۴۵ و ۶۰ دقیقه همراه با اسلایدر دقیق و تنظیم استراحت بعدی',
        'انتخابگر صدای محیطی آرام شامل Silence، Rain Mist، Warm Tide و Deep',
        'بخش آرام Recent Sessions برای نمایش بی‌هیاهوی جلسات تکمیل‌شده',
      ],
    },
  ],
};

export const FLOW_PRODUCT_CONTENT: Record<Locale, FlowProductLocaleContent> = {
  en: {
    storySection: {
      scrollHint: 'Scroll to pilot the 3D hardware narrative · 0% to 100%',
      jumpToChapterAria: 'Jump to 3D story milestone',
      inspect3DHint: 'Interactive 3D Studio · Move pointer or scroll',
      inspectCurrentScreenCta: 'Inspect Screen Fullscreen',
      releaseTransitionCta: 'Continue to Release Center',
      chapters: [
        {
          id: 'intro',
          progressPercent: 0,
          index: '00',
          title: 'Spatial Arrival',
          subtitle: 'Calm Android Workspace',
          description:
            'Built slowly alongside programming study by Ermia Yazdani—entering perspective as a quiet sanctuary rather than another loud productivity tracker.',
          screenId: 'today-dashboard',
          statusTag: 'Android · Active Build',
          accentLabel: 'Obsidian Horizon',
          floatingPanels: [
            {
              eyebrow: 'Build Focus',
              value: 'Android Native UI',
              meta: '4 captured screens',
            },
          ],
        },
        {
          id: 'dashboard',
          progressPercent: 15,
          index: '01',
          title: 'Today Dashboard',
          subtitle: 'Day Pulse · Companion · Horizon',
          description:
            'Opens with time-of-day phrasing ("Softening down, ermia"), Mochi\'s live card, and the Twilight Drift Day Pulse curve summarizing focus without urgent clutter.',
          screenId: 'today-dashboard',
          statusTag: 'Available in Build',
          accentLabel: 'Day Pulse',
          floatingPanels: [
            {
              eyebrow: 'DAY PULSE',
              value: 'Twilight Drift',
              meta: 'Focus & Habits curve',
            },
            {
              eyebrow: 'OPEN HORIZON',
              value: '+ Intend',
              meta: 'Zero overdue noise',
            },
          ],
        },
        {
          id: 'avatar-studio',
          progressPercent: 30,
          index: '02',
          title: 'Avatar Studio & Companion',
          subtitle: 'Companion Sanctuary (16)',
          description:
            'Interactive gestures like Pet, Head Tilt, and Tail Wag sit alongside stylized 2D companions today while 3D models like Shiba Inu expand cleanly.',
          screenId: 'companion-sanctuary',
          statusTag: 'In Development · Hybrid 2D/3D',
          accentLabel: 'Sanctuary',
          floatingPanels: [
            {
              eyebrow: 'MOCHI · ACTIVE',
              value: 'Calm & Ready',
              meta: 'Pet · Head Tilt · Wag',
            },
            {
              eyebrow: 'COLLECTION (16)',
              value: 'Shiba Inu 3D',
              meta: 'Dogs (6) · Cats (4)',
            },
          ],
        },
        {
          id: 'widgets-routines',
          progressPercent: 45,
          index: '03',
          title: 'Widgets & Routines',
          subtitle: 'Focus Nebula · Planned Launchers',
          description:
            'Focus Nebula pairs 15m–60m uninterrupted blocks and Rain Mist soundscapes with planned 2×2 Day Pulse and 4×1 Open Horizon launcher widgets.',
          screenId: 'focus-nebula',
          statusTag: 'Routines Live · Widgets Planned',
          accentLabel: 'Deep Flow',
          floatingPanels: [
            {
              eyebrow: 'FOCUS NEBULA',
              value: '15m · 25m · 45m · 60m',
              meta: 'Silence · Rain Mist · Tide',
            },
            {
              eyebrow: 'LAUNCHER WIDGETS',
              value: '2×2 & 4×1 Glass',
              meta: 'Planned roadmap item',
            },
          ],
        },
        {
          id: 'themes-hardware',
          progressPercent: 60,
          index: '04',
          title: 'Themes & Space Studio',
          subtitle: 'Obsidian Mist · Aurora Dusk',
          description:
            'Rotate past brushed titanium rails into Living Space Studio: switch Obsidian, Daylight, Accent Light hues, Liquid Drift backdrops, and motion smoothness.',
          screenId: 'living-space-studio',
          statusTag: 'Available in Build',
          accentLabel: 'Living Space',
          floatingPanels: [
            {
              eyebrow: 'THEME PALETTE',
              value: 'Obsidian Mist / Aurora Dusk',
              meta: 'Mist Cyan · Aurora Violet',
            },
            {
              eyebrow: 'DOCK & MOTION',
              value: 'Floating Glass / Minimal Pill',
              meta: 'Smooth · Balanced · Rich',
            },
          ],
        },
        {
          id: 'memories-progression',
          progressPercent: 75,
          index: '05',
          title: 'Memories & Growth',
          subtitle: 'Recent Sessions · Gentle Progression',
          description:
            'Guided by the philosophy "Let the day settle and keep what felt good"—connecting Recent Sessions inside Focus Nebula to the Growth destination in the five-tab dock.',
          screenId: 'focus-nebula',
          statusTag: 'In Development',
          accentLabel: 'Quiet Growth',
          floatingPanels: [
            {
              eyebrow: 'RECENT SESSIONS',
              value: 'Session Keepsakes',
              meta: 'Archive in progress',
            },
            {
              eyebrow: '5-TAB DOCK',
              value: 'Today · Rituals · Growth',
              meta: 'No harsh streak loss',
            },
          ],
        },
        {
          id: 'center-hero',
          progressPercent: 90,
          index: '06',
          title: 'Cohesive Experience',
          subtitle: 'Centered Flagship Composition',
          description:
            'Every screen captured directly from the live Android application—preserving exact glass elevation, spacing discipline, and honest release status.',
          screenId: 'today-dashboard',
          statusTag: 'Verified Real Captures',
          accentLabel: 'Precision Finish',
          floatingPanels: [
            {
              eyebrow: 'VISUAL LANGUAGE',
              value: 'Liquid Glass Layers',
              meta: '1080×2460 captures',
            },
          ],
        },
        {
          id: 'release-ready',
          progressPercent: 100,
          index: '07',
          title: 'Release & Distribution',
          subtitle: 'Transparent Android Channel',
          description:
            'Continue directly below into the centralized Release Status control panel, honest version journal, interactive web sandbox, and full-screen gallery.',
          screenId: 'today-dashboard',
          statusTag: 'Pre-Release Transparent Log',
          accentLabel: 'Release Center',
          floatingPanels: [],
        },
      ],
    },
    hero: {
      platformTag: 'Android Application · Active Build',
      appName: 'FLOW',
      headline: 'Your day. Your space.',
      subtitle: 'A calm Android space for daily focus, gentle rituals, and visual stillness.',
      description:
        'Built slowly alongside ongoing programming study by Ermia Yazdani—bringing together a quiet Today dashboard, Focus Nebula timer sessions, Living Space themes, and interactive companions without noisy clutter.',
      primaryShowcaseCta: 'Explore Actual Screens',
      secondaryDemoCta: 'Try Interactive Sandbox',
      inspectScreensLabel: 'Real Android Screenshots',
      screensCountLabel: '4 Captured App Screens · Real Build',
    },
    statusLabels: {
      available: 'Available',
      in_development: 'In Development',
      planned: 'Planned',
    },
    screensSection: {
      kicker: 'Interactive Screenshot Gallery',
      title: 'Inside the real Android application.',
      subtitle:
        'Unaltered screen captures directly from the current FLOW Android build—preserving authentic typography, translucent Liquid Glass surfaces, and colors.',
      previousLabel: 'Previous screen',
      nextLabel: 'Next screen',
      openFullscreenLabel: 'Inspect full screen',
      dragOrSwipeHint: 'Drag horizontally on desktop or swipe on mobile · click capture to zoom',
      detailsHeading: 'Captured UI Details',
    },
    modulesSection: {
      kicker: 'Explore FLOW · Core Spaces',
      title: 'Every core space, honestly statused.',
      subtitle:
        'Features visible in the current Android captures are clearly separated from components still in active development or planned for future milestones.',
      inspectScreenCta: 'View Screen in Gallery',
      scrollSyncHint: 'Scroll through modules on desktop or select any card to sync preview',
      noScreenshotNote: 'Planned module — not yet captured in current Android build screenshots',
    },
    modules: [
      {
        id: 'dashboard',
        index: '01',
        title: 'Dashboard',
        status: 'available',
        screenId: 'today-dashboard',
        summary:
          'The "Today" overview opens with a time-aware greeting, Mochi companion presence, Twilight Drift Day Pulse curve, and an uncluttered Open Horizon card.',
        details: [
          'Live Day Pulse wave visualizing focus minutes, active habits, and current rhythm',
          'Quick "+ Intend" horizon card and rapid shortcuts for Enter Focus & Avatar Studio',
          'Five-tab floating dock: Today, Rituals, Companion, Focus, and Growth',
        ],
      },
      {
        id: 'avatar-studio',
        index: '02',
        title: 'Avatar Studio',
        status: 'in_development',
        screenId: 'companion-sanctuary',
        summary:
          'Accessible via both the Living Space Studio ("Abstract Avatar") and Companion Sanctuary ("Customize Look"), pairing interactive 2D companions with expanding 3D models.',
        details: [
          'Interactive Mochi gestures already playable (Pet, Head Tilt, Tail Wag) in 2D Preview',
          'Shiba Inu displays as 3D Ready inside the 16-companion catalog',
          'Additional 3D companion models (including Golden Retriever) and deeper customization are actively in progress',
        ],
      },
      {
        id: 'widgets',
        index: '03',
        title: 'Widgets',
        status: 'planned',
        summary:
          'Glanceable Android home-screen widgets for Day Pulse, active intentions, and one-tap Focus Nebula launch are planned on the roadmap.',
        details: [
          'Not included in the current captured Android screens yet',
          'Designed to mirror Obsidian Mist & Daylight palettes cleanly on Android launchers',
          'Zero noisy badges or stressful overdue counters',
        ],
      },
      {
        id: 'routines',
        index: '04',
        title: 'Routines',
        status: 'available',
        screenId: 'focus-nebula',
        summary:
          'Daily consistency pairs "Today\'s Rituals" quick actions with the Focus Nebula sanctuary—complete with preset durations, breaks, and calm ambient soundscapes.',
        details: [
          'Dedicated Rituals tab plus bottom-dock quick access to Today\'s Rituals',
          'Focus Nebula supports 15m, 25m, 45m, 60m sessions, slider fine-tuning, and break intervals',
          'Ambient audio options: Silence, Rain Mist, Warm Tide, and Deep soundscapes',
        ],
      },
      {
        id: 'memories',
        index: '05',
        title: 'Memories',
        status: 'in_development',
        screenId: 'focus-nebula',
        summary:
          'Designed around quiet reflection—"Let the day settle and keep what felt good"—connecting completed Focus Nebula logs in Recent Sessions to daily keepsakes.',
        details: [
          'Recent Sessions container is in place inside Focus Nebula for completed sessions',
          'Morning/evening reflection copy is woven into the Today dashboard rhythm',
          'Dedicated searchable memory archive and session history views are still in progress',
        ],
      },
      {
        id: 'themes',
        index: '06',
        title: 'Themes',
        status: 'available',
        screenId: 'living-space-studio',
        summary:
          'Living Space Studio lets users personalize appearance, curated palettes, accent lights, animated backdrop layers, dock shape, and motion intensity.',
        details: [
          'Appearance: Obsidian, Daylight, and System adaptation',
          'Palettes & Accent Light: Obsidian Mist, Aurora Dusk, Mist Cyan, Aurora Violet, and amber swatches',
          'Background & Chrome: Liquid Drift / Aurora Wave, Floating Glass / Minimal Pill dock, and Smooth / Balanced / Rich motion tiers',
        ],
      },
      {
        id: 'levels',
        index: '07',
        title: 'Levels & Progression',
        status: 'in_development',
        screenId: 'today-dashboard',
        summary:
          'Represented by the "Growth" destination in the persistent five-tab dock—built to reflect gentle personal consistency rather than stressful streak pressure.',
        details: [
          'Primary Growth tab wired inside FLOW\'s persistent bottom navigation dock',
          'Connects Focus today minutes and Ritual completions into a calm personal rhythm',
          'Full progression milestones and Growth overview screens are actively being refined',
        ],
      },
    ],
    demo: {
      kicker: 'Interactive Web Sandbox',
      title: 'Experience the calm pacing firsthand.',
      subtitle:
        'A lightweight web sandbox modeling FLOW\'s visual themes, daily dashboard rhythm, companion reactions, and planned launcher widgets—uses sample data to preview the interface feel.',
      disclaimerBadge: 'Web Simulation Sandbox · Sample Data',
      tabs: {
        today: 'Today',
        themes: 'Themes',
        companion: 'Avatar Studio',
        widgets: 'Widgets (Planned)',
      },
      themeLabels: {
        heading: 'Sample Space Palette',
        obsidianMist: 'Obsidian Mist',
        auroraDusk: 'Aurora Dusk',
        daylightPaper: 'Daylight Paper',
        accentHeading: 'Accent Light',
        cyan: 'Mist Cyan',
        violet: 'Aurora Violet',
        amber: 'Warm Amber',
      },
      todayCopy: {
        greeting: 'Softening down',
        dayPulseLabel: 'DAY PULSE · TWILIGHT DRIFT',
        moods: ['Grounded', 'Focused', 'Unwinding'],
        intentionsLabel: 'Sample Intentions',
        defaultIntentions: [
          'Read 20 minutes without notifications',
          'Review evening notes calmly',
          'Sketch tomorrow\'s top priority',
        ],
        focusLabel: 'Focus today',
        addSessionBtn: '+15m Focus Sample',
      },
      companionCopy: {
        heading: 'Companion Sanctuary Sandbox',
        note: 'Simulated 2D response preview — see the real Android capture in Gallery.',
        presets: [
          {
            id: 'mochi',
            name: 'Mochi',
            breed: 'Golden Retriever',
            status: 'Calm & Ready · 2D Preview',
            badge: 'Warm Golden',
          },
          {
            id: 'sora',
            name: 'Sora',
            breed: 'Shiba Inu',
            status: 'Alert & Steady · 3D Ready',
            badge: 'Copper Cream',
          },
          {
            id: 'kumo',
            name: 'Kumo',
            breed: 'Scottish Fold',
            status: 'Quiet Rest · 2D Concept',
            badge: 'Silver Mist',
          },
        ],
        actions: {
          pet: 'Pet',
          tilt: 'Head Tilt',
          wag: 'Tail Wag',
        },
        reactionMessages: {
          pet: 'Gentle purr & soft settle animation triggered.',
          tilt: 'Curious head tilt reaction active.',
          wag: 'Warm tail wag rhythm responding to touch.',
        },
      },
      widgetsCopy: {
        heading: 'Planned Android Widget Previews',
        plannedNote: 'Planned roadmap concept adapting live to the active Space theme above.',
        cards: [
          {
            id: 'pulse-widget',
            title: 'Day Pulse · 2×2',
            subtitle: 'Twilight rhythm wave & active focus minutes',
            meta: 'Planned · Minimal Pill',
          },
          {
            id: 'intend-widget',
            title: 'Open Horizon · 4×1',
            subtitle: 'Single gentle intention + 1-tap Enter Focus',
            meta: 'Planned · Floating Glass',
          },
        ],
      },
    },
    downloadSection: {
      kicker: 'Distribution & Release Info',
      title: 'Release Status & Verified Distribution',
      subtitle:
        'Centralized release control for FLOW on Android. Packages and store listings link externally only when verified public builds exist.',
      statusTitles: {
        coming_soon: 'Pre-Release — Active Development',
        private_beta: 'Private Beta Testing',
        public_apk: 'Public Android APK Release',
        google_play: 'Available on Google Play',
      },
      statusDescriptions: {
        coming_soon:
          'FLOW is currently in active Android development. No public APK or store listing is live yet—every screen shown above comes directly from the current internal build.',
        private_beta:
          'Selected testers can join the active FLOW Android beta through the verified external invitation link below.',
        public_apk:
          'A signed FLOW Android installation package is hosted externally at its verified release repository.',
        google_play:
          'FLOW is published for Android through its verified Google Play listing.',
      },
      ctaLabels: {
        coming_soon: 'Coming Soon — In Active Development',
        private_beta: 'Join the Beta',
        public_apk: 'Download APK',
        google_play: 'Get it on Google Play',
      },
      externalHostNotice:
        'Release files and store listings remain hosted independently from this portfolio.',
      specLabels: {
        platform: 'Platform',
        version: 'Current Version',
        releaseDate: 'Release Date',
        downloadSize: 'Package Size',
        compatibility: 'Compatibility',
        distributionStatus: 'Release Channel',
      },
      platformValue: 'Android',
      releaseInfoHeading: 'Release Notes & Transparency',
      journalKicker: 'Development Journal',
      journalHeading: 'FLOW Development Journal & Build History',
      journalLabels: {
        version: 'Version / Stage',
        releaseDate: 'Date',
        status: 'Status',
        newFeatures: 'New Features',
        improvements: 'Improvements',
        bugFixes: 'Bug Fixes',
      },
      whatsNewHeading: 'What Is Visible in Current Build Captures',
      releaseNotesLinkLabel: 'Open External Release Notes',
      privacyLinkLabel: 'Privacy Disclosure',
      privacyTitle: 'FLOW Privacy Approach',
      privacyBody:
        'FLOW is conceived as a quiet personal daily space without noisy third-party ad trackers. Final privacy documentation will publish alongside any external public APK or Google Play release.',
      supportLinkLabel: 'Contact & Feedback',
      whatsNewItems: [
        'Today dashboard with Day Pulse rhythm wave slider and Mochi companion card',
        'Living Space Studio supporting Obsidian/Daylight modes, palettes, accent lights, and Liquid Drift/Aurora Wave backdrops',
        'Companion Sanctuary with 16-entry catalog, interactive 2D gestures, and 3D-ready Shiba Inu model',
        'Focus Nebula sanctuary with configurable 15m–60m timer, break intervals, and ambient soundscapes',
      ],
      versionHistory: [
        {
          version: 'Pre-Release · Internal Android Build',
          releaseDate: 'Captured November 2026',
          developmentStatus: 'In Active Development',
          newFeatures: [
            'Built Today Dashboard with live Day Pulse wave, Open Horizon intention prompt, and five-tab dock',
            'Added Living Space Studio with Obsidian/Daylight modes, palettes, accent lights, and motion tiers',
            'Added Companion Sanctuary catalog (16 companions) featuring interactive Mochi 2D preview and 3D-ready Shiba Inu',
            'Implemented Focus Nebula deep flow timer (15m–60m) with break options and ambient soundscapes',
          ],
          improvements: [
            'Refined translucent glass surface readability against midnight gradients and daylight paper surfaces',
            'Unified quick actions between Today cards and bottom dock navigation',
          ],
          bugFixes: [
            'No public release bugfix changelog yet — ongoing internal layout polish ahead of beta packaging',
          ],
        },
        {
          version: 'Milestone 01 · Architecture & Calm UI Concept',
          releaseDate: 'Initial Exploration Phase',
          developmentStatus: 'Completed Baseline',
          newFeatures: [
            'Defined clutter-free three-layer daily hierarchy separating Today overview, Focus Nebula, and Companion Sanctuary',
          ],
          improvements: [
            'Simplified visual density so rituals feel welcoming instead of obligation-driven',
          ],
          bugFixes: [
            'Baseline conceptual stage prior to public Android binary releases',
          ],
        },
      ],
    },
  },
  fa: {
    storySection: {
      scrollHint: 'برای هدایت داستان سه‌بعدی سخت‌افزار اسکرول کنید · ۰٪ تا ۱۰۰٪',
      jumpToChapterAria: 'پرش به مرحله داستان سه‌بعدی',
      inspect3DHint: 'استودیوی سه‌بعدی تعاملی · حرکت ماوس یا اسکرول',
      inspectCurrentScreenCta: 'بزرگ‌نمایی این صفحه',
      releaseTransitionCta: 'ورود به مرکز انتشار',
      chapters: [
        {
          id: 'intro',
          progressPercent: 0,
          index: '۰۰',
          title: 'ورود فضایی (Spatial Arrival)',
          subtitle: 'فضای آرام اندرویدی',
          description:
            'ساخته‌شده گام‌به‌گام کنار مسیر یادگیری برنامه‌نویسی توسط ارمیا یزدانی؛ ورود به پرسپکتیو به‌عنوان یک پناهگاه روزانه به‌جای ابزارهای شلوغ و پرهیاهو.',
          screenId: 'today-dashboard',
          statusTag: 'اندروید · بیلد فعال',
          accentLabel: 'افق ابسیدین',
          floatingPanels: [
            {
              eyebrow: 'تمرکز ساخت',
              value: 'رابط بومی اندروید',
              meta: '۴ تصویر واقعی ثبت‌شده',
            },
          ],
        },
        {
          id: 'dashboard',
          progressPercent: 15,
          index: '۰۱',
          title: 'داشبورد امروز (Today)',
          subtitle: 'Day Pulse · همراه · افق باز',
          description:
            'با سلام متناسب با زمان روز، کارت زنده همراه Mochi و موج Day Pulse آغاز می‌شود تا تمرکز و عادت‌ها بدون استرس دیده شوند.',
          screenId: 'today-dashboard',
          statusTag: 'موجود در بیلد فعلی',
          accentLabel: 'Day Pulse',
          floatingPanels: [
            {
              eyebrow: 'DAY PULSE',
              value: 'Twilight Drift',
              meta: 'موج تمرکز و عادت‌ها',
            },
            {
              eyebrow: 'OPEN HORIZON',
              value: '+ Intend',
              meta: 'بدون اعلان‌های معوق',
            },
          ],
        },
        {
          id: 'avatar-studio',
          progressPercent: 30,
          index: '۰۲',
          title: 'استودیوی آواتار و همراه',
          subtitle: 'Companion Sanctuary (۱۶)',
          description:
            'تعامل‌های زنده مثل نوازش، چرخش سر و تکان دم با تصویرسازی دوبعدی در دسترس‌اند و هم‌زمان مدل‌های سه‌بعدی مانند Shiba Inu در حال گسترش هستند.',
          screenId: 'companion-sanctuary',
          statusTag: 'در حال توسعه · ۲بعدی و ۳بعدی',
          accentLabel: 'پناهگاه همراه',
          floatingPanels: [
            {
              eyebrow: 'MOCHI · فعال',
              value: 'Calm & Ready',
              meta: 'Pet · Head Tilt · Wag',
            },
            {
              eyebrow: 'مجموعه ۱۶تایی',
              value: 'Shiba Inu 3D',
              meta: 'Dogs (6) · Cats (4)',
            },
          ],
        },
        {
          id: 'widgets-routines',
          progressPercent: 45,
          index: '۰۳',
          title: 'ویجت‌ها و روتین‌ها',
          subtitle: 'Focus Nebula · ویجت‌های لانچر',
          description:
            'تایمر Focus Nebula با بازه‌های ۱۵ تا ۶۰ دقیقه و صداهای Rain Mist در کنار ویجت‌های شیشه‌ای ۲×۲ و ۴×۱ برنامه‌ریزی‌شده برای صفحه اصلی.',
          screenId: 'focus-nebula',
          statusTag: 'روتین فعال · ویجت برنامه‌ریزی‌شده',
          accentLabel: 'جریان عمیق',
          floatingPanels: [
            {
              eyebrow: 'FOCUS NEBULA',
              value: '۱۵ · ۲۵ · ۴۵ · ۶۰ دقیقه',
              meta: 'Silence · Rain Mist · Tide',
            },
            {
              eyebrow: 'ویجت‌های لانچر',
              value: 'کارت شیشه‌ای ۲×۲ و ۴×۱',
              meta: 'در نقشه راه آینده',
            },
          ],
        },
        {
          id: 'themes-hardware',
          progressPercent: 60,
          index: '۰۴',
          title: 'تم‌ها و استودیوی فضا',
          subtitle: 'Obsidian Mist · Aurora Dusk',
          description:
            'چرخش سه‌بعدی فریم تیتانیومی برای نمایش Living Space Studio: تغییر حالت Obsidian و Daylight، نور تاکیدی، پس‌زمینه Liquid Drift و نرمی حرکت.',
          screenId: 'living-space-studio',
          statusTag: 'موجود در بیلد فعلی',
          accentLabel: 'استودیوی فضا',
          floatingPanels: [
            {
              eyebrow: 'پالت رنگ',
              value: 'Obsidian Mist / Aurora Dusk',
              meta: 'Mist Cyan · Aurora Violet',
            },
            {
              eyebrow: 'داک و حرکت',
              value: 'Floating Glass / Minimal Pill',
              meta: 'Smooth · Balanced · Rich',
            },
          ],
        },
        {
          id: 'memories-progression',
          progressPercent: 75,
          index: '۰۵',
          title: 'خاطره‌ها و رشد تدریجی',
          subtitle: 'Recent Sessions · مسیر Growth',
          description:
            'با فلسفه «بگذار روز آرام بگیرد و آنچه حس خوبی داشت را نگه دار»؛ پیوند بخش Recent Sessions با تب اختصاصی Growth در نوار پایین.',
          screenId: 'focus-nebula',
          statusTag: 'در حال توسعه',
          accentLabel: 'رشد آرام',
          floatingPanels: [
            {
              eyebrow: 'RECENT SESSIONS',
              value: 'ثبت جلسات آرام',
              meta: 'آرشیو در حال تکمیل',
            },
            {
              eyebrow: 'نوار پنج‌بخشی',
              value: 'Today · Rituals · Growth',
              meta: 'بدون فشار رکوردشکنی',
            },
          ],
        },
        {
          id: 'center-hero',
          progressPercent: 90,
          index: '۰۶',
          title: 'تجربه یکپارچه',
          subtitle: 'نمای مرکزی دقیق محصول',
          description:
            'تمام نماهای نمایش‌داده‌شده مستقیم از اپلیکیشن واقعی اندروید ثبت شده‌اند؛ با حفظ شفافیت کامل درباره امکانات فعلی و بخش‌های آینده.',
          screenId: 'today-dashboard',
          statusTag: 'اسکرین‌شات واقعی اپ',
          accentLabel: 'دقت ساخت',
          floatingPanels: [
            {
              eyebrow: 'زبان بصری',
              value: 'لایه‌های Liquid Glass',
              meta: 'تصاویر ۱۰۸۰×۲۴۶۰',
            },
          ],
        },
        {
          id: 'release-ready',
          progressPercent: 100,
          index: '۰۷',
          title: 'انتشار و دریافت نسخه',
          subtitle: 'وضعیت شفاف کانال اندروید',
          description:
            'بلافاصله در ادامه به پنل متمرکز وضعیت انتشار، تاریخچه نسخه‌ها، سندباکس تعاملی وب و گالری تمام‌صفحه دسترسی دارید.',
          screenId: 'today-dashboard',
          statusTag: 'گزارش شفاف پیش‌انتشار',
          accentLabel: 'مرکز انتشار',
          floatingPanels: [],
        },
      ],
    },
    hero: {
      platformTag: 'اپلیکیشن اندروید · بیلد فعال',
      appName: 'FLOW',
      headline: 'Your day. Your space.',
      subtitle: 'روز تو. فضای تو. — یک فضای آرام اندرویدی برای تمرکز روزانه، عادت‌های ملایم و سکون بصری.',
      description:
        'طراحی و توسعه‌یافته به‌صورت گام‌به‌گام توسط ارمیا یزدانی؛ ترکیبی از داشبورد خلوت Today، تایمر تمرکز Focus Nebula، استودیوی تم Living Space و همراه تعاملی بدون شلوغی.',
      primaryShowcaseCta: 'مشاهده اسکرین‌شات‌های واقعی',
      secondaryDemoCta: 'تجربه پیش‌نمایش تعاملی',
      inspectScreensLabel: 'تصاویر واقعی اپلیکیشن اندروید',
      screensCountLabel: '۴ صفحه واقعی ثبت‌شده از نسخه فعلی',
    },
    statusLabels: {
      available: 'موجود (Available)',
      in_development: 'در حال توسعه (In Development)',
      planned: 'برنامه‌ریزی‌شده (Planned)',
    },
    screensSection: {
      kicker: 'گالری تعاملی اسکرین‌شات‌ها',
      title: 'نگاهی نزدیک به درون اپلیکیشن واقعی اندروید.',
      subtitle:
        'تصاویر واقعی بدون تغییر از نسخه فعلی اندروید FLOW؛ با حفظ دقیق رنگ‌ها، تایپوگرافی و سطوح شیشه‌ای واقعی برنامه.',
      previousLabel: 'صفحه قبلی',
      nextLabel: 'صفحه بعدی',
      openFullscreenLabel: 'مشاهده تمام‌صفحه',
      dragOrSwipeHint: 'در دسکتاپ بکشید یا در موبایل سوایپ کنید · برای بزرگ‌نمایی کلیک کنید',
      detailsHeading: 'جزئیات ثبت‌شده در رابط کاربری',
    },
    modulesSection: {
      kicker: 'کاوش در FLOW · بخش‌های اصلی',
      title: 'وضعیت واقعی هر بخش، با شفافیت کامل.',
      subtitle:
        'بخش‌هایی که هم‌اکنون در تصاویر نسخه اندروید دیده می‌شوند به‌روشنی از بخش‌های در حال توسعه یا برنامه‌ریزی‌شده تفکیک شده‌اند.',
      inspectScreenCta: 'نمایش در گالری تصاویر',
      scrollSyncHint: 'در دسکتاپ با اسکرول روی کارت‌ها پیش‌نمایش گوشی همگام می‌شود یا مستقیماً کلیک کنید',
      noScreenshotNote: 'بخش برنامه‌ریزی‌شده — هنوز در تصاویر نسخه فعلی اندروید ثبت نشده است',
    },
    modules: [
      {
        id: 'dashboard',
        index: '۰۱',
        title: 'داشبورد (Dashboard)',
        status: 'available',
        screenId: 'today-dashboard',
        summary:
          'صفحه Today با پیام متناسب با زمان روز، کارت همراه Mochi، نمودار موجی Day Pulse و بخش آرام Open Horizon آغاز می‌شود.',
        details: [
          'موج زنده Day Pulse برای نمایش دقایق تمرکز امروز، عادت‌ها و ریتم زمانی',
          'بخش نیت روز (+ Intend) همراه با میانبرهای سریع Enter Focus و Avatar Studio',
          'نوار پایین پنج‌بخشی شامل Today، Rituals، Companion، Focus و Growth',
        ],
      },
      {
        id: 'avatar-studio',
        index: '۰۲',
        title: 'استودیوی آواتار و همراه (Avatar Studio)',
        status: 'in_development',
        screenId: 'companion-sanctuary',
        summary:
          'از طریق بخش Abstract Avatar در Living Space Studio و گزینه Customize Look در Companion Sanctuary با همراهان دوبعدی تعاملی و مدل‌های سه‌بعدی در حال گسترش.',
        details: [
          'تعامل‌های زنده Mochi (Pet، Head Tilt، Tail Wag) در پیش‌نمایش دوبعدی فعال است',
          'مدل Shiba Inu با برچسب 3D Ready در مجموعه ۱۶تایی دیده می‌شود',
          'مدل سه‌بعدی Golden Retriever و شخصی‌سازی کامل‌تر در حال توسعه است',
        ],
      },
      {
        id: 'widgets',
        index: '۰۳',
        title: 'ویجت‌های صفحه اصلی (Widgets)',
        status: 'planned',
        summary:
          'ویجت‌های سبک صفحه اصلی اندروید برای نمایش سریع Day Pulse، عادت بعدی و ورود فوری به تایمر تمرکز در نقشه راه برنامه‌ریزی شده‌اند.',
        details: [
          'در تصاویر فعلی نسخه اندروید هنوز پیاده‌سازی نشده است',
          'طراحی هماهنگ با پالت‌های Obsidian Mist و Daylight روی لانچر اندروید',
          'بدون شمارنده‌های استرس‌زا یا نشانگرهای شلوغ',
        ],
      },
      {
        id: 'routines',
        index: '۰۴',
        title: 'روتین‌ها و تمرکز (Routines)',
        status: 'available',
        screenId: 'focus-nebula',
        summary:
          'ترکیب بخش Today\'s Rituals با محیط آرام Focus Nebula؛ شامل تایمرهای قابل تنظیم، زمان استراحت و صداهای محیطی.',
        details: [
          'بخش اختصاصی Rituals در نوار پایین به همراه لیست کارهای روزانه',
          'تایمر Focus Nebula با زمان‌های ۱۵، ۲۵، ۴۵ و ۶۰ دقیقه و انتخاب استراحت بعدی',
          'صداهای محیطی آرام: Silence، Rain Mist، Warm Tide و Deep',
        ],
      },
      {
        id: 'memories',
        index: '۰۵',
        title: 'خاطره‌ها و ثبت جلسات (Memories)',
        status: 'in_development',
        screenId: 'focus-nebula',
        summary:
          'با الهام از جمله «بگذار روز آرام بگیرد و آنچه حس خوبی داشت را نگه دار»؛ پیوند بخش Recent Sessions با مرور آرام پایان روز.',
        details: [
          'کارت Recent Sessions برای نمایش جلسات تمرکز تکمیل‌شده در Focus Nebula قرار دارد',
          'لحن تأملی در پیام‌های صفحه Today پیاده‌سازی شده است',
          'آرشیو کامل خاطرات و تاریخچه دقیق روزهای گذشته همچنان در حال تکمیل است',
        ],
      },
      {
        id: 'themes',
        index: '۰۶',
        title: 'تم‌ها و استودیوی فضا (Themes)',
        status: 'available',
        screenId: 'living-space-studio',
        summary:
          'صفحه Living Space Studio امکان تنظیم ظاهر، پالت‌های رنگی، نور تاکیدی، پس‌زمینه زنده، سبک نوار پایین و سطح حرکت را می‌دهد.',
        details: [
          'حالت‌های ظاهر: Obsidian، Daylight و System',
          'پالت‌های Obsidian Mist و Aurora Dusk در کنار انتخابگر Accent Light',
          'پس‌زمینه زنده (Liquid Drift و Aurora Wave)، سبک نوار پایین و تنظیم کیفیت حرکت',
        ],
      },
      {
        id: 'levels',
        index: '۰۷',
        title: 'سطوح و رشد تدریجی (Levels & Progression)',
        status: 'in_development',
        screenId: 'today-dashboard',
        summary:
          'با تب اختصاصی Growth در نوار اصلی پنج‌بخشی؛ متمرکز بر پیگیری ملایم تداوم روزانه بدون فشار استرس‌زای رکوردشکنی.',
        details: [
          'مسیر Growth در نوار ناوبری اصلی اپلیکیشن جای‌گذاری شده است',
          'پیوند میان دقایق تمرکز روزانه و انجام روتین‌ها در قالب ریتم شخصی',
          'نمایشگرهای کامل سطوح و نمای پیشرفت در حال توسعه هستند',
        ],
      },
    ],
    demo: {
      kicker: 'پیش‌نمایش تعاملی وب',
      title: 'ریتم آرام FLOW را در عمل تجربه کنید.',
      subtitle:
        'یک سندباکس سبک وب با داده‌های نمونه برای لمس فضای بصری تم‌ها، داشبورد روزانه، واکنش‌های همراه و ویجت‌های برنامه‌ریزی‌شده — بدون ادعای شبیه‌سازی کامل باینری اندروید.',
      disclaimerBadge: 'محیط شبیه‌سازی وب · داده‌های نمونه',
      tabs: {
        today: 'امروز (Today)',
        themes: 'تم‌ها (Themes)',
        companion: 'استودیوی همراه',
        widgets: 'ویجت‌ها (برنامه‌ریزی)',
      },
      themeLabels: {
        heading: 'پالت نمونه فضا',
        obsidianMist: 'Obsidian Mist',
        auroraDusk: 'Aurora Dusk',
        daylightPaper: 'Daylight Paper',
        accentHeading: 'نور تاکیدی',
        cyan: 'Mist Cyan',
        violet: 'Aurora Violet',
        amber: 'Warm Amber',
      },
      todayCopy: {
        greeting: 'عصر بخیر، در حال آرام‌گرفتن',
        dayPulseLabel: 'DAY PULSE · ریتم غروب',
        moods: ['متعادل', 'متمرکز', 'رو به آرامش'],
        intentionsLabel: 'نیت‌های نمونه امروز',
        defaultIntentions: [
          '۲۰ دقیقه مطالعه بدون اعلان گوشی',
          'مرور یادداشت‌های روز با آرامش',
          'مشخص‌کردن اولویت فردا پیش از شب',
        ],
        focusLabel: 'تمرکز امروز (نمونه)',
        addSessionBtn: 'افزودن +۱۵ دقیقه نمونه',
      },
      companionCopy: {
        heading: 'پیش‌نمایش پناهگاه همراه',
        note: 'شبیه‌سازی سبک دوبعدی در وب — تصویر واقعی اپ در بخش گالری قرار دارد.',
        presets: [
          {
            id: 'mochi',
            name: 'Mochi',
            breed: 'گلدن رتریور',
            status: 'آرام و آماده · پیش‌نمایش دوبعدی',
            badge: 'طلایی گرم',
          },
          {
            id: 'sora',
            name: 'Sora',
            breed: 'شیبا اینو',
            status: 'هوشیار · مدل سه‌بعدی آماده',
            badge: 'مسی روشن',
          },
          {
            id: 'kumo',
            name: 'Kumo',
            breed: 'اسکاتیش فولد',
            status: 'استراحت آرام · کانسپت دوبعدی',
            badge: 'نقره‌ای مه',
          },
        ],
        actions: {
          pet: 'نوازش (Pet)',
          tilt: 'چرخش سر',
          wag: 'تکان دم',
        },
        reactionMessages: {
          pet: 'واکنش آرامش و لبخند همراه فعال شد.',
          tilt: 'واکنش کنجکاوانه چرخش سر نمایش داده شد.',
          wag: 'ریتم شاد تکان‌دادن دم فعال شد.',
        },
      },
      widgetsCopy: {
        heading: 'پیش‌نمایش ویجت‌های برنامه‌ریزی‌شده',
        plannedNote: 'کانسپت نقشه راه که به‌صورت زنده با تم انتخابی بالا هماهنگ می‌شود.',
        cards: [
          {
            id: 'pulse-widget',
            title: 'Day Pulse · ۲×۲',
            subtitle: 'موج ریتم روزانه و دقایق تمرکز ثبت‌شده',
            meta: 'برنامه‌ریزی‌شده · Minimal Pill',
          },
          {
            id: 'intend-widget',
            title: 'Open Horizon · ۴×۱',
            subtitle: 'یک نیت روزانه آرام + ورود فوری به تمرکز',
            meta: 'برنامه‌ریزی‌شده · Floating Glass',
          },
        ],
      },
    },
    downloadSection: {
      kicker: 'توزیع و اطلاعات انتشار',
      title: 'وضعیت انتشار و دریافت اپلیکیشن',
      subtitle:
        'تنظیمات متمرکز انتشار نسخه اندروید FLOW. لینک دانلود یا فروشگاه فقط زمانی فعال می‌شود که بسته واقعی و معتبر منتشر شده باشد.',
      statusTitles: {
        coming_soon: 'پیش‌انتشار — در حال توسعه فعال',
        private_beta: 'نسخه آزمایشی خصوصی (Private Beta)',
        public_apk: 'انتشار عمومی فایل APK اندروید',
        google_play: 'منتشرشده در گوگل‌پلی',
      },
      statusDescriptions: {
        coming_soon:
          'اپلیکیشن FLOW هم‌اکنون در حال توسعه فعال برای اندروید است. هنوز فایل APK عمومی یا صفحه فروشگاه منتشر نشده و تصاویر بالا مربوط به بیلد داخلی فعلی است.',
        private_beta:
          'آزمایش‌کنندگان دعوت‌شده می‌توانند از طریق لینک معتبر زیر به نسخه بتای خصوصی اندروید بپیوندند.',
        public_apk:
          'فایل نصبی معتبر APK در مخزن رسمی انتشار به‌صورت مستقل میزبانی می‌شود.',
        google_play:
          'اپلیکیشن FLOW از طریق صفحه رسمی در فروشگاه Google Play در دسترس است.',
      },
      ctaLabels: {
        coming_soon: 'به‌زودی — در حال توسعه',
        private_beta: 'عضویت در بتا (Join the Beta)',
        public_apk: 'دانلود فایل APK',
        google_play: 'دریافت از گوگل‌پلی',
      },
      externalHostNotice:
        'فایل‌های نصبی و صفحات انتشار به‌صورت جداگانه در مخزن رسمی میزبانی می‌شوند و داخل این پورتفولیو ذخیره نمی‌شوند.',
      specLabels: {
        platform: 'پلتفرم',
        version: 'نسخه فعلی',
        releaseDate: 'تاریخ انتشار',
        downloadSize: 'حجم فایل',
        compatibility: 'سازگاری',
        distributionStatus: 'کانال انتشار',
      },
      platformValue: 'اندروید (Android)',
      releaseInfoHeading: 'جزئیات نسخه و شفافیت',
      journalKicker: 'گزارش توسعه',
      journalHeading: 'دفترچه توسعه و تاریخچه ساخت FLOW',
      journalLabels: {
        version: 'نسخه / مرحله',
        releaseDate: 'تاریخ',
        status: 'وضعیت',
        newFeatures: 'ویژگی‌های جدید',
        improvements: 'بهبودها',
        bugFixes: 'رفع اشکالات',
      },
      whatsNewHeading: 'امکانات قابل مشاهده در بیلد فعلی',
      releaseNotesLinkLabel: 'مشاهده یادداشت انتشار خارجی',
      privacyLinkLabel: 'حریم خصوصی',
      privacyTitle: 'رویکرد حریم خصوصی FLOW',
      privacyBody:
        'FLOW به‌عنوان یک فضای آرام شخصی و بدون ردیاب‌های تبلیغاتی طراحی می‌شود. سند نهایی حریم خصوصی هم‌زمان با هر انتشار عمومی APK یا Google Play منتشر خواهد شد.',
      supportLinkLabel: 'پشتیبانی و تماس',
      whatsNewItems: [
        'داشبورد Today همراه با نمودار موجی Day Pulse و کارت همراه Mochi',
        'بخش Living Space Studio با پشتیبانی از حالت‌های Obsidian/Daylight، پالت‌ها و پس‌زمینه زنده',
        'پناهگاه همراه (Companion Sanctuary) با کاتالوگ ۱۶تایی، ژست‌های دوبعدی و مدل آماده سه‌بعدی Shiba Inu',
        'بخش Focus Nebula با تایمر ۱۵ تا ۶۰ دقیقه، زمان استراحت و صداهای آرامش‌بخش محیطی',
      ],
      versionHistory: [
        {
          version: 'پیش‌انتشار · بیلد داخلی اندروید',
          releaseDate: 'ثبت‌شده در آبان ۱۴۰۵ / نوامبر ۲۰۲۶',
          developmentStatus: 'در حال توسعه فعال',
          newFeatures: [
            'پیاده‌سازی داشبورد Today با نمودار موجی Day Pulse و کارت Open Horizon',
            'ساخت Living Space Studio با حالت‌های Obsidian/Daylight، پالت‌ها و تنظیم حرکت',
            'ایجاد بخش Companion Sanctuary با کاتالوگ ۱۶تایی و تعامل دوبعدی Mochi در کنار Shiba Inu آماده سه‌بعدی',
            'توسعه تایمر تمرکز Focus Nebula (۱۵ تا ۶۰ دقیقه) با زمان استراحت و صداهای محیطی',
          ],
          improvements: [
            'بهینه‌سازی کنتراست سطوح شیشه‌ای روی پس‌زمینه‌های تیره و روشن',
            'یکپارچه‌سازی دسترسی سریع میان کارت‌های Today و نوار ناوبری پایین',
          ],
          bugFixes: [
            'هنوز گزارش باگ عمومی منتشر نشده است — اصلاحات چیدمان پیش از بسته‌بندی بتا در جریان است',
          ],
        },
        {
          version: 'نقطه عطف ۰۱ · معماری پایه و هویت بصری آرام',
          releaseDate: 'فاز اولیه طراحی و پژوهش',
          developmentStatus: 'مبنای تکمیل‌شده',
          newFeatures: [
            'تعریف ساختار سه‌لایه بدون شلوغی برای جداسازی Today، Focus Nebula و همراه',
          ],
          improvements: [
            'ساده‌سازی تراکم اطلاعات برای ایجاد حس دعوت‌کننده به‌جای فشار کارهای معوق',
          ],
          bugFixes: [
            'مرحله طراحی مفهومی پیش از تولید نسخه عمومی اندروید',
          ],
        },
      ],
    },
  },
};
