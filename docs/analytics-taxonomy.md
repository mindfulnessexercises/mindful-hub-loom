# Analytics Event Taxonomy

This document is the source of truth for every analytics event the app fires
through `trackEvent` / `trackCtaClick` in `src/lib/analytics.ts`. Every event
goes to:

1. The Lovable Cloud `analytics_events` table (powers `/admin/analytics`)
2. `window.dataLayer` for GTM/GA4 (if loaded)
3. `window.plausible` (if loaded)
4. `window.posthog` (if loaded)
5. `console.debug` in dev only

Naming convention:
- **Event names**: `snake_case`, past tense (`cta_clicked`, not `click_cta`).
- **Property keys**: `snake_case` so they map cleanly to GA4 custom params and
  Plausible/PostHog property tables.
- **`undefined` values are stripped** before send (providers prefer omitted keys).
- All payload values must be `string | number | boolean | null`.

Validation: the runtime validator in `analytics.ts` enforces required props
for any event listed in `REQUIRED_PROPS` below. Missing required props log a
`console.warn` in dev/prod (the event is still sent, with a `_validation_failed`
flag added, so you can spot bad data in the dashboard).

---

## Conversion events

### `cta_clicked`
Fired whenever a tracked CTA is clicked. The single canonical event for click
attribution — do not invent per-CTA event names.

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `cta_label` | string | ✅ | Visible button text. |
| `cta_destination` | string | ✅ | href / route the click goes to. |
| `cta_location` | string | ✅ | Where the CTA sits, e.g. `library_post_card`, `homepage_hero`. |
| `post_id` | number | conditional | Required when location is a post card. |
| `page_id` | number | conditional | Required when location is a page card. |
| `category_id` | number | optional | Set when CTA was produced by a category rule. |
| `category_slug` | string | optional | Set alongside `category_id`. |
| `matched` | boolean | optional | `true` if a rule matched, `false` for default fallback. |
| `match_source` | `"category" \| "title" \| "default"` | optional | Which rule produced the CTA. |
| `attributed_to_podcast` | boolean | auto | `true` when the click is credited to an earlier Buzzsprout play in the same tab session. |
| `podcast_play_episode_id` | string | auto | Buzzsprout episode id of the most recent play. |
| `podcast_play_podcast_id` | string | auto | Buzzsprout podcast id. |
| `podcast_play_post_slug` | string | auto | WordPress slug of the episode post. |
| `podcast_play_source_path` | string | auto | Pathname where the play happened (e.g. `/podcast-episodes/<slug>`). |
| `podcast_play_occurred_at` | string (ISO) | auto | Timestamp of the play. |
| `podcast_play_age_seconds` | number | auto | Seconds between play and CTA click — bucket "immediate" vs "delayed". |

> **Podcast attribution model.** A Buzzsprout `play_intent` is recorded in
> `sessionStorage` and credits **every subsequent** `cta_clicked` in that tab
> until the tab closes. Most recent play wins. No time cap by design — filter
> on `podcast_play_age_seconds` to bucket conversions.


### `email_signup_submitted`
| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `form_id` | string | ✅ | Stable identifier of the form (e.g. `homepage_ebook`). |
| `email_domain` | string | optional | Lowercased domain, e.g. `gmail.com` — never the full address. |

### `email_signup_succeeded`
Same shape as `email_signup_submitted`. Fired after the backend confirms.

### `email_signup_failed`
| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `form_id` | string | ✅ | Same as above. |
| `error_code` | string | optional | Short machine code, e.g. `network`, `invalid_email`. |

---

## Featured row events (Library)

These power the "Featured from other categories" rail and the topic cards on
the Library. **All card-level events must include `category_id` AND `post_id`
identifiers** — without them the row is unattributable. The validator enforces
this at runtime.

### `featured_other_cats_row_viewed`
Row-level impression. No per-card identifiers required.
| Prop | Type | Required |
| --- | --- | --- |
| `from_category_id` | number | ✅ |
| `item_count` | number | ✅ |
| `items_signature` | string | ✅ |

### `featured_other_cats_card_viewed`
| Prop | Type | Required |
| --- | --- | --- |
| `category_id` | number | ✅ |
| `category_slug` | string | ✅ |
| `post_id` | number | ✅ |
| `post_slug` | string | ✅ |
| `position` | number | ✅ |
| `from_category_id` | number | optional |

### `featured_other_cats_card_clicked`
Same required props as `_card_viewed`, plus:
| Prop | Type | Required |
| --- | --- | --- |
| `click_target` | `"image" \| "title" \| "category_badge" \| "read_link"` | ✅ |

### `featured_other_cats_empty_clear_clicked`
| Prop | Type | Required |
| --- | --- | --- |
| `from_category_id` | number | ✅ |

---

## Category exploration events

### `category_exploration_loaded_more`
| Prop | Type | Required |
| --- | --- | --- |
| `from` | number | ✅ |
| `to` | number | ✅ |
| `total_available` | number | ✅ |

### `category_exploration_topic_opened`
| Prop | Type | Required |
| --- | --- | --- |
| `category_id` | number | ✅ |
| `category_slug` | string | ✅ |
| `location` | `"topic_card_title" \| "topic_card_header" \| "topic_card_footer"` | ✅ |

### `category_exploration_post_opened`
| Prop | Type | Required |
| --- | --- | --- |
| `category_id` | number | ✅ |
| `category_slug` | string | ✅ |
| `post_id` | number | ✅ |

---

## More-like-this events

### `more_like_this_post_opened`
| Prop | Type | Required |
| --- | --- | --- |
| `post_id` | number | ✅ |
| `from_post_id` | number | optional |
| `position` | number | optional |

### `more_like_this_page_opened`
| Prop | Type | Required |
| --- | --- | --- |
| `page_id` | number | ✅ |

### `more_like_this_related_category_opened`
| Prop | Type | Required |
| --- | --- | --- |
| `category_id` | number | ✅ |
| `category_slug` | string | ✅ |

---

## Search & filter events

### `search_submitted`
| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `query` | string | ✅ | The user's raw query string. |
| `source` | string | ✅ | Where it was submitted from (`navbar_desktop`, `homepage_hero`, `library`, `library_mobile_sheet`). |

### `category_filter_changed`
| Prop | Type | Required |
| --- | --- | --- |
| `from_category_id` | number \| null | ✅ |
| `to_category_id` | number \| null | ✅ |
| `source` | string | ✅ |

### `sort_changed`
| Prop | Type | Required |
| --- | --- | --- |
| `from_sort` | string | ✅ |
| `to_sort` | string | ✅ |
| `source` | string | ✅ |

### `library_tab_changed`
| Prop | Type | Required |
| --- | --- | --- |
| `from_tab` | string | ✅ |
| `to_tab` | string | ✅ |
| `source` | string | ✅ |

### `search_type_changed`
| Prop | Type | Required |
| --- | --- | --- |
| `from_type` | string | ✅ |
| `to_type` | string | ✅ |
| `source` | string | ✅ |

### `library_filter_cleared`
| Prop | Type | Required |
| --- | --- | --- |
| `cleared` | string | ✅ | What was cleared (`category`, `query`, `all`). |

### `library_view_shared`
| Prop | Type | Required |
| --- | --- | --- |
| `method` | string | ✅ | `clipboard`, `webshare`, etc. |
| `path` | string | ✅ |

### `pagination_load_more`
| Prop | Type | Required |
| --- | --- | --- |
| `source` | string | ✅ |
| `from_page` | number | ✅ |
| `to_page` | number | ✅ |
| `path` | string | optional |
| `query` | string | optional |

### `empty_state_tile_clicked`
| Prop | Type | Required |
| --- | --- | --- |
| `category_id` | number | ✅ |
| `category_slug` | string | ✅ |

---

## Engagement events

### `homepage_scroll_depth`
| Prop | Type | Required |
| --- | --- | --- |
| `depth_percent` | number | ✅ | One of `25`, `50`, `75`, `100`. |

### `homepage_section_viewed`
| Prop | Type | Required |
| --- | --- | --- |
| `section` | string | ✅ |

### `homepage_cta_viewed`
| Prop | Type | Required |
| --- | --- | --- |
| `cta_location` | string | ✅ |

---

## Podcast embed events

Fired by `BuzzsproutEmbedPlayer` on podcast episode posts. The Buzzsprout
small player runs in a cross-origin iframe, so the browser blocks us from
reading real `play` / `pause` / `ended` events. These two events are the only
reliable signals from the parent document — see the component's docblock for
the full rationale.

### `buzzsprout_embed_viewed`
Fires once when ≥50 % of the player has been visible for ≥400 ms. Cross-mount
deduped per `post_slug`.

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `episode_id` | string | ✅ | Buzzsprout episode id (from the embed URL). |
| `podcast_id` | string | ✅ | Buzzsprout show id. |
| `post_slug` | string | ✅ | WordPress slug for the episode post. |
| `post_id` | number | optional | WordPress post id when known. |

### `buzzsprout_embed_play_intent`
Fires the FIRST time the user clicks anywhere inside the iframe (detected via
the window-blur + `document.activeElement === iframe` check). This is play
intent, not confirmed playback — naming is intentional. Subsequent clicks
within the same mount are suppressed.

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `episode_id` | string | ✅ | Buzzsprout episode id. |
| `podcast_id` | string | ✅ | Buzzsprout show id. |
| `post_slug` | string | ✅ | WordPress slug for the episode post. |
| `post_id` | number | optional | WordPress post id when known. |

To compute conversion impact, treat `buzzsprout_embed_viewed` as the
denominator and `buzzsprout_embed_play_intent` as the numerator (per
`post_slug` for episode-level CTR; aggregated for site-wide).

---

## Routing / infrastructure events

### `legacy_redirect`
| Prop | Type | Required |
| --- | --- | --- |
| `from` | string | ✅ |
| `to` | string | ✅ |
| `rule` | string | ✅ |
| `external` | boolean | ✅ |

### `cta_destination_arrived`
Fired by `usePageArrivalTracker` when the user lands on the page a CTA pointed
at. Property shape mirrors `cta_clicked` with the original click's props
preserved + `arrived_at_path`.

---

## Adding a new event

1. Add an entry to this document under the appropriate section.
2. If the event must carry identifiers (e.g. anything tied to a specific post
   or category card), add it to `REQUIRED_PROPS` in `src/lib/analytics.ts`.
3. Add the call site. Run with the dev console open and verify the
   `[analytics]` debug line shows the expected props.
4. Verify the event surfaces in `/admin/analytics` after a few seconds.
