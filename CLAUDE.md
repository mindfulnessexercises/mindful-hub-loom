# CLAUDE.md

Working notes for Claude sessions in this repo. The repo itself is the
mindfulnessexercises.com site (React + Vite); see `KNOWLEDGE.md` for the brand
and homepage brief. Sessions here also manage MailerLite newsletter campaigns
("Mindful Musings") — the rules below exist because of real subscriber-facing
incidents. Do not regress them.

## MailerLite newsletter emails — REQUIRED design & voice rules

### Mobile-first sizing (Sean's directive, 2026-07-10)

Sean's feedback on the 2026-07-10 send: the email rendered small and
hard to read on an iPhone. Root cause: a fixed-width container
(`<table width="600">`) forces mail apps to scale the whole email down
(~65% on a 390px screen), shrinking every font with it. **Future emails must
have significantly larger effective font sizes on mobile** (scale enlarged
again 2026-07-12 for older subscribers, per Sean). Concretely:

1. **Never use a fixed-width container.** The 600px card must be fluid:

   ```html
   <!--[if mso]>
   <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
   <![endif]-->
   <table role="presentation" class="container" width="100%" ... style="width:100%;max-width:600px;margin:0 auto;...">
     ...
   </table>
   <!--[if mso]>
   </td></tr></table>
   <![endif]-->
   ```

   Phones then lay the email out at native width — nothing gets scaled down.
   The MSO ghost table keeps Outlook desktop at 600px.

2. **Type scale (base inline / mobile media-query bump).** Tag text with these
   classes and include the media query verbatim; the mobile bump requires it.

   | Class        | Use                              | Base   | Mobile (≤620px) |
   |--------------|----------------------------------|--------|-----------------|
   | `.hook`      | h1 headline                      | 31px   | 30px            |
   | `.bcopy`     | body paragraphs                  | 21px   | **23px**        |
   | `.step`      | numbered practice steps          | 19px   | 21px            |
   | `.cardtitle` | section-card titles              | 25px   | 26px            |
   | `.cardp`     | section-card body                | 18px   | 20px            |
   | `.quotebox`  | pull-quote cell                  | 21px   | 22px            |
   | `.poem`      | poem cell                        | 20px   | 21px            |
   | `.qline`     | closing quote line               | 23px   | 24px            |
   | `.btn`       | buttons (padding ≥ 16px 32px)    | 19px   | 20px            |
   | `.note`      | small notes under buttons        | 16px   | 17px            |
   | `.creds`     | signature credentials            | 16px   | 17px            |
   | `.kicker`    | uppercase kickers                | 13px   | 14px            |
   | `.fine`      | legal/disclaimer                 | 15px   | 16px            |
   | `.foot`      | footer                           | 15px   | 16px            |

   **Nothing below 15px base except the letterspaced uppercase kickers
   (13px).** Gmail directive (Sean, 2026-07-20): some Gmail contexts (the
   Gmail app on non-Google accounts, forwarded copies) strip `<style>` and
   media queries entirely and render ONLY the inline base sizes — so the
   base sizes above must be comfortably large on their own. The media-query
   bump is an enhancement, never the guarantee.

   ```css
   @media only screen and (max-width:620px){
   .container{width:100%!important;}
   .outer{padding:6px 0!important;}
   .pad{padding-left:18px!important;padding-right:18px!important;}
   .hook{font-size:30px!important;line-height:1.28!important;}
   .bcopy{font-size:23px!important;line-height:1.6!important;}
   .step{font-size:21px!important;line-height:1.6!important;}
   .cardtitle{font-size:26px!important;line-height:1.25!important;}
   .cardp{font-size:20px!important;line-height:1.6!important;}
   .note{font-size:17px!important;line-height:1.6!important;}
   .kicker{font-size:14px!important;}
   .quotebox{font-size:22px!important;}
   .poem{font-size:21px!important;}
   .qline{font-size:24px!important;}
   .creds{font-size:17px!important;}
   .fine{font-size:16px!important;}
   .foot{font-size:16px!important;}
   .btn{font-size:20px!important;}
   }
   ```

3. A current reference implementation of the full template lives in the
   2026-07-21 campaign "The question that kept visiting" (first with the
   Gmail-safe enlarged base sizes and the voice pass below) — copy its
   structure for new sends.

### Voice & tone (Sean's directive, 2026-07-20)

Sean: "my tone is very gentle, encouraging, awe/curious-based, we-based (not
I-based)… I don't want anything too direct, prescriptive, definitive,
click-baity, salesy." This applies to every subscriber-facing word — body
copy, subject lines, preheaders, buttons, and link labels.

- **We-based, not I-based.** Teaching and invitations live in "we/us/our"
  ("many of us know…", "we might try…"). First-person "I" is reserved for
  Sean telling his own story, and even those stories should land back in
  "we".
- **Invitations, never commands.** Soften practice steps and suggestions
  with "we might", "perhaps", "gently", "if it feels right", "at whatever
  intensity feels workable". Avoid imperative stacks ("Do X. Notice Y.").
- **Awe and curiosity over certainty.** Wonder rather than declare; prefer
  questions and "perhaps" to definitive claims. Hold science lightly —
  "research that echoes today's practice" — never as proof or a promise of
  results.
- **Nothing click-baity or salesy.** Subject lines are quiet curiosity in
  sentence case (e.g. "The question that kept visiting"), with no shock,
  drama, urgency, or promo formatting. Free offerings are shared as gifts
  ("if today's story stirred something, this is a kind next step"), never
  pitched. CTAs stay soft ("Listen free", "Read the script") — no "Grab",
  "Claim", "Don't miss".

### MailerLite API workflow facts (hard-won — trust these)

- **Campaign email content CANNOT be edited via the API once created.**
  `PUT api/campaigns/{id}` returns 200 but silently keeps the old HTML (both
  via the MCP `update_campaign` tool and a raw batch PUT). To change a
  scheduled email: cancel it, **create a new campaign** with the new content,
  verify, schedule the new one, and rename the old draft
  `"[replaced — do not send] …"`. Never leave two sendable copies.
- **Submit body-inner HTML only** in `emails[0].content` (start at your
  `<style>` block; no doctype/html/head/body, no `{$head_top}`/`{$body_top}`
  markers, no trailing `.mlFooter` style). MailerLite wraps it in its own
  document scaffold; submitting a full document nests/duplicates the scaffold
  and doubles tracking markers.
- **Always GET the campaign after any write and verify the stored content**
  (expected links present, no stray markers). A 200 response proves nothing.
- **Scheduling:** the schedule endpoint takes date/hours/minutes in the
  account's local timezone (America/Los_Angeles); API responses display
  `scheduled_for` in UTC. The usual send slot is 6:15 AM Pacific
  (= 13:15 UTC). A `ready` campaign must be cancelled before rescheduling.
- Keep `{$url}` (read online / view in browser) and `{$unsubscribe}` links,
  UTM params (`utm_source=newsletter&utm_medium=email&utm_campaign=…`), and
  the sender `Sean Fargo <sean@mindfulnessexercises.com>`.
- Link every destination to a URL verified in this repo's router
  (`src/App.tsx`) or a previously sent campaign — outbound network access to
  the live site is blocked in these sessions, so the codebase is the source
  of truth for valid paths.
