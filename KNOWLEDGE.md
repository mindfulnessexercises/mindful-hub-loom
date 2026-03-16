# Mindfulness Exercises — Homepage Redesign Brief

## Brand Identity

- **Brand name:** Mindfulness Exercises
- **Core brand promise:** The world's largest mindfulness library and professional training platform
- **Brand personality:** Calm, premium, modern, credible, deeply human — balancing emotional warmth with professional authority

## Audiences

### Primary Audiences
1. **Professionals seeking certification** — therapists, counselors, coaches, educators, wellness professionals wanting CE credits and credentials
2. **Individual practitioners** — people searching for free mindfulness exercises, meditations, and practices

### Secondary Audiences
3. **Organizations** — companies, schools, healthcare systems seeking mindfulness offerings for their teams
4. **Returning community members** — email subscribers, past event attendees, existing users

### Jobs-to-Be-Done by Audience

| Audience | JTBD |
|---|---|
| Certification seekers | "I need a credible, accredited mindfulness certification to advance my career" |
| Individual practitioners | "I want free, high-quality mindfulness exercises I can start right now" |
| Organizations | "I need a trusted partner to bring mindfulness to my team/school/clinic" |
| Returning members | "I want to find my next event, course, or continue my practice" |

## Business Goals of the Homepage

1. **Increase clicks into certification programs** (primary revenue driver)
2. Increase email signups via free ebook lead magnet
3. Increase clicks into free resources (SEO-driven top-of-funnel)
4. Increase live event registrations
5. Improve trust and clarity within the first screen
6. Improve engagement depth (pages per session, scroll depth)

## Conversion Hierarchy

| Priority | Conversion | Mechanism |
|---|---|---|
| **Primary** | Explore certification programs | Hero CTA + dedicated section with 2-3 programs |
| **Secondary** | Email signup | Free ebook offer — popup or inline CTA |
| **Tertiary** | Browse free resources | Section with curated exercises + search path |
| **Quaternary** | Register for live event | Secondary section with upcoming events |

## Key Trust Signals & Proof Assets

All four categories available:
- **Library/community stats:** e.g., "3,000+ exercises, 200+ teachers, 2M+ practitioners"
- **Accreditation / CE credits:** Recognized continuing education approvals
- **Testimonials:** Quotes from professionals and practitioners
- **Media / partner logos:** Notable partnerships and press mentions

**Strategy:** Use a compact trust bar near the hero (stats + logos), then deeper testimonials and accreditation proof further down the page.

## Offer Hierarchy

1. **Hero:** Clear brand promise + primary CTA to certification
2. **Audience router:** "I'm here for..." pathways (personal practice vs. professional training)
3. **Certification spotlight:** 2-3 key programs with clear differentiation
4. **Free resources preview:** Curated exercises to serve SEO traffic and demonstrate value
5. **Lead magnet CTA:** Free ebook email capture
6. **Live events:** Upcoming events section (secondary placement)
7. **Social proof:** Testimonials + accreditation badges + partner logos
8. **Final CTA:** Certification or email signup reinforcement

## Homepage Information Architecture

```
[Navigation Bar]
  Logo | Free Resources | Training & Certification | Live Events | About | Login | CTA Button

[Hero Section]
  Headline: Brand promise (scale + authority)
  Subheadline: Bridge to certification or free practice
  Primary CTA: Explore Certification Programs
  Secondary CTA: Browse Free Exercises
  Trust bar: Key stats + accreditation badges

[Audience Router]
  Two clear paths:
  - "Start your personal practice" → free resources
  - "Advance your professional career" → certification

[Certification Spotlight]
  2-3 featured programs
  Each with: title, audience, CE credits, CTA
  Professional photography of teachers

[Free Resources Preview]
  Curated grid of popular exercises
  Search/filter hint
  CTA: Explore full library

[Lead Magnet / Email Capture]
  Free ebook offer
  Inline form with compelling copy

[Live Events]
  Next 2-3 upcoming events
  Date, title, format (live/virtual)
  CTA: View all events

[Social Proof]
  Testimonial carousel (professionals)
  Partner/media logos
  Accreditation badges

[Final CTA]
  Reinforcement of primary conversion
  "Ready to get certified?" or email signup

[Footer]
  Navigation links, social, legal
```

## Design System Guidance

### Visual Direction: Serene & Elevated
- **Palette:** Muted, sophisticated — think warm neutrals, deep sage/forest, soft cream, with a refined accent color (not purple)
- **Typography:** Distinctive serif or elegant sans-serif for headlines; clean sans-serif for body. Avoid Inter, Poppins, generic defaults
- **Photography:** Extensive professional library available — use real photos of teachers, events, community. No stock clichés
- **Whitespace:** Generous, intentional negative space — luxury-adjacent feel
- **Motion:** Subtle, purposeful — gentle fade-ins, parallax hints. No gratuitous animation
- **Texture:** Fine details — subtle gradients, soft shadows, layered depth without clutter
- **Layout:** Clean grid with moments of asymmetry; editorial confidence

### Design Inspirations
- **IDEO U / General Assembly:** Professional training credibility, clean program cards
- **Masterclass / Coursera:** Premium education feel, instructor-led imagery, clear program CTAs

### Guardrails — What This Homepage Must NOT Look Like
- ❌ Generic SaaS template (gradient blobs, floating mockups)
- ❌ Cliché "spa" website (lavender fields, lotus flowers, water droplets)
- ❌ Cluttered proof wall with no routing logic
- ❌ Purple gradients on white
- ❌ Stock photo meditation poses
- ❌ Overly busy with competing CTAs
- ❌ Dark mode by default (serene & light)

## Copywriting Tone

- **Voice:** Warm but authoritative. Knowledgeable guide, not salesperson
- **Register:** Professional yet approachable — speaks to therapists and beginners alike
- **Headlines:** Clear, benefit-driven, concise. No fluff, no jargon
- **CTAs:** Action-oriented, low-pressure. "Explore programs" not "Buy now"
- **Proof language:** Specific numbers over vague claims

## SEO Strategy for Homepage

- **Primary keyword target:** "mindfulness exercises" (defend brand + category term)
- **Secondary targets:** "mindfulness certification," "mindfulness training," "free mindfulness exercises"
- **H1:** Include "mindfulness exercises" naturally
- **Meta title:** < 60 chars with primary keyword
- **Meta description:** < 160 chars, benefit-driven, with CTA
- **Schema markup:** Organization, Course (for certifications), Event (for live events)
- **Internal linking:** Hero and sections link to key category pages
- **Content signals:** Real text content (not just images), semantic HTML

## Engagement Strategy

- Audience router reduces bounce by matching intent immediately
- Free resource preview hooks SEO visitors into exploring
- Lead magnet captures visitors not ready to buy
- Live events create urgency and community feel
- Testimonials from relatable professionals build identification
- Clear navigation prevents "where do I go?" abandonment

## Mobile Requirements

- Mobile-first responsive design
- Sticky CTA on mobile (certification or email)
- Collapsible audience router for small screens
- Touch-friendly program cards
- Fast load — lazy load images below fold
- Navigation collapses to hamburger menu

## Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- Sufficient color contrast ratios (4.5:1 text, 3:1 large text)
- Semantic HTML (proper heading hierarchy, landmarks)
- Alt text on all images
- Keyboard navigable
- Focus indicators visible
- Reduced motion support (`prefers-reduced-motion`)

## Analytics Event Requirements

| Event | Trigger |
|---|---|
| `hero_cta_click` | Click on primary or secondary hero CTA |
| `audience_path_select` | Click on audience router option |
| `certification_card_click` | Click on any certification program card |
| `free_resource_click` | Click on any free resource item |
| `email_signup_submit` | Email form submission |
| `live_event_click` | Click on any live event |
| `testimonial_view` | Testimonial section enters viewport |
| `scroll_depth` | 25%, 50%, 75%, 100% scroll milestones |
| `nav_click` | Any navigation item click |

## Lead Magnet Details

- **Type:** Free ebook (user will provide the actual asset)
- **Delivery:** Email capture form → deliver via email or instant download
- **Placement:** Dedicated section mid-page + potential exit-intent or scroll-triggered prompt
