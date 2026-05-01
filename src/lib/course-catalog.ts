/**
 * Native course detail catalog for courses that exist on the legacy WordPress
 * site as Thrive Apprentice CPT entries (`/course/<slug>/`) but are NOT
 * exposed via the WP REST API. Without this catalog, every "View course" link
 * on /free-online-mindfulness-courses for non-video courses 404s in the app
 * because WPResolver finds nothing for the nested URL.
 *
 * Source of lesson titles + ordering: scraped directly from each course page
 * on https://mindfulnessexercises.com on 2026-05-01. Lesson links keep the
 * `/course/<slug>/` shape so we can resolve them to the live WP URL until
 * the underlying lesson content gets migrated separately.
 */

export type Difficulty = "Easy" | "Intermediate" | "Advanced";

export interface CourseLesson {
  /** Slug only — caller composes the URL (currently external WP). */
  slug: string;
  title: string;
  /** Optional — appears as a section divider before this lesson. */
  groupHeading?: string;
}

export interface CourseDetail {
  /** WP slug — also the route path under /free-online-mindfulness-courses/. */
  slug: string;
  title: string;
  /** Hero / SEO description — 1-2 sentences. */
  description: string;
  /** Longer body copy that sits above the lesson list (1-3 short paragraphs). */
  intro: string;
  difficulty: Difficulty;
  audience: string;
  lessons: readonly CourseLesson[];
  /** Optional related video collection slug (links into /videos/<slug>). */
  relatedVideoSlug?: string;
  relatedVideoLabel?: string;
}

export const COURSE_DETAILS: Record<string, CourseDetail> = {
  "the4-foundations-of-mindfulness": {
    slug: "the4-foundations-of-mindfulness",
    title: "The 4 Foundations of Mindfulness",
    description:
      "A 7-lesson contemplative deep-dive into body, feeling tone, mind, and dhammas — the heart of the Satipaṭṭhāna teachings.",
    intro:
      "Drawn from the Satipaṭṭhāna Sutta, this course walks through the four classical fields of mindful awareness — body, feeling tones, mind, and dhammas — as a complete map of practice. Each lesson pairs a written teaching with a guided sit, building from anatomical body awareness through to the factors of awakening.",
    difficulty: "Advanced",
    audience: "Advanced practitioners",
    lessons: [
      { slug: "1-anatomy", title: "Anatomy", groupHeading: "1st Foundation: The Body" },
      { slug: "2-elements", title: "Elements" },
      { slug: "3-death", title: "Death" },
      { slug: "4-feeling", title: "Feeling", groupHeading: "2nd Foundation: Feeling Tones" },
      { slug: "5-mind", title: "Mind", groupHeading: "3rd Foundation: Mental Volition" },
      { slug: "6-hindrances", title: "Hindrances", groupHeading: "4th Foundation: Dhammas" },
      { slug: "7-awakening", title: "Awakening" },
    ],
  },

  "10-day-vipassana-course": {
    slug: "10-day-vipassana-course",
    title: "10-Day Vipassana Course",
    description:
      "A 16-lesson home-retreat structure modelled on the silent Vipassana tradition — for serious practitioners ready to go deeper.",
    intro:
      "Designed as a self-paced home retreat, this course mirrors the structure of the silent 10-day Vipassana courses in the U Ba Khin / S.N. Goenka lineage. Two scholarly framing lessons set the context, three guided practices ease you in, and ten daily talks (plus a closing day) carry you through the retreat arc.",
    difficulty: "Advanced",
    audience: "Advanced practitioners",
    lessons: [
      {
        slug: "the-dynamics-of-theravada-insight-meditation-bhikkhu-analayo",
        title: "The Dynamics of Insight Meditation",
        groupHeading: "Foundations",
      },
      {
        slug: "the-development-of-insight-a-study-of-the-u-ba-khin-vipassana-meditation-tradition-as-taught-by-s-n-goenka-in-comparison-with-insight-teachings-in-the-early-discourses",
        title: "The Development of Insight",
      },
      {
        slug: "guided-vipassana-meditation-from-tara-brach",
        title: "Guided Vipassana Meditation, Tara Brach",
        groupHeading: "Guided practices",
      },
      { slug: "guided-vipassana-meditation", title: "Guided 18-Minute Vipassana Meditation" },
      { slug: "guided-25-minute-vipassana-meditation", title: "Guided 25-Minute Vipassana Meditation" },
      { slug: "10-day-vipassana-course-day-1", title: "Day 1", groupHeading: "The 10-day arc" },
      { slug: "10-day-vipassana-course-day-2", title: "Day 2" },
      { slug: "10-day-vipassana-course-day-3", title: "Day 3" },
      { slug: "10-day-vipassana-course-day-4", title: "Day 4" },
      { slug: "10-day-vipassana-course-day-5", title: "Day 5" },
      { slug: "10-day-vipassana-course-day-6", title: "Day 6" },
      { slug: "10-day-vipassana-course-day-7", title: "Day 7" },
      { slug: "10-day-vipassana-course-day-8", title: "Day 8" },
      { slug: "10-day-vipassana-course-day-9", title: "Day 9" },
      { slug: "10-day-vipassana-course-day-10", title: "Day 10" },
      { slug: "10-day-vipassana-course-last-day", title: "Last Day" },
    ],
  },

  "brahmavihara-and-emptiness": {
    slug: "brahmavihara-and-emptiness",
    title: "Loving-Kindness and Emptiness",
    description:
      "Six advanced practices weaving the brahmavihārās with emptiness teachings — for practitioners with an established sit.",
    intro:
      "A short but demanding contemplative arc that pairs the four boundless qualities (loving-kindness, compassion, sympathetic joy, equanimity) with progressively deeper teachings on emptiness. Recommended for practitioners with a stable daily practice and some prior exposure to the brahmavihāras.",
    difficulty: "Advanced",
    audience: "Advanced practitioners",
    lessons: [
      { slug: "brahmavihara-1", title: "Brahmavihāra 1", groupHeading: "Loving-kindness" },
      { slug: "brahmavihara-2", title: "Brahmavihāra 2" },
      { slug: "emptiness-1", title: "Emptiness 1", groupHeading: "Emptiness" },
      { slug: "emptiness-2", title: "Emptiness 2" },
      { slug: "emptiness-3", title: "Emptiness 3" },
      { slug: "emptiness-4", title: "Emptiness 4" },
    ],
  },

  "the-work-that-reconnects": {
    slug: "the-work-that-reconnects",
    title: "The Work That Reconnects",
    description:
      "A 16-lesson series on Joanna Macy's framework — meeting climate grief and ecological overwhelm with grounded practice.",
    intro:
      "Joanna Macy's The Work That Reconnects offers a contemplative response to ecological crisis, moving through gratitude, honouring our pain, seeing with new eyes, and going forth. This 16-lesson course adapts that spiral into guided practices, group exercises, and reflections you can run alone or with a circle.",
    difficulty: "Intermediate",
    audience: "Daily practice",
    lessons: [
      { slug: "you-can-do-this-work", title: "You Can Do This Work" },
      { slug: "the-spiral-of-the-work", title: "The Spiral of the Work" },
      { slug: "open-sentences", title: "Open Sentences", groupHeading: "Coming from gratitude" },
      { slug: "gratitude-as-a-revolutionary-act", title: "Gratitude as a Revolutionary Act" },
      {
        slug: "the-three-aspects-of-the-great-turning",
        title: "The Three Aspects of the Great Turning",
        groupHeading: "Honouring our pain",
      },
      { slug: "the-milling", title: "The Milling" },
      { slug: "the-truth-mandala", title: "The Truth Mandala" },
      { slug: "breaking-through", title: "Breaking Through" },
      { slug: "the-ecological-self", title: "The Ecological Self", groupHeading: "Seeing with new eyes" },
      { slug: "the-systems-view-of-life", title: "The Systems View of Life" },
      { slug: "widening-circles", title: "Widening Circles" },
      { slug: "deep-time-work", title: "Deep Time Work" },
      { slug: "the-gifts-of-the-ancestors", title: "The Gifts of the Ancestors" },
      { slug: "the-seventh-generation", title: "The Seventh Generation" },
      {
        slug: "goals-resources-for-the-great-turning",
        title: "Goals & Resources for the Great Turning",
        groupHeading: "Going forth",
      },
      { slug: "epilogue", title: "Epilogue" },
    ],
  },

  "how-to-guide-mindfulness-meditations-for-well-being-and-resilience": {
    slug: "how-to-guide-mindfulness-meditations-for-well-being-and-resilience",
    title: "How to Guide Mindfulness Meditations for Well-Being & Resilience",
    description:
      "Five lessons for new and developing teachers on guiding meditations that support nervous-system safety and resilience.",
    intro:
      "A focused primer for teachers, coaches, and helping professionals on how to guide mindfulness practices in ways that support nervous-system regulation and resilience. The five chapters cover what mindfulness actually is, how to lead guided practices, common misunderstandings, and how to build a consistent class structure.",
    difficulty: "Intermediate",
    audience: "Teachers",
    lessons: [
      { slug: "chapter-1-what-is-mindfulness-exactly", title: "Chapter 1 · What is Mindfulness, Exactly?" },
      { slug: "chapter-2-guiding-mindfulness-practices", title: "Chapter 2 · Guiding Mindfulness Practices" },
      { slug: "chapter-3-mastering-mindful-teaching", title: "Chapter 3 · Mastering Mindful Teaching" },
      { slug: "chapter-4-addressing-misunderstandings", title: "Chapter 4 · Addressing Misunderstandings" },
      { slug: "chapter-5-create-a-consistent-structure", title: "Chapter 5 · Create a Consistent Structure" },
    ],
  },

  "search-inside-yourself-program-developed-at-google": {
    slug: "search-inside-yourself-program-developed-at-google",
    title: "'Search Inside Yourself' Program Intro",
    description:
      "An 8-lesson overview of the mindfulness and emotional-intelligence program developed at Google.",
    intro:
      "An accessible introduction to Search Inside Yourself, the mindfulness and emotional-intelligence curriculum developed at Google by Chade-Meng Tan. The program walks through the five domains of emotional intelligence — self-awareness, self-regulation, motivation, empathy, and social skill — as trainable mindfulness skills.",
    difficulty: "Easy",
    audience: "Workplace",
    lessons: [
      { slug: "1-introduction-to-emotional-intelligence", title: "1 · Introduction to Emotional Intelligence" },
      { slug: "2-day-of-mindfulness", title: "2 · Day of Mindfulness" },
      { slug: "3-self-awareness", title: "3 · Self-Awareness" },
      { slug: "4-self-regulation", title: "4 · Self-Regulation" },
      { slug: "5-motivation", title: "5 · Motivation" },
      { slug: "6-empathy", title: "6 · Empathy" },
      { slug: "7-leading-with-compassion", title: "7 · Leading with Compassion" },
      { slug: "further-resources", title: "Further Resources" },
    ],
  },

  "mindfulness-worksheets-tutorials": {
    slug: "mindfulness-worksheets-tutorials",
    title: "Mindfulness Worksheets Tutorials",
    description:
      "20 short tutorials on using our printable worksheets — for personal practice and for client / group sessions.",
    intro:
      "Practical tutorials on getting the most out of the Mindfulness Exercises printable worksheet library. Two opening guides cover personal vs professional use; the remaining 18 tutorials each walk through one specific worksheet so you can confidently introduce it in your own sits or with clients.",
    difficulty: "Easy",
    audience: "Teachers",
    lessons: [
      { slug: "a-guide-for-personal-use", title: "A Guide For Personal Use", groupHeading: "Orientation" },
      { slug: "a-guide-for-professionals", title: "A Guide For Professionals" },
      { slug: "perfect-10-breaths", title: "Perfect 10 Breaths", groupHeading: "Worksheet walkthroughs" },
      { slug: "past-present-future", title: "Past, Present, Future" },
      { slug: "the-mother-meditation", title: "The Mother Meditation" },
      { slug: "limitless-awareness", title: "Limitless Awareness" },
      { slug: "gratitude", title: "Gratitude" },
      { slug: "loving-kindness-meditation-4", title: "Loving-Kindness Meditation" },
      { slug: "everything-fresh-and-new", title: "Everything Fresh and New" },
      { slug: "from-big-to-small-to-big", title: "From Big to Small (to Big)" },
      { slug: "a-new-perspective-on-emotions", title: "A New Perspective on Emotions" },
      { slug: "earth-element", title: "Earth Element" },
      { slug: "contentment", title: "Contentment" },
      { slug: "calming-exhale-breath", title: "Calming Exhale Breath" },
      { slug: "exploring-the-five-senses", title: "Exploring the Five Senses" },
      { slug: "noticing-movement-through-breath-awareness", title: "Noticing Movement Through Breath Awareness" },
      { slug: "grounding-through-body-awareness", title: "Grounding Through Body Awareness" },
      { slug: "pleasant-vs-unpleasant", title: "Pleasant vs Unpleasant" },
      { slug: "walking-meditation", title: "Walking Meditation" },
      { slug: "true-nature-of-mind", title: "True Nature of Mind" },
    ],
  },

  "uclas-guided-meditations-english-spanish": {
    slug: "uclas-guided-meditations-english-spanish",
    title: "UCLA's Guided Meditations (English & Spanish)",
    description:
      "12 evidence-based guided practices from UCLA's Mindful Awareness Research Center, in English and Spanish.",
    intro:
      "A bilingual collection of guided practices from UCLA's Mindful Awareness Research Center (MARC). Includes foundational breath, body, and loving-kindness meditations alongside body scans for sleep — eight in English and four in Spanish.",
    difficulty: "Easy",
    audience: "Beginners",
    lessons: [
      { slug: "meditacion-basica", title: "Meditación Básica", groupHeading: "En Español" },
      { slug: "meditacion-comiendo", title: "Meditación Comiendo" },
      { slug: "meditacion-de-bondad-amorosa", title: "Meditación de Bondad Amorosa" },
      { slug: "meditacion-completa", title: "Meditación Completa" },
      { slug: "breathing-meditation", title: "Breathing Meditation", groupHeading: "In English" },
      { slug: "breath-sound-body-meditation", title: "Breath, Sound, Body Meditation" },
      { slug: "complete-meditation-instructions", title: "Complete Meditation Instructions" },
      { slug: "meditation-for-working-with-difficulties", title: "Meditation for Working With Difficulties" },
      { slug: "loving-kindness-meditation-2", title: "Loving-Kindness Meditation" },
      { slug: "body-and-sound-meditation", title: "Body and Sound Meditation" },
      { slug: "body-scan-meditation", title: "Body Scan Meditation" },
      { slug: "body-scan-for-sleep", title: "Body Scan for Sleep" },
    ],
  },

  "mindfulness-meditations-for-kids": {
    slug: "mindfulness-meditations-for-kids",
    title: "Mindfulness Meditations for Kids",
    description:
      "Six short, friendly meditations to share with children — gentle introductions to attention, kindness, and calm.",
    intro:
      "Six short, imagery-led meditations designed to be shared with children. Each one is short enough to fit into a transition moment — bedtime, before school, after a big feeling — and uses gentle visualisations (a garden, a butterfly, a strong oak tree) that kids find easy to follow.",
    difficulty: "Easy",
    audience: "Parents & kids",
    lessons: [
      { slug: "breathing-exercise", title: "Breathing Exercise" },
      { slug: "the-magnificent-garden", title: "The Magnificent Garden" },
      { slug: "becoming-a-butterfly", title: "Becoming a Butterfly" },
      { slug: "healing-water-lily", title: "Healing Water Lily" },
      { slug: "mighty-oak-tree", title: "Mighty Oak Tree" },
      { slug: "loving-kindness-meditation", title: "Loving-Kindness Meditation for Kids" },
    ],
  },
};

/** Live WP origin — lesson links open the existing course player off-site. */
export const WP_COURSE_ORIGIN = "https://mindfulnessexercises.com";

export function getCourseDetail(slug: string): CourseDetail | undefined {
  return COURSE_DETAILS[slug];
}

export function listCourseSlugs(): string[] {
  return Object.keys(COURSE_DETAILS);
}
