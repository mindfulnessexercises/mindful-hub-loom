import { Heart, Leaf, Sparkles } from "lucide-react";

interface Props {
  title: string;
}

/**
 * Value-add reflection block rendered beneath each worksheet PDF.
 * Copy is generated from the worksheet title using gentle, topic-aware
 * language. Tone follows the brand: serene, elevated, no SaaS clichés.
 *
 * The block always answers four implicit questions:
 *   1. Why this matters (a one-line orientation).
 *   2. How mindfulness can help with this specific topic.
 *   3. A few gentle steps the reader can try today.
 *   4. A closing note inviting care, patience, and presence.
 */
export function WorksheetMindfulGuidance({ title }: Props) {
  const guidance = buildGuidance(title);

  return (
    <section
      aria-label={`Mindful guidance for ${title}`}
      className="mt-6 rounded-lg border border-border/60 bg-muted/30 p-6 sm:p-8"
    >
      <p className="text-eyebrow text-primary mb-3 inline-flex items-center gap-1.5">
        <Leaf className="h-3.5 w-3.5" aria-hidden /> A mindful companion to this worksheet
      </p>

      <h3 className="text-card-heading text-foreground mb-3">
        {guidance.heading}
      </h3>

      <p className="text-body text-muted-foreground mb-5 leading-relaxed">
        {guidance.intro}
      </p>

      <h4 className="text-eyebrow text-foreground mb-3 inline-flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" aria-hidden /> How mindfulness can help
      </h4>
      <p className="text-body text-muted-foreground mb-5 leading-relaxed">
        {guidance.howItHelps}
      </p>

      <h4 className="text-eyebrow text-foreground mb-3">Gentle steps to try</h4>
      <ol className="space-y-3 mb-5">
        {guidance.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-body text-muted-foreground leading-relaxed">
            <span
              className="flex-none mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold"
              aria-hidden
            >
              {i + 1}
            </span>
            <span>
              <span className="text-foreground font-medium">{step.label}.</span>{" "}
              {step.body}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex items-start gap-3 rounded-md bg-background/60 border border-border/40 p-4">
        <Heart className="h-4 w-4 text-primary mt-0.5 flex-none" aria-hidden />
        <p className="text-body-sm text-muted-foreground italic leading-relaxed">
          {guidance.care}
        </p>
      </div>
    </section>
  );
}

interface Guidance {
  heading: string;
  intro: string;
  howItHelps: string;
  steps: { label: string; body: string }[];
  care: string;
}

/**
 * Derive a topic-aware guidance block from the worksheet title.
 * Uses keyword heuristics rather than a hand-curated map so every
 * worksheet — present and future — receives meaningful supporting copy.
 */
function buildGuidance(rawTitle: string): Guidance {
  const title = rawTitle.trim();
  const lower = title.toLowerCase();
  const topic = pickTopic(lower);
  const themed = THEMES[topic];

  return {
    heading: themed.heading(title),
    intro: themed.intro(title),
    howItHelps: themed.howItHelps(title),
    steps: themed.steps,
    care: themed.care,
  };
}

type Topic =
  | "communication"
  | "relationships"
  | "emotions"
  | "anxiety_stress"
  | "thoughts_beliefs"
  | "self_compassion"
  | "values_purpose"
  | "habits_intention"
  | "presence_awareness"
  | "decisions_clarity"
  | "boredom_avoidance"
  | "default";

function pickTopic(t: string): Topic {
  if (/(speak|speech|say|listen|conversation|communicat|request|advoc)/.test(t)) return "communication";
  if (/(relationship|partner|marriage|dating|family|romantic|friend|connect)/.test(t)) return "relationships";
  if (/(emotion|feeling|anger|grief|sad|joy|mood)/.test(t)) return "emotions";
  if (/(stress|anxious|anxiety|fear|overwhelm|nurturing|defeats)/.test(t)) return "anxiety_stress";
  if (/(thought|belief|story|judg|critic|narrative|question)/.test(t)) return "thoughts_beliefs";
  if (/(compassion|self-?esteem|kindness|forgive|self-love)/.test(t)) return "self_compassion";
  if (/(value|purpose|meaning|important|authentic|identity)/.test(t)) return "values_purpose";
  if (/(intention|habit|stop|change|pattern|autopilot|shap)/.test(t)) return "habits_intention";
  if (/(awareness|presence|notic|attention|sens|breath|insight)/.test(t)) return "presence_awareness";
  if (/(decision|choice|consequence|today|invest|priorit)/.test(t)) return "decisions_clarity";
  if (/(boredom|avoid|distraction|resist|procrast)/.test(t)) return "boredom_avoidance";
  return "default";
}

const THEMES: Record<Topic, {
  heading: (t: string) => string;
  intro: (t: string) => string;
  howItHelps: (t: string) => string;
  steps: { label: string; body: string }[];
  care: string;
}> = {
  communication: {
    heading: (t) => `Bringing mindful presence to ${t.toLowerCase()}`,
    intro: (t) =>
      `Words shape the inner weather of every relationship we tend to. Working through “${t}” is an invitation to slow the gap between what arises in you and what you offer to another — and to notice the quality of attention you bring when you speak or listen.`,
    howItHelps: () =>
      "Mindfulness softens the reactive edge of speech. By pausing to feel the body, the breath, and the underlying intention before words leave your mouth, you create space for clarity, kindness, and accuracy. Listening, too, becomes more spacious — less rehearsing a reply, more receiving the person in front of you.",
    steps: [
      { label: "Pause at the threshold", body: "Before responding, take one full breath. Let the in-breath arrive completely before any words form." },
      { label: "Name the intention", body: "Silently ask yourself, “What do I most want this exchange to nurture?” Let that answer guide your tone." },
      { label: "Speak the truth, gently", body: "Choose words that are honest, useful, and kind. If only two of the three are present, consider waiting." },
      { label: "Listen as the receiver", body: "When the other person speaks, soften your gaze and feel your feet. Notice the urge to interrupt, and let it pass." },
    ],
    care:
      "There is no perfect conversation — only this one, met with as much presence as you can offer. Be gentle with the moments you wish you had handled differently; they are also part of the practice.",
  },
  relationships: {
    heading: (t) => `Tending the relational field around ${t.toLowerCase()}`,
    intro: (t) =>
      `Relationships are living systems — they breathe, they shift, they ask things of us we did not expect. “${t}” invites you to notice the patterns you carry into connection, and the patterns you'd like to soften or strengthen.`,
    howItHelps: () =>
      "Mindfulness grants us the rare ability to witness our own reactions in real time — the contraction in the chest, the story forming in the mind, the impulse to defend or withdraw. From that ground of awareness, we can choose response over reflex, and offer those we love a steadier presence.",
    steps: [
      { label: "Anchor in the body", body: "Before a difficult interaction, place a hand on your chest or belly. Feel three breaths move beneath your palm." },
      { label: "Notice your story", body: "Catch the narrative you are telling yourself about the other person. Ask: is this fact, or interpretation?" },
      { label: "Offer one act of attention", body: "Look at someone you love today as if you were meeting them for the first time. Notice what changes." },
      { label: "Honor the boundary", body: "Care for the relationship and care for yourself are not opposites. Boundaries spoken with kindness deepen, not damage, connection." },
    ],
    care:
      "Every relationship will have seasons of closeness and seasons of strain. Meeting both with curiosity — rather than verdict — keeps the door of possibility open.",
  },
  emotions: {
    heading: (t) => `Meeting feelings with mindful presence`,
    intro: (t) =>
      `Emotions are messengers, not problems to solve. “${t}” is an opportunity to develop a kinder relationship with the full range of your inner life — the easy feelings and the difficult ones.`,
    howItHelps: () =>
      "Mindfulness teaches us to stay near our feelings without becoming overwhelmed by them. By turning toward what we feel — naming it, locating it in the body, breathing alongside it — emotion becomes information rather than instruction. We learn to hold our experience, rather than be held hostage by it.",
    steps: [
      { label: "Name what is here", body: "Quietly say to yourself, “This is sadness,” or “This is anger.” Naming brings the prefrontal cortex online and softens reactivity." },
      { label: "Locate it in the body", body: "Where do you feel this emotion most clearly? The throat, the chest, the belly? Rest your attention there with kindness." },
      { label: "Breathe alongside it", body: "Imagine your breath flowing into and around the sensation, neither pushing it away nor pulling it closer." },
      { label: "Ask what it needs", body: "Many feelings simply want to be witnessed. Some carry a request — for rest, for boundary, for repair. Listen." },
    ],
    care:
      "Feelings are not flaws. They are weather moving through the open sky of your awareness. Trust that no emotion, however intense, is the whole of who you are.",
  },
  anxiety_stress: {
    heading: () => `Steadying the nervous system with mindfulness`,
    intro: (t) =>
      `When the body is braced against the world, the mind narrows and possibility shrinks. “${t}” is a doorway into noticing what overwhelms you, what restores you, and how to meet difficulty without abandoning yourself.`,
    howItHelps: () =>
      "Mindfulness regulates the nervous system through the simple, repeated act of returning attention to the present moment. By sensing the breath, the feet, the soundscape around you, the body remembers it is safe enough — right here, right now — to soften.",
    steps: [
      { label: "Lengthen the exhale", body: "Breathe in for four counts, out for six. Repeat for a minute. The longer exhale signals safety to the vagus nerve." },
      { label: "Feel the ground", body: "Press your feet firmly into the floor. Sense the support that has been there all along." },
      { label: "Name three things", body: "Three things you can see, three you can hear, three you can feel. Let your senses lead you out of the spiral of thought." },
      { label: "Choose one nourishing act", body: "A glass of water, a slow walk, a kind text to a friend. Small acts of care compound into resilience." },
    ],
    care:
      "Resilience is not built by pushing through, but by returning gently — again and again — to what restores you. The breath is always waiting.",
  },
  thoughts_beliefs: {
    heading: () => `Working skillfully with thought`,
    intro: (t) =>
      `Thoughts arise on their own, but the ones we believe become the architecture of our lives. “${t}” is a chance to notice which stories you have been carrying — and to question whether they still serve you.`,
    howItHelps: () =>
      "Mindfulness reveals thoughts as events in awareness, rather than facts about reality. By stepping back to observe a thought without immediately believing it, we recover a quiet authority over our inner life. We choose which voices to listen to, and which to thank and release.",
    steps: [
      { label: "Catch the thought", body: "When a familiar story appears, silently note, “Thinking,” and watch it the way you might watch a cloud." },
      { label: "Investigate it", body: "Ask: is this absolutely true? What do I know directly, without the commentary?" },
      { label: "Soften the grip", body: "Try saying, “A thought is arising that says…” instead of “I think…”. Notice the spaciousness this creates." },
      { label: "Choose where to invest attention", body: "You cannot control what arises, but you can choose what you nourish with your continued attention." },
    ],
    care:
      "You are not your thoughts. You are the awareness in which they appear, stay a while, and dissolve. Trust that quieter knowing.",
  },
  self_compassion: {
    heading: () => `Turning toward yourself with kindness`,
    intro: (t) =>
      `Most of us are far harder on ourselves than we would ever be on someone we love. “${t}” is an invitation to extend, in your own direction, the same warmth you so easily offer others.`,
    howItHelps: () =>
      "Mindful self-compassion has three movements: noticing that this is a moment of suffering, remembering that suffering is part of the shared human experience, and offering yourself a gesture of care. Together, they transform self-criticism into self-friendship.",
    steps: [
      { label: "Acknowledge the moment", body: "Say to yourself, “This is hard right now.” Let the sentence land without rushing past it." },
      { label: "Place a hand where it helps", body: "On your heart, your cheek, your forearm — the simple weight of touch is a powerful signal of care." },
      { label: "Offer kind words", body: "Try, “May I be gentle with myself,” or speak to yourself as you would to a dear friend in the same situation." },
      { label: "Let the moment pass", body: "Self-compassion is not a fix; it is a way of accompanying yourself through what is difficult." },
    ],
    care:
      "You are allowed to be a beginner at being kind to yourself. Each moment of remembering counts, even — especially — the small ones.",
  },
  values_purpose: {
    heading: () => `Living closer to what matters`,
    intro: (t) =>
      `Values are the quiet compass beneath the noise of daily life. “${t}” asks you to listen for what you most want your life to express, and to notice where your hours and your values are quietly out of alignment.`,
    howItHelps: () =>
      "Mindfulness creates the inner stillness in which values become audible. When the wind of distraction settles, the deeper preferences of the heart can be heard. Practice helps us not only know our values, but live in closer relationship with them.",
    steps: [
      { label: "Imagine the long view", body: "Picture yourself ten years from now, looking back on this season. What would you hope was true about how you spent it?" },
      { label: "Choose three words", body: "Pick three words that name what you most want to embody. Write them somewhere you'll see them daily." },
      { label: "Audit one choice", body: "Look at one decision on your plate this week. Which option moves you toward your three words?" },
      { label: "Forgive the gap", body: "Notice the gap between values and behavior with curiosity, not judgment. The noticing itself is the practice." },
    ],
    care:
      "A meaningful life is built one small alignment at a time. The point is not to live perfectly by your values, but to keep returning to them.",
  },
  habits_intention: {
    heading: () => `Setting intention, gently shaping habit`,
    intro: (t) =>
      `Most of life runs on autopilot, and most of that autopilot was set down without our conscious consent. “${t}” is a chance to notice the patterns you have inherited, and to set a new intention with care.`,
    howItHelps: () =>
      "Mindfulness illuminates the gap between stimulus and response — the very space in which a new pattern can be chosen. By bringing curious attention to a habit's full arc — the cue, the urge, the action, the aftermath — we regain freedom where there was once only repetition.",
    steps: [
      { label: "Set a clear intention", body: "Name what you would like to cultivate or release in plain language. Write it down. Read it aloud each morning." },
      { label: "Watch the cue", body: "When the urge arises, pause and notice: what just happened in my body, environment, or mood?" },
      { label: "Insert a small choice", body: "Replace the old action with one breath, one stretch, one glass of water. Tiny replacements rewire the pattern." },
      { label: "Celebrate the noticing", body: "Even when the old habit wins, the fact that you noticed is real progress. Awareness is the seed of every change." },
    ],
    care:
      "Change rarely arrives in a single dramatic decision. It is the quiet accumulation of intentions remembered, again and again, with patience.",
  },
  presence_awareness: {
    heading: () => `Returning to the present`,
    intro: (t) =>
      `Awareness is the ground of every other practice. “${t}” is an invitation to come back — out of the past, out of the future — and meet your life as it is actually unfolding.`,
    howItHelps: () =>
      "Mindfulness is, in essence, the deliberate practice of returning. We are not trying to silence the mind, only to notice when attention has wandered and to bring it home — to the breath, the body, the sensations of this moment. Each return is the practice.",
    steps: [
      { label: "Anchor in one sense", body: "Choose one sense — sound, sensation, sight — and rest your attention there for a slow minute." },
      { label: "Notice the wandering", body: "When the mind drifts, simply note, “Thinking,” and gently lead it back. There is no failure in noticing." },
      { label: "Soften the doer", body: "You don't have to make anything happen. Awareness is already here. Let yourself rest in it." },
      { label: "Let practice spill over", body: "Bring the same quality of attention to washing a dish, walking to the door, or greeting another person." },
    ],
    care:
      "The present moment is the only place life is happening. The good news is that it is always available, and it always welcomes you back.",
  },
  decisions_clarity: {
    heading: () => `Choosing from a quiet center`,
    intro: (t) =>
      `Decisions made from anxiety are rarely the ones we celebrate later. “${t}” asks you to pause long enough to know — beneath the noise of urgency — what is actually being asked of you.`,
    howItHelps: () =>
      "Mindfulness slows the metabolism of choice. By dropping out of the head and into the felt sense of the body, we access a wisdom that thinking alone cannot reach. We notice which option feels like contraction and which feels like spaciousness — and that distinction is rarely wrong.",
    steps: [
      { label: "Sit with the question", body: "Name the decision clearly. Then breathe with it for a minute, asking nothing of yourself." },
      { label: "Sense the body's vote", body: "Imagine choosing option A. Feel your body's response. Now option B. The body often knows before the mind catches up." },
      { label: "Consult your future self", body: "Picture yourself a year from now. Which choice would they thank you for making today?" },
      { label: "Decide, then release", body: "Make the choice, take the next small action, and let go of needing certainty. Clarity often arrives mid-step." },
    ],
    care:
      "Few decisions are truly final, and most are reversible. Trust yourself to navigate what comes — you have done it before.",
  },
  boredom_avoidance: {
    heading: () => `Befriending what we usually flee`,
    intro: (t) =>
      `Boredom, restlessness, and avoidance are often messengers we have learned to silence too quickly. “${t}” is a chance to turn toward these states, with curiosity rather than escape, and discover what they actually contain.`,
    howItHelps: () =>
      "Mindfulness reveals that boredom is rarely the absence of stimulation — it is often the presence of an unmet feeling we are unwilling to feel. By staying with the discomfort instead of reaching for distraction, we recover a quieter, deeper aliveness that no scroll can replicate.",
    steps: [
      { label: "Notice the urge to escape", body: "When the impulse arises to grab the phone or snack, pause for ten seconds. Just feel the urge in the body." },
      { label: "Locate the underlying feeling", body: "Beneath the boredom, what is here? Loneliness? Grief? Tiredness? Name it gently." },
      { label: "Stay a moment longer", body: "You don't have to fix the feeling — only keep it company. Curiosity is enough." },
      { label: "Choose, rather than react", body: "If you still want the distraction, take it consciously. The choosing changes everything." },
    ],
    care:
      "There is nothing wrong with you for feeling restless. It is one of the most ordinary doors into deeper presence — if we are willing to stand at the threshold.",
  },
  default: {
    heading: (t) => `A mindful approach to ${t.toLowerCase()}`,
    intro: (t) =>
      `“${t}” is an invitation to slow down and meet your experience with curiosity, honesty, and kindness — three qualities that quietly transform everything they touch.`,
    howItHelps: () =>
      "Mindfulness offers a steady inner ground from which to engage any topic. Instead of being swept along by reaction, we learn to notice what is here — sensations, thoughts, feelings — and respond from a place of presence rather than pressure.",
    steps: [
      { label: "Begin with the breath", body: "Take three slow breaths before opening the worksheet. Let your body remember it is here." },
      { label: "Read with curiosity", body: "Move through each prompt slowly. Notice which questions soften you, and which ones tighten you." },
      { label: "Write what is true now", body: "There are no right answers — only honest ones. The truth at this moment is what the worksheet is asking for." },
      { label: "Close with one breath", body: "When you finish, pause. Place a hand on your heart and acknowledge yourself for showing up." },
    ],
    care:
      "Insight does not arrive on a schedule. Trust the practice of returning, the courage of honesty, and the slow unfolding of your own becoming.",
  },
};
