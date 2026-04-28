// Registry mapping post slug → downloadable PDF worksheet.
// Worksheets are reflective/printable exercises (career values, time use,
// team dynamics, etc.) — distinct from guided meditation scripts but rendered
// with the same MeditationScript component using kind="worksheet".
//
// Add new entries as PDFs are uploaded to public/worksheets/.
// `flagged: true` means the slug→PDF match is a best guess (no exact post
// existed) and the placement should be reviewed before relying on it.

export interface WorksheetEntry {
  /** Path served from /public — must start with "/worksheets/". */
  pdfUrl: string;
  /** Display title shown on the worksheet card. */
  title: string;
  /** Human-readable file size, e.g. "163 KB". */
  fileSize?: string;
  /** True when the slug↔PDF mapping was inferred (needs human review). */
  flagged?: boolean;
}

/**
 * Map of post slug → single primary worksheet for that post.
 * For posts that warrant multiple worksheets, see WORKSHEET_BUNDLES below.
 */
export const WORKSHEETS: Record<string, WorksheetEntry> = {
  "appraising-career-values": {
    pdfUrl: "/worksheets/appraising-my-career-values.pdf",
    title: "Appraising My Career Values",
    fileSize: "163 KB",
  },
  "appreciating-accomplishments": {
    pdfUrl: "/worksheets/appreciating-your-accomplishments.pdf",
    title: "Appreciating Your Accomplishments",
    fileSize: "161 KB",
  },
  "assessing-contributions-team": {
    pdfUrl: "/worksheets/assessing-contributions-to-your-team.pdf",
    title: "Assessing Contributions to Your Team",
    fileSize: "161 KB",
  },
  "dealing-busy-schedules": {
    pdfUrl: "/worksheets/dealing-with-busy-schedules.pdf",
    title: "Dealing with Busy Schedules",
    fileSize: "165 KB",
  },
  "defining-meaning-success": {
    pdfUrl: "/worksheets/defining-your-meaning-of-success.pdf",
    title: "Defining Your Meaning of Success",
    fileSize: "164 KB",
  },
  "evaluating-wisely-spend-time": {
    pdfUrl: "/worksheets/evaluating-how-wisely-you-spend-your-time.pdf",
    title: "Evaluating How Wisely You Spend Your Time",
    fileSize: "162 KB",
  },
  "facilitating-learning": {
    pdfUrl: "/worksheets/facilitating-your-learning.pdf",
    title: "Facilitating Your Learning",
    fileSize: "173 KB",
  },
  "facing-challenges-others": {
    pdfUrl: "/worksheets/facing-challenges-by-others.pdf",
    title: "Facing Challenges by Others",
    fileSize: "161 KB",
  },
  "feeling-good-supporting-others": {
    pdfUrl: "/worksheets/feeling-good-about-supporting-others.pdf",
    title: "Feeling Good About Supporting Others",
    fileSize: "162 KB",
  },
  "gauging-external-contributions": {
    pdfUrl: "/worksheets/gauging-external-contributions.pdf",
    title: "Gauging External Contributions",
    fileSize: "161 KB",
  },
  "how-to-create-more-time": {
    pdfUrl: "/worksheets/how-to-create-more-time.pdf",
    title: "How to Create More Time",
    fileSize: "175 KB",
  },
  "make-important-career-changes": {
    pdfUrl: "/worksheets/how-to-make-important-career-changes.pdf",
    title: "How to Make Important Career Changes",
    fileSize: "178 KB",
  },
  "optimize-marketing-efforts": {
    pdfUrl: "/worksheets/how-to-optimize-your-marketing-efforts.pdf",
    title: "How to Optimize Your Marketing Efforts",
    fileSize: "164 KB",
  },
  "stick-plan": {
    pdfUrl: "/worksheets/how-to-stick-to-a-plan.pdf",
    title: "How to Stick to a Plan",
    fileSize: "174 KB",
  },
  "mindfulness-triggering-others": {
    pdfUrl: "/worksheets/mindfulness-of-triggering-others.pdf",
    title: "Mindfulness of Triggering Others",
    fileSize: "161 KB",
  },
  "problem-solving": {
    pdfUrl: "/worksheets/problem-solving.pdf",
    title: "Problem Solving",
    fileSize: "190 KB",
  },
  "refining-speak": {
    pdfUrl: "/worksheets/refining-how-you-speak-up.pdf",
    title: "Refining How You Speak Up",
    fileSize: "161 KB",
  },
  "self-affirmation-reduce-self-control-failure": {
    pdfUrl: "/worksheets/self-affirmation-to-reduce-self-control-failure.pdf",
    title: "Self-Affirmation to Reduce Self-Control Failure",
    fileSize: "181 KB",
  },
  "six-questions-greater-accomplishment": {
    pdfUrl: "/worksheets/six-questions-for-greater-accomplishment.pdf",
    title: "Six Questions for Greater Accomplishment",
    fileSize: "173 KB",
  },
  "art-generous-learning": {
    pdfUrl: "/worksheets/the-art-of-generous-learning.pdf",
    title: "The Art of Generous Learning",
    fileSize: "164 KB",
  },
  "time-management": {
    pdfUrl: "/worksheets/time-management.pdf",
    title: "Time Management",
    fileSize: "211 KB",
  },
  "a-new-perspective-on-emotions": {
    pdfUrl: "/worksheets/a-new-perspective-on-emotions.pdf",
    title: "A New Perspective on Emotions",
    fileSize: "216 KB",
  },
  "affirmations": {
    pdfUrl: "/worksheets/affirmations.pdf",
    title: "Affirmations",
    fileSize: "303 KB",
  },
  "becoming-comfortable-emotions": {
    pdfUrl: "/worksheets/becoming-comfortable-with-emotions.pdf",
    title: "Becoming Comfortable With Emotions",
    fileSize: "161 KB",
  },
  "breaking-patterns-self-judgement": {
    pdfUrl: "/worksheets/breaking-patterns-of-self-judgment.pdf",
    title: "Breaking Patterns of Self-Judgment",
    fileSize: "162 KB",
  },
  "building-inner-strength": {
    pdfUrl: "/worksheets/building-inner-strength.pdf",
    title: "Building Inner Strength",
    fileSize: "161 KB",
  },
  "calming-exhale-breath": {
    pdfUrl: "/worksheets/calming-exhale-breath.pdf",
    title: "Calming Exhale Breath",
    fileSize: "191 KB",
  },
  "caring-integrated-way": {
    pdfUrl: "/worksheets/caring-for-yourself-in-an-integrated-way.pdf",
    title: "Caring For Yourself in an Integrated Way",
    fileSize: "167 KB",
  },
  "clarifying-emotions": {
    pdfUrl: "/worksheets/clarifying-emotions.pdf",
    title: "Clarifying Emotions",
    fileSize: "180 KB",
  },
  "cultivating-gratitude": {
    pdfUrl: "/worksheets/cultivating-gratitude.pdf",
    title: "Cultivating Gratitude",
    fileSize: "161 KB",
  },
  "diving-core": {
    pdfUrl: "/worksheets/diving-into-your-core.pdf",
    title: "Diving Into Your Core",
    fileSize: "160 KB",
  },
  "effecting-effected": {
    pdfUrl: "/worksheets/effecting-change.pdf",
    title: "Effecting Change",
    fileSize: "162 KB",
  },
  "emotional-awareness-meditation": {
    pdfUrl: "/worksheets/emotional-awareness-meditation.pdf",
    title: "Emotional Awareness Meditation",
    fileSize: "174 KB",
  },
  "emotional-journaling": {
    pdfUrl: "/worksheets/emotional-journaling.pdf",
    title: "Emotional Journaling",
    fileSize: "174 KB",
  },
  "emotional-validation": {
    pdfUrl: "/worksheets/emotional-validation.pdf",
    title: "Emotional Validation",
    fileSize: "183 KB",
  },
  "finding-expressing-strong-emotions": {
    pdfUrl: "/worksheets/finding-and-expressing-strong-emotions.pdf",
    title: "Finding and Expressing Strong Emotions",
    fileSize: "160 KB",
  },
  "for-chaotic-times": {
    pdfUrl: "/worksheets/for-chaotic-times.pdf",
    title: "For Chaotic Times",
    fileSize: "163 KB",
  },
  "fueling-happiness": {
    pdfUrl: "/worksheets/fueling-your-happiness.pdf",
    title: "Fueling Your Happiness",
    fileSize: "160 KB",
  },
  "getting-know-identify": {
    pdfUrl: "/worksheets/getting-to-know-the-is-you-identify-with.pdf",
    title: "Getting to Know the \u201cI\u2019s\u201d You Identify With",
    fileSize: "162 KB",
  },
  "affirmations-for-anxiety": {
    pdfUrl: "/worksheets/finding-your-way-out-of-the-three-fears.pdf",
    title: "Finding Your Way Out of the Three Fears",
    fileSize: "162 KB",
    flagged: true,
  },
  "gratitude-practice": {
    pdfUrl: "/worksheets/gratitude-practice.pdf",
    title: "Gratitude Practice",
    fileSize: "765 KB",
  },
  "gratitude-when-youve-got-attitude": {
    pdfUrl: "/worksheets/gratitude-when-youve-got-attitude.pdf",
    title: "Gratitude When You\u2019ve Got Attitude",
    fileSize: "181 KB",
  },
  "feel-good-feeling-good": {
    pdfUrl: "/worksheets/how-to-feel-good-about-feeling-good.pdf",
    title: "How to Feel Good About Feeling Good",
    fileSize: "160 KB",
  },
  "untie-mental-knots": {
    pdfUrl: "/worksheets/how-to-untie-mental-knots.pdf",
    title: "How to Untie Mental Knots",
    fileSize: "168 KB",
  },
  "inspiring-trust": {
    pdfUrl: "/worksheets/inspiring-trust.pdf",
    title: "Inspiring Trust",
    fileSize: "159 KB",
  },
  "investing-emotional-energy": {
    pdfUrl: "/worksheets/investing-your-emotional-energy.pdf",
    title: "Investing Your Emotional Energy",
    fileSize: "160 KB",
  },
  "mindfulness-moods": {
    pdfUrl: "/worksheets/mindfulness-of-moods.pdf",
    title: "Mindfulness of Moods",
    fileSize: "161 KB",
  },
  "mindfulness-negativity": {
    pdfUrl: "/worksheets/mindfulness-of-negativity.pdf",
    title: "Mindfulness of Negativity",
    fileSize: "161 KB",
  },
  "naming-the-feelings-meditation-worksheet": {
    pdfUrl: "/worksheets/naming-the-feelings-meditation.pdf",
    title: "Naming the Feelings Meditation",
    fileSize: "268 KB",
  },
  "noting-effects-feeling-unappreciated": {
    pdfUrl: "/worksheets/noting-the-effects-of-feeling-unappreciated.pdf",
    title: "Noting the Effects of Feeling Unappreciated",
    fileSize: "161 KB",
  },
  "opening-heart-mind-gratitude": {
    pdfUrl: "/worksheets/opening-your-heart-and-mind-to-gratitude.pdf",
    title: "Opening Your Heart and Mind to Gratitude",
    fileSize: "162 KB",
  },
  "overcoming-anxious-thoughts": {
    pdfUrl: "/worksheets/overcoming-anxious-thoughts.pdf",
    title: "Overcoming Anxious Thoughts",
    fileSize: "185 KB",
  },
  "saturating-appreciation": {
    pdfUrl: "/worksheets/saturating-your-being-with-appreciation.pdf",
    title: "Saturating Your Being With Appreciation",
    fileSize: "161 KB",
  },
  "scheduling-worry-time": {
    pdfUrl: "/worksheets/scheduling-worry-time.pdf",
    title: "Scheduling Worry Time",
    fileSize: "173 KB",
  },
  "sensing-triggered-feelings": {
    pdfUrl: "/worksheets/sensing-into-strong-triggered-feelings.pdf",
    title: "Sensing Into Strong, Triggered Feelings",
    fileSize: "160 KB",
  },
  "sourcing-self-judgment-comes": {
    pdfUrl: "/worksheets/sourcing-where-your-self-judgment-comes-from.pdf",
    title: "Sourcing Where Your Self-Judgment Comes From",
    fileSize: "161 KB",
  },
  "staying-with-emotions": {
    pdfUrl: "/worksheets/staying-with-emotions.pdf",
    title: "Staying with Emotions",
    fileSize: "163 KB",
  },
  "taking-in-the-good": {
    pdfUrl: "/worksheets/taking-in-the-good.pdf",
    title: "Taking in the Good",
    fileSize: "172 KB",
  },
  "three-good-things-exercise": {
    pdfUrl: "/worksheets/three-good-things-exercise.pdf",
    title: "Three Good Things Exercise",
    fileSize: "180 KB",
  },
  "tracking-your-mood": {
    pdfUrl: "/worksheets/tracking-your-mood.pdf",
    title: "Tracking Your Mood",
    fileSize: "175 KB",
  },
  "transforming-anger": {
    pdfUrl: "/worksheets/transforming-anger.pdf",
    title: "Transforming Anger",
    fileSize: "183 KB",
  },
  "transforming-anxiety": {
    pdfUrl: "/worksheets/transforming-anxiety.pdf",
    title: "Transforming Anxiety",
    fileSize: "183 KB",
  },
  "transforming-ill-will": {
    pdfUrl: "/worksheets/transforming-ill-will.pdf",
    title: "Transforming Ill Will",
    fileSize: "186 KB",
  },
  "withholding": {
    pdfUrl: "/worksheets/why-are-you-withholding.pdf",
    title: "Why Are You Withholding?",
    fileSize: "160 KB",
  },
  "working-with-a-nightmare": {
    pdfUrl: "/worksheets/working-with-a-nightmare.pdf",
    title: "Working with a Nightmare",
    fileSize: "175 KB",
  },
  "working-judgments": {
    pdfUrl: "/worksheets/working-with-judgments.pdf",
    title: "Working with Judgments",
    fileSize: "163 KB",
  },
  "be-your-own-best-buddy-kids-worksheet": {
    pdfUrl: "/worksheets/be-your-own-best-buddy-kids.pdf",
    title: "Be Your Own Best Buddy (Kids)",
    fileSize: "205 KB",
  },
  "family-engagement": {
    pdfUrl: "/worksheets/family-engagement.pdf",
    title: "Family Engagement",
    fileSize: "163 KB",
  },
  "food-contemplation-kids": {
    pdfUrl: "/worksheets/food-contemplation-for-kids.pdf",
    title: "Food Contemplation for Kids",
    fileSize: "158 KB",
  },
  "mindful-family-calendar": {
    pdfUrl: "/worksheets/mindful-family-calendar.pdf",
    title: "Mindful Family Calendar",
    fileSize: "169 KB",
  },
  "snack-preparation-exercise": {
    pdfUrl: "/worksheets/mindful-snack-preparation.pdf",
    title: "Mindful Snack Preparation",
    fileSize: "193 KB",
  },
  "mindfully-schoolwork-tests": {
    pdfUrl: "/worksheets/mindfully-doing-schoolwork-and-tests.pdf",
    title: "Mindfully Doing Schoolwork and Tests",
    fileSize: "160 KB",
  },
  "parenting-happily": {
    pdfUrl: "/worksheets/parenting-happily.pdf",
    title: "Parenting Happily",
    fileSize: "172 KB",
  },
  "pebble-bag-treasure-quest": {
    pdfUrl: "/worksheets/pebble-bag-treasure-quest.pdf",
    title: "Pebble Bag Treasure Quest",
    fileSize: "164 KB",
  },
  "sounds-and-silence-kids": {
    pdfUrl: "/worksheets/sounds-and-silence-kids.pdf",
    title: "Sounds and Silence (Kids)",
    fileSize: "166 KB",
  },
  "activating-the-parasympathetic-wing-of-your-nervous-system": {
    pdfUrl: "/worksheets/activating-parasympathetic-wing.pdf",
    title: "Activating the Parasympathetic Wing of Your Nervous System",
    fileSize: "192 KB",
  },
  "contentment": {
    pdfUrl: "/worksheets/contentment.pdf",
    title: "Contentment",
    fileSize: "193 KB",
  },
  "earth-descent-meditation": {
    pdfUrl: "/worksheets/earth-descent-meditation.pdf",
    title: "Earth Descent Meditation",
    fileSize: "195 KB",
  },
  "eating-meditation": {
    pdfUrl: "/worksheets/eating-meditation.pdf",
    title: "Eating Meditation",
    fileSize: "189 KB",
  },
  "establishing-safety": {
    pdfUrl: "/worksheets/establishing-safety.pdf",
    title: "Establishing Safety",
    fileSize: "209 KB",
  },
  "exercising-mindfully": {
    pdfUrl: "/worksheets/exercising-mindfully.pdf",
    title: "Exercising Mindfully",
    fileSize: "163 KB",
  },
  "mindful-physical-pain": {
    pdfUrl: "/worksheets/how-to-be-mindful-of-physical-pain.pdf",
    title: "How To Be Mindful of Physical Pain",
    fileSize: "180 KB",
  },
  "humor-therapy": {
    pdfUrl: "/worksheets/humor-therapy.pdf",
    title: "Humor Therapy",
    fileSize: "182 KB",
  },
  "mindful-eating-oranges": {
    pdfUrl: "/worksheets/mindful-eating-with-oranges.pdf",
    title: "Mindful Eating With Oranges",
    fileSize: "168 KB",
  },
  "monitoring-stress-reduction": {
    pdfUrl: "/worksheets/monitoring-stress-reduction.pdf",
    title: "Monitoring Stress Reduction",
    fileSize: "176 KB",
  },
  "movement-meditation": {
    pdfUrl: "/worksheets/movement-meditation.pdf",
    title: "Movement Meditation",
    fileSize: "264 KB",
  },
  "reducing-holiday-stress": {
    pdfUrl: "/worksheets/reducing-holiday-stress.pdf",
    title: "Reducing Holiday Stress",
    fileSize: "178 KB",
  },
  "scheduling-something-pleasant": {
    pdfUrl: "/worksheets/scheduling-something-pleasant.pdf",
    title: "Scheduling Something Pleasant",
    fileSize: "190 KB",
  },
  "stress-eating": {
    pdfUrl: "/worksheets/stress-eating.pdf",
    title: "Stress Eating",
    fileSize: "178 KB",
  },
  "gift-of-rest": {
    pdfUrl: "/worksheets/the-gift-of-rest.pdf",
    title: "The Gift of Rest",
    fileSize: "167 KB",
  },
  "art-therapy": {
    pdfUrl: "/worksheets/art-therapy.pdf",
    title: "Art Therapy",
    fileSize: "189 KB",
  },
  "body-scan-meditation": {
    pdfUrl: "/worksheets/body-scan-meditation.pdf",
    title: "Body Scan Meditation",
    fileSize: "210 KB",
  },
  "breath-awareness-meditation": {
    pdfUrl: "/worksheets/breath-awareness-meditation.pdf",
    title: "Breath Awareness Meditation",
    fileSize: "198 KB",
  },
  "chocolate-meditation": {
    pdfUrl: "/worksheets/chocolate-meditation.pdf",
    title: "Chocolate Meditation",
    fileSize: "167 KB",
  },
  "concentration": {
    pdfUrl: "/worksheets/concentration.pdf",
    title: "Concentration",
    fileSize: "187 KB",
  },
  "cultivating-compassion": {
    pdfUrl: "/worksheets/cultivating-compassion.pdf",
    title: "Cultivating Compassion",
    fileSize: "173 KB",
  },
  "cultivating-equanimity": {
    pdfUrl: "/worksheets/cultivating-equanimity.pdf",
    title: "Cultivating Equanimity",
    fileSize: "269 KB",
  },
  "cultivating-joy": {
    pdfUrl: "/worksheets/cultivating-joy.pdf",
    title: "Cultivating Joy",
    fileSize: "479 KB",
  },
  "do-nothing-meditation": {
    pdfUrl: "/worksheets/do-nothing-meditation.pdf",
    title: "Do Nothing Meditation",
    fileSize: "187 KB",
  },
  "four-stages-of-meditation": {
    pdfUrl: "/worksheets/four-stages-of-meditation.pdf",
    title: "Four Stages of Meditation",
    fileSize: "382 KB",
  },
  "increasing-ability-present": {
    pdfUrl: "/worksheets/increasing-your-ability-to-be-present.pdf",
    title: "Increasing Your Ability to be Present",
    fileSize: "183 KB",
  },
  "joyful-effort-worksheet": {
    pdfUrl: "/worksheets/joyful-effort.pdf",
    title: "Joyful Effort",
    fileSize: "177 KB",
  },
  "locating-self": {
    pdfUrl: "/worksheets/locating-the-self.pdf",
    title: "Locating the Self",
    fileSize: "162 KB",
  },
  "loving-kindness-meditation": {
    pdfUrl: "/worksheets/loving-kindness-meditation.pdf",
    title: "Loving-Kindness Meditation",
    fileSize: "175 KB",
  },
  "loving-kindness-meditation-script": {
    pdfUrl: "/worksheets/loving-kindness-meditation-alt.pdf",
    title: "Loving Kindness Meditation Script",
    fileSize: "211 KB",
  },
  "loving-kindness-visualization-the-spheres-worksheet": {
    pdfUrl: "/worksheets/loving-kindness-visualization-the-spheres.pdf",
    title: "Loving Kindness Visualization – The Spheres",
    fileSize: "151 KB",
  },
  "limitless-awareness": {
    pdfUrl: "/worksheets/limitless-awareness.pdf",
    title: "Limitless Awareness",
    fileSize: "192 KB",
  },
  "be-the-pebble": {
    pdfUrl: "/worksheets/like-the-ocean-floor.pdf",
    title: "Like the Ocean Floor",
    fileSize: "186 KB",
  },
  "managing-mitigating-stress": {
    pdfUrl: "/worksheets/managing-and-mitigating-stress.pdf",
    title: "Managing and Mitigating Stress",
    fileSize: "224 KB",
  },
  "meditation-on-life-and-death": {
    pdfUrl: "/worksheets/meditation-on-life-and-death.pdf",
    title: "Meditation Script on Life and Death",
    fileSize: "368 KB",
  },
  "meditation-with-a-pet": {
    pdfUrl: "/worksheets/meditation-with-a-pet.pdf",
    title: "Meditation with a Pet",
    fileSize: "147 KB",
  },
  "mindfulness-meditation-beginners-free-ebook": {
    pdfUrl: "/worksheets/mindful-meditation-for-beginners-ebook.pdf",
    title: "Mindful Meditation for Beginners (eBook)",
    fileSize: "266 KB",
  },
  "mindful-yoga": {
    pdfUrl: "/worksheets/mindful-yoga.pdf",
    title: "Mindful Yoga",
    fileSize: "198 KB",
  },
  "mountain-meditation": {
    pdfUrl: "/worksheets/mountain-meditation.pdf",
    title: "Mountain Meditation",
    fileSize: "181 KB",
  },
  "mindful-pause": {
    pdfUrl: "/worksheets/mindful-pause.pdf",
    title: "Mindful Pause",
    fileSize: "173 KB",
  },
  "nature-walks": {
    pdfUrl: "/worksheets/nature-walks.pdf",
    title: "Nature Walks",
    fileSize: "187 KB",
  },
  "noticing-movement-through-breath": {
    pdfUrl: "/worksheets/noticing-movement-through-breath.pdf",
    title: "Noticing Movement through Breath",
    fileSize: "194 KB",
  },
  "noticing-your-helpers": {
    pdfUrl: "/worksheets/noticing-your-helpers.pdf",
    title: "Noticing Your Helpers",
    fileSize: "376 KB",
  },
  "outdoor-meditation": {
    pdfUrl: "/worksheets/outdoor-meditation.pdf",
    title: "An Outdoor Meditation Script for Peace and Grounding",
    fileSize: "874 KB",
  },
  "posture-meditation": {
    pdfUrl: "/worksheets/posture-meditation.pdf",
    title: "Posture Meditation",
    fileSize: "186 KB",
  },
  "puppies-meditation-worksheet": {
    pdfUrl: "/worksheets/puppies-meditation.pdf",
    title: "Puppies Meditation",
    fileSize: "151 KB",
  },
  "self-hypnosis": {
    pdfUrl: "/worksheets/self-hypnosis.pdf",
    title: "Self-Hypnosis",
    fileSize: "195 KB",
  },
  "self-kindness-part-1-worksheet": {
    pdfUrl: "/worksheets/self-kindness-part-1.pdf",
    title: "Self-Kindness Part 1",
    fileSize: "158 KB",
  },
  "self-kindness-part-ii-worksheet": {
    pdfUrl: "/worksheets/self-kindness-part-2.pdf",
    title: "Self-Kindness Part II",
    fileSize: "152 KB",
  },
  "several-styles-sitting-meditation": {
    pdfUrl: "/worksheets/several-styles-of-sitting-meditation.pdf",
    title: "Several Styles of Sitting Meditation",
    fileSize: "199 KB",
  },
  "shadow-exercise": {
    pdfUrl: "/worksheets/shadow-exercise.pdf",
    title: "Shadow Exercise",
    fileSize: "182 KB",
  },
  "sitting-meditation-instructions": {
    pdfUrl: "/worksheets/sitting-meditation-instructions.pdf",
    title: "Sitting Meditation Instructions",
    fileSize: "181 KB",
  },
  "the-mother-meditation": {
    pdfUrl: "/worksheets/the-mother-meditation.pdf",
    title: "The Mother Meditation",
    fileSize: "201 KB",
  },
  "trataka-eye-gazing": {
    pdfUrl: "/worksheets/trataka-eye-gazing.pdf",
    title: "Trataka — Eye Gazing",
    fileSize: "193 KB",
  },
  "walking-meditation": {
    pdfUrl: "/worksheets/walking-meditation.pdf",
    title: "Walking Meditation",
    fileSize: "191 KB",
  },
  "walking-meditation-worksheet": {
    pdfUrl: "/worksheets/walking-meditation-2.pdf",
    title: "Walking Meditation",
    fileSize: "190 KB",
  },
  "acknowledging-success-worksheet": {
    pdfUrl: "/worksheets/acknowledging-success.pdf",
    title: "Acknowledging Success",
    fileSize: "192 KB",
  },
  "being-still-worksheet": {
    pdfUrl: "/worksheets/being-still.pdf",
    title: "Being Still",
    fileSize: "372 KB",
  },
  "tune-up-with-music": {
    pdfUrl: "/worksheets/boosting-mood-with-music.pdf",
    title: "Boosting Mood with Music",
    fileSize: "194 KB",
  },
  "change-history-channel": {
    pdfUrl: "/worksheets/changing-your-history-channel.pdf",
    title: "Changing Your History Channel",
    fileSize: "192 KB",
  },
  "disputing-negative-thoughts": {
    pdfUrl: "/worksheets/compassionately-questioning-negative-thoughts.pdf",
    title: "Compassionately Questioning Negative Thoughts",
    fileSize: "180 KB",
  },
  "controlled-breathing": {
    pdfUrl: "/worksheets/controlled-breathing.pdf",
    title: "Controlled Breathing",
    fileSize: "179 KB",
  },
  "sharing-gratitude": {
    pdfUrl: "/worksheets/cultivating-and-sharing-gratitude.pdf",
    title: "Cultivating and Sharing Gratitude",
    fileSize: "215 KB",
  },
  "here-and-now-pleasantness": {
    pdfUrl: "/worksheets/cultivating-childlike-wonder.pdf",
    title: "Cultivating Childlike Wonder",
    fileSize: "194 KB",
  },
  "decentralizing-pain": {
    pdfUrl: "/worksheets/decentralizing-pain.pdf",
    title: "Decentralizing Pain",
    fileSize: "182 KB",
  },
  "putting-weather-gear": {
    pdfUrl: "/worksheets/dressing-for-the-weather.pdf",
    title: "Dressing for the Weather",
    fileSize: "176 KB",
  },
  "earth-element": {
    pdfUrl: "/worksheets/earth-element.pdf",
    title: "Earth Element",
    fileSize: "192 KB",
  },
  "everything-fresh-and-new": {
    pdfUrl: "/worksheets/everything-fresh-and-new.pdf",
    title: "Everything Fresh and New",
    fileSize: "199 KB",
  },
  "taking-viewpoints-tunnel-busting": {
    pdfUrl: "/worksheets/exploring-another-viewpoint.pdf",
    title: "Exploring Another Viewpoint",
    fileSize: "188 KB",
  },
  "exploring-the-five-senses": {
    pdfUrl: "/worksheets/exploring-the-five-senses.pdf",
    title: "Exploring the Five Senses",
    fileSize: "201 KB",
  },
  "responders-first": {
    pdfUrl: "/worksheets/first-responder.pdf",
    title: "First Responder",
    fileSize: "183 KB",
  },
  "from-big-to-small-to-big": {
    pdfUrl: "/worksheets/from-big-to-small-to-big.pdf",
    title: "From Big to Small (to Big)",
    fileSize: "202 KB",
  },
  "full-body-awareness": {
    pdfUrl: "/worksheets/full-body-awareness.pdf",
    title: "Full Body Awareness",
    fileSize: "184 KB",
  },
  "gratitude-letter": {
    pdfUrl: "/worksheets/gratitude-letter.pdf",
    title: "Gratitude Letter",
    fileSize: "182 KB",
  },
  "gratitude": {
    pdfUrl: "/worksheets/gratitude.pdf",
    title: "Gratitude",
    fileSize: "196 KB",
  },
  "grounding-through-body-awareness": {
    pdfUrl: "/worksheets/grounding-through-body-awareness.pdf",
    title: "Grounding through Body Awareness",
    fileSize: "195 KB",
  },
  "warm-hands-visualization": {
    pdfUrl: "/worksheets/hand-warming-visualization.pdf",
    title: "Hand Warming Visualization",
    fileSize: "188 KB",
  },
  "identifying-strengths-strengths-journal": {
    pdfUrl: "/worksheets/identifying-strengths.pdf",
    title: "Identifying Strengths",
    fileSize: "230 KB",
  },
  "letting-go-story": {
    pdfUrl: "/worksheets/letting-go-of-limiting-stories.pdf",
    title: "Letting Go of Limiting Stories",
    fileSize: "189 KB",
  },
  "letting-go": {
    pdfUrl: "/worksheets/letting-go.pdf",
    title: "Letting Go",
    fileSize: "173 KB",
  },
};

/**
 * Some posts host multiple related worksheets (e.g. the workplace resources
 * hub). When the slug appears in this map, render every entry in order.
 *
 * Two worksheets — "Building a Network of Support" and "Discovering the
 * Concerns of Your Team" — had no dedicated post, so they're surfaced on the
 * closest topical hub. Per the audio-mapping-autonomy rule, worksheets are
 * also duplicated onto the most directly related single-post worksheets where
 * relevant.
 */
export const WORKSHEET_BUNDLES: Record<string, WorksheetEntry[]> = {
  "8-resources-for-teaching-mindfulness-at-the-workplace": [
    {
      pdfUrl: "/worksheets/building-a-network-of-support.pdf",
      title: "Building a Network of Support",
      fileSize: "193 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/discovering-the-concerns-of-your-team.pdf",
      title: "Discovering the Concerns of Your Team",
      fileSize: "182 KB",
      flagged: true,
    },
  ],
  // Duplicate "Discovering the Concerns of Your Team" onto the closest
  // single-topic post (team contributions) — these go together for facilitators.
  "assessing-contributions-team": [
    {
      pdfUrl: "/worksheets/discovering-the-concerns-of-your-team.pdf",
      title: "Discovering the Concerns of Your Team",
      fileSize: "182 KB",
      flagged: true,
    },
  ],
  // "Trusting in Yourself" has no dedicated post — surface on the closest
  // topical match (Building Inner Strength).
  "building-inner-strength": [
    {
      pdfUrl: "/worksheets/trusting-in-yourself.pdf",
      title: "Trusting in Yourself",
      fileSize: "163 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/cultivating-an-inner-smile.pdf",
      title: "Cultivating an Inner Smile",
      fileSize: "190 KB",
      flagged: true,
    },
  ],
  // "Understanding Your Self-Pity" and "Taking Care of Yourself" have no
  // dedicated posts — surface on the Self-Compassion hub.
  "the-power-of-self-compassion": [
    {
      pdfUrl: "/worksheets/understanding-your-self-pity.pdf",
      title: "Understanding Your Self-Pity",
      fileSize: "161 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/taking-care-of-yourself.pdf",
      title: "Taking Care of Yourself",
      fileSize: "167 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/letter-of-self-compassion.pdf",
      title: "Letter of Self-Compassion",
      fileSize: "173 KB",
      flagged: true,
    },
  ],
  // "Exploring Fear (Partner Exercise)" has no dedicated post — surface
  // alongside the anxiety/fear-themed worksheet on the affirmations-for-anxiety post.
  "affirmations-for-anxiety": [
    {
      pdfUrl: "/worksheets/exploring-fear-partner-exercise.pdf",
      title: "Exploring Fear — Partner Exercise",
      fileSize: "200 KB",
      flagged: true,
    },
  ],
  // "Mindful Parenting 101" has no dedicated post — surface on the
  // closest topical hub (Family Engagement).
  "family-engagement": [
    {
      pdfUrl: "/worksheets/mindful-parenting-101.pdf",
      title: "Mindful Parenting 101",
      fileSize: "171 KB",
      flagged: true,
    },
  ],
  // "Mother of All" has no dedicated post — surface on the kids-meditation hub.
  "how-to-teach-kids-to-meditate": [
    {
      pdfUrl: "/worksheets/mother-of-all.pdf",
      title: "Mother of All",
      fileSize: "162 KB",
      flagged: true,
    },
  ],
  // "Snow Globe Exercise for Kids" and "What's Your Weather Like Today (Kids)"
  // have no dedicated posts — surface on the kids mindfulness hub.
  "mindfulness-exercises-for-emotionally-disturbed-kids": [
    {
      pdfUrl: "/worksheets/snow-globe-exercise-for-kids.pdf",
      title: "Snow Globe Exercise for Kids",
      fileSize: "158 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/whats-your-weather-like-today-kids.pdf",
      title: "What's Your Weather Like Today? (Kids)",
      fileSize: "172 KB",
      flagged: true,
    },
  ],
  // "Finding Me" (longer ebook on identity & self) — surface on the
  // closest topical hub (Accepting Who You Are).
  "accepting-who-you-are": [
    {
      pdfUrl: "/worksheets/finding-me-by-mindfulness-exercises.pdf",
      title: "Finding Me",
      fileSize: "224 KB",
      flagged: true,
    },
  ],
  // "Loving-Kindness" (third LK worksheet variant) has no dedicated post —
  // surface alongside the primary Loving-Kindness Meditation worksheet.
  "loving-kindness-meditation": [
    {
      pdfUrl: "/worksheets/loving-kindness.pdf",
      title: "Loving-Kindness",
      fileSize: "197 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/loving-kindness-the-child-that-is-you.pdf",
      title: "Loving Kindness – The Child that is You",
      fileSize: "160 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/loving-kindness-affirmations.pdf",
      title: "Loving-Kindness Affirmations",
      fileSize: "194 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/loving-kindness-2.pdf",
      title: "Loving-Kindness",
      fileSize: "177 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/meeting-mindfulness-with-kindness.pdf",
      title: "Meeting Mindfulness With Kindness",
      fileSize: "190 KB",
      flagged: true,
    },
  ],
  // Companion guide & journal alongside the beginners ebook.
  "mindfulness-meditation-beginners-free-ebook": [
    {
      pdfUrl: "/worksheets/mindful-meditation-guide-and-journal.pdf",
      title: "Mindful Meditation Guide and Journal",
      fileSize: "332 KB",
    },
  ],
  // Third "Walking Meditation" variant — surface on the guided walking script.
  "walking-meditation-guided-script": [
    {
      pdfUrl: "/worksheets/walking-meditation-3.pdf",
      title: "Walking Meditation",
      fileSize: "330 KB",
      flagged: true,
    },
  ],
  // "Using RAIN" has no dedicated post — surface on the closest topical match
  // (staying with strong emotions).
  "staying-with-emotions": [
    {
      pdfUrl: "/worksheets/using-rain.pdf",
      title: "Using RAIN",
      fileSize: "205 KB",
      flagged: true,
    },
  ],
  // "Wicca Meditation" has no dedicated post — surface on the styles-of-sitting
  // hub as another tradition-specific meditation variant.
  "several-styles-sitting-meditation": [
    {
      pdfUrl: "/worksheets/wicca-meditation.pdf",
      title: "Wicca Meditation",
      fileSize: "198 KB",
      flagged: true,
    },
  ],
  // "Acceptance of our Circumstance" has no dedicated post — surface on the
  // closest topical match (acceptance meditation).
  "power-of-acceptance": [
    {
      pdfUrl: "/worksheets/acceptance-of-our-circumstance.pdf",
      title: "Acceptance of Our Circumstance",
      fileSize: "178 KB",
      flagged: true,
    },
  ],
  // "Acts of Kindness" has no dedicated post — surface on the mindful
  // compassion hub.
  "mindful-compassion": [
    {
      pdfUrl: "/worksheets/acts-of-kindness.pdf",
      title: "Acts of Kindness",
      fileSize: "175 KB",
      flagged: true,
    },
  ],
  // Second "Body Scan Meditation" variant — surface alongside the primary one.
  "body-scan-meditation": [
    {
      pdfUrl: "/worksheets/body-scan-meditation-2.pdf",
      title: "Body Scan Meditation",
      fileSize: "174 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/mindful-body-acceptance.pdf",
      title: "Mindful Body Acceptance",
      fileSize: "372 KB",
      flagged: true,
    },
  ],
  // Second "Breath Awareness Meditation" variant — surface alongside primary.
  "breath-awareness-meditation": [
    {
      pdfUrl: "/worksheets/breath-awareness-meditation-2.pdf",
      title: "Breath Awareness Meditation",
      fileSize: "173 KB",
      flagged: true,
    },
  ],
  // "Breathing Into Tension" has no dedicated post — surface on the closest
  // breath-for-stress meditation.
  "alleviate-stress-with-three-deep-breaths": [
    {
      pdfUrl: "/worksheets/breathing-into-tension.pdf",
      title: "Breathing Into Tension",
      fileSize: "177 KB",
      flagged: true,
    },
  ],
  // "Bringing Support and Peace to Pain" has no dedicated post — surface on
  // the mindfulness-of-physical-pain hub.
  "mindful-physical-pain": [
    {
      pdfUrl: "/worksheets/bringing-support-and-peace-to-pain.pdf",
      title: "Bringing Support and Peace to Pain",
      fileSize: "185 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/focusing-away-from-pain.pdf",
      title: "Focusing Away From Pain",
      fileSize: "219 KB",
      flagged: true,
    },
  ],
  // Second "Emotional Awareness Meditation" variant — surface alongside primary.
  "emotional-awareness-meditation": [
    {
      pdfUrl: "/worksheets/emotional-awareness-meditation-2.pdf",
      title: "Emotional Awareness Meditation",
      fileSize: "174 KB",
      flagged: true,
    },
  ],
  // "Favorite Things" has no dedicated post — surface alongside the closest
  // childlike-wonder/pleasantness worksheet.
  "here-and-now-pleasantness": [
    {
      pdfUrl: "/worksheets/favorite-things.pdf",
      title: "Favorite Things",
      fileSize: "204 KB",
      flagged: true,
    },
  ],
  // "Grounding" (shorter standalone variant) — surface alongside the
  // grounding-through-body-awareness worksheet.
  "grounding-through-body-awareness": [
    {
      pdfUrl: "/worksheets/grounding.pdf",
      title: "Grounding",
      fileSize: "173 KB",
      flagged: true,
    },
  ],
  // "Impermanence" worksheet — surface on the closest impermanence hub.
  "embrace-change-and-strengthen-gratitude-with-7-meditations-on-impermanence": [
    {
      pdfUrl: "/worksheets/impermanence.pdf",
      title: "Impermanence",
      fileSize: "170 KB",
      flagged: true,
    },
  ],
  // "Learning from Nature" + "Nature Gazing from Roots to Sky" surface
  // alongside the Nature Walks worksheet.
  "nature-walks": [
    {
      pdfUrl: "/worksheets/learning-from-nature.pdf",
      title: "Learning from Nature",
      fileSize: "188 KB",
      flagged: true,
    },
    {
      pdfUrl: "/worksheets/nature-gazing-from-roots-to-sky.pdf",
      title: "Nature Gazing from Roots to Sky",
      fileSize: "179 KB",
      flagged: true,
    },
  ],
  // "Mindful Walking" variant — surface alongside the primary walking-meditation.
  "walking-meditation": [
    {
      pdfUrl: "/worksheets/mindful-walking.pdf",
      title: "Mindful Walking",
      fileSize: "188 KB",
      flagged: true,
    },
  ],
  // "Mindfulness of Sounds" — surface on the closest sitting-meditation hub.
  "several-styles-sitting-meditation": [
    {
      pdfUrl: "/worksheets/mindfulness-of-sounds.pdf",
      title: "Mindfulness of Sounds",
      fileSize: "171 KB",
      flagged: true,
    },
  ],
  // "Monkey Mind Meditation" — surface alongside the anxiety-transformation hub.
  "transforming-anxiety": [
    {
      pdfUrl: "/worksheets/monkey-mind-meditation.pdf",
      title: "Monkey Mind Meditation",
      fileSize: "188 KB",
      flagged: true,
    },
  ],
  // "Mindfulness of Laughter" — surface alongside the cultivating-joy worksheet.
  "cultivating-joy": [
    {
      pdfUrl: "/worksheets/mindfulness-of-laughter.pdf",
      title: "Mindfulness of Laughter",
      fileSize: "177 KB",
      flagged: true,
    },
  ],
  // "Mindful Life Design" — values/intention reflection, surface alongside
  // the appraising-career-values reflective worksheet.
  "appraising-career-values": [
    {
      pdfUrl: "/worksheets/mindful-life-design.pdf",
      title: "Mindful Life Design",
      fileSize: "245 KB",
      flagged: true,
    },
  ],
};

export function getWorksheets(slug: string | undefined | null): WorksheetEntry[] {
  if (!slug) return [];
  const entries: WorksheetEntry[] = [];
  const single = WORKSHEETS[slug];
  if (single) entries.push(single);
  const bundle = WORKSHEET_BUNDLES[slug];
  if (bundle) entries.push(...bundle);
  return entries;
}
