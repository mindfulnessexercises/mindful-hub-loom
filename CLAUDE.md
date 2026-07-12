# CLAUDE.md

Working notes for Claude sessions in this repo. The repo itself is the
mindfulnessexercises.com site (React + Vite); see `KNOWLEDGE.md` for the brand
and homepage brief. Sessions here also manage MailerLite newsletter campaigns
("Mindful Musings") — the rules below exist because of real subscriber-facing
incidents. Do not regress them.

## MailerLite newsletter emails — REQUIRED design rules

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

   | Class        | Use                              | Base    | Mobile (≤620px) |
   |--------------|----------------------------------|---------|-----------------|
   | `.hook`      | h1 headline                      | 31px    | 30px            |
   | `.bcopy`     | body paragraphs                  | 20px    | **23px**        |
   | `.step`      | numbered practice steps          | 18px    | 21px            |
   | `.cardtitle` | section-card titles              | 25px    | 26px            |
   | `.cardp`     | section-card body                | 17.5px  | 20px            |
   | `.quotebox`  | pull-quote cell                  | 20px    | 22px            |
   | `.poem`      | poem cell                        | 19px    | 21px            |
   | `.qline`     | closing quote line               | 23px    | 24px            |
   | `.btn`       | buttons (padding ≥ 16px 32px)    | 18px    | 20px            |
   | `.note`      | small notes under buttons        | 15px    | 17px            |
   | `.creds`     | signature credentials            | 15px    | 17px            |
   | `.kicker`    | uppercase kickers                | 12–13px | 14px            |
   | `.fine`      | legal/disclaimer                 | 14px    | 16px            |
   | `.foot`      | footer                           | 14px    | 16px            |

   **Nothing below 14px base, anywhere** (the old 11–13px kickers, date line,
   and footer are what read as illegibly small once scaled).

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
   2026-07-13 campaign "What 8 weeks of meditation does to the brain"
   (mobile-optimized rebuild of the Sara Lazar workshop email) — copy its
   structure for new sends.

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
