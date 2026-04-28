# GTM → GA4 Setup Guide

**GTM container:** `GTM-PBS9B6HR` (installed in `index.html`)
**GA4 Measurement ID:** `G-D2YKGTLHKC` (also hardcoded in `index.html` as a standalone `gtag.js` install — see note in Step 1)
**Goal:** Forward every meaningful homepage interaction from our `dataLayer`
into GA4 as a custom event, with a small set marked as **conversions**.

> **Why this lives in GTM, not code:** every interaction this site cares about
> already pushes to `window.dataLayer` via `src/lib/analytics.ts`. No code
> changes are needed — we just translate those events into GA4 tags inside
> GTM. That means future tag changes (Meta Pixel, LinkedIn, etc.) also
> require zero code redeploys.

---

## Step 1 — Add the GA4 Configuration tag

> ⚠️ **Skip this step** if you keep the standalone `gtag.js` snippet in
> `index.html` (it already loads GA4 with `G-D2YKGTLHKC`). Adding a GA4
> Configuration tag in GTM with the same ID would double-count pageviews.
> If you remove the gtag snippet from `index.html` later, come back and
> do this step.

Tags → **New** → Tag Configuration → **Google Tag**

- **Tag ID:** `G-D2YKGTLHKC`
- **Trigger:** Initialization - All Pages
- Name it: `GA4 — Config`

Save. This loads GA4 once per page.

---

## Step 2 — Create the shared Data Layer Variables

Variables → **User-Defined Variables** → New → Data Layer Variable
(create one for each row below; Data Layer Variable Name = the value in
the "DLV name" column; Variable Name = same with `dlv.` prefix for clarity).

| DLV name             | Used by which events                                         |
|----------------------|--------------------------------------------------------------|
| `cta_label`          | cta_clicked                                                  |
| `cta_destination`    | cta_clicked, certification_cta_clicked                       |
| `cta_location`       | cta_clicked, certification_cta_clicked, homepage_cta_viewed  |
| `form_id`            | email_signup_*                                               |
| `track`              | email_signup_*, sticky_email_bar_*                           |
| `surface`            | email_signup_*, audio_*                                      |
| `source_path`        | sticky_email_bar_*, certification_cta_clicked                |
| `section`            | homepage_section_viewed                                      |
| `depth_percent`      | homepage_scroll_depth                                        |
| `src`                | audio_started, audio_completed                               |
| `completion_trigger` | audio_completed                                              |
| `video_provider`     | video_play_clicked                                           |
| `video_id`           | video_play_clicked                                           |
| `video_title`        | video_play_clicked                                           |
| `video_location`     | video_play_clicked                                           |
| `episode_id`         | buzzsprout_embed_*                                           |
| `podcast_id`         | buzzsprout_embed_*                                           |
| `post_slug`          | buzzsprout_embed_*                                           |

---

## Step 3 — Create the Custom Event Triggers

Triggers → **New** → Trigger Configuration → **Custom Event** for each:

| Trigger name                            | Event name (exact match)            |
|-----------------------------------------|-------------------------------------|
| CE — cta_clicked                        | `cta_clicked`                       |
| CE — certification_cta_clicked          | `certification_cta_clicked`         |
| CE — email_signup_submitted             | `email_signup_submitted`            |
| CE — email_signup_succeeded             | `email_signup_succeeded`            |
| CE — email_signup_failed                | `email_signup_failed`               |
| CE — sticky_email_bar_viewed            | `sticky_email_bar_viewed`           |
| CE — sticky_email_bar_dismissed         | `sticky_email_bar_dismissed`        |
| CE — homepage_scroll_depth              | `homepage_scroll_depth`             |
| CE — homepage_section_viewed            | `homepage_section_viewed`           |
| CE — homepage_cta_viewed                | `homepage_cta_viewed`               |
| CE — audio_started                      | `audio_started`                     |
| CE — audio_completed                    | `audio_completed`                   |
| CE — video_play_clicked                 | `video_play_clicked`                |
| CE — buzzsprout_play_intent             | `buzzsprout_embed_play_intent`      |

Each trigger fires on **All Custom Events** matching its event name.

---

## Step 4 — Create the GA4 Event Tags

Tags → **New** → Tag Configuration → **Google Analytics: GA4 Event** for each.
For every tag set:
- **Configuration Tag:** `GA4 — Config`
- **Event Name:** see table below
- **Event Parameters:** see table below
- **Trigger:** the matching CE trigger from Step 3

| Tag name                       | Event Name                  | Event Parameters                                                                 |
|--------------------------------|-----------------------------|----------------------------------------------------------------------------------|
| GA4 — CTA Click                | `cta_click`                 | `cta_label={{dlv.cta_label}}`, `cta_destination={{dlv.cta_destination}}`, `cta_location={{dlv.cta_location}}` |
| GA4 — Certification CTA        | `certification_cta_click`   | `cta_destination={{dlv.cta_destination}}`, `cta_location={{dlv.cta_location}}`, `source_path={{dlv.source_path}}` |
| GA4 — Email Signup Start       | `email_signup_start`        | `form_id={{dlv.form_id}}`, `track={{dlv.track}}`, `surface={{dlv.surface}}`      |
| GA4 — Email Signup Complete    | `email_signup_complete`     | `form_id={{dlv.form_id}}`, `track={{dlv.track}}`, `surface={{dlv.surface}}`      |
| GA4 — Email Signup Failed      | `email_signup_failed`       | `form_id={{dlv.form_id}}`, `track={{dlv.track}}`, `surface={{dlv.surface}}`      |
| GA4 — Sticky Bar Viewed        | `sticky_bar_view`           | `track={{dlv.track}}`, `source_path={{dlv.source_path}}`                         |
| GA4 — Sticky Bar Dismissed     | `sticky_bar_dismiss`        | `track={{dlv.track}}`, `source_path={{dlv.source_path}}`                         |
| GA4 — Scroll Depth             | `scroll_depth`              | `depth_percent={{dlv.depth_percent}}`                                            |
| GA4 — Section Viewed           | `section_view`              | `section={{dlv.section}}`                                                        |
| GA4 — Hero CTA Viewed          | `cta_view`                  | `cta_location={{dlv.cta_location}}`                                              |
| GA4 — Audio Started            | `audio_start`               | `audio_src={{dlv.src}}`, `surface={{dlv.surface}}`                               |
| GA4 — Audio Completed          | `audio_complete`            | `audio_src={{dlv.src}}`, `surface={{dlv.surface}}`, `completion_trigger={{dlv.completion_trigger}}` |
| GA4 — Video Play Clicked       | `video_play`                | `video_provider={{dlv.video_provider}}`, `video_id={{dlv.video_id}}`, `video_title={{dlv.video_title}}`, `video_location={{dlv.video_location}}` |
| GA4 — Podcast Play Intent      | `podcast_play_intent`       | `episode_id={{dlv.episode_id}}`, `podcast_id={{dlv.podcast_id}}`, `post_slug={{dlv.post_slug}}` |

---

## Step 5 — Mark conversions in GA4

In **GA4 → Admin → Events → Mark as conversion**, toggle these on:

| Event                       | Why it's a conversion                              |
|-----------------------------|----------------------------------------------------|
| `email_signup_complete`     | Lead captured (ebook, sticky, inline)              |
| `certification_cta_click`   | Highest-value funnel — outbound to certify domain  |
| `cta_click`                 | Optional. If on, also create an audience filtered to `cta_destination` containing `/library` for "engaged free-resource users" |
| `audio_complete`            | Optional — strong engagement signal                |
| `podcast_play_intent`       | Optional — podcast funnel attribution              |

---

## Step 6 — Register custom dimensions

GA4 → **Admin → Custom definitions → Custom dimensions** → Create dimension
for every parameter you want to slice by in reports. Recommended minimum:

| Dimension name        | Scope | Event parameter   |
|-----------------------|-------|-------------------|
| CTA Label             | Event | `cta_label`       |
| CTA Destination       | Event | `cta_destination` |
| CTA Location          | Event | `cta_location`    |
| Form ID               | Event | `form_id`         |
| Signup Track          | Event | `track`           |
| Signup Surface        | Event | `surface`         |
| Source Path           | Event | `source_path`     |
| Section               | Event | `section`         |
| Audio Source          | Event | `audio_src`       |
| Video Title           | Event | `video_title`     |

Without these, GA4 records the params but won't expose them in reports.

---

## Step 7 — Verify with Preview Mode

1. GTM → **Preview** → enter `https://mindfulnessexercises.com` (or current
   preview URL)
2. On the homepage, click **"Get the free ebook"** in the hero, scroll
   ~50%, click a category card, click the certification CTA, and submit
   an email
3. In the Tag Assistant pane, confirm each GA4 tag fires once per
   interaction
4. In **GA4 → Reports → Realtime**, confirm the event names appear with
   the right parameter values

When everything looks right → **Submit** → name the version
"GA4 homepage event tracking v1" → Publish.

---

## Maintenance

Whenever a new event is added to `REQUIRED_PROPS` in
`src/lib/analytics.ts`, add a matching CE trigger + GA4 Event tag here.
Keep this doc and `docs/analytics-taxonomy.md` in sync.
