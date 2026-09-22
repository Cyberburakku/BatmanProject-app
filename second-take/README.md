# Second Take — MVP build

A working demo of an AI-supported reentry coaching app. It runs entirely in the
browser: no signup, no login, no database, no paid services, no cost. Progress
and answers are stored locally, on the device, and never sent anywhere.

## The quickest way to look at it — no install needed

Open **`Second-Take-Demo.html`**. Download it, double-click it, and it opens in
your browser. That one file has the whole app baked inside it: no install, no
terminal, no internet needed.

To download it from GitHub: open the file, click the **Raw** button, then save
the page (Ctrl+S on Windows, Cmd+S on a Mac).

`Second-Take-v1-toolkit-demo.html` is the earlier, wider build (10 tools plus a
staff admin dashboard), kept so it can still be demonstrated.

## Running it as a live project (only if you want to change the code)

You need Node.js installed (a free tool that runs code on your machine — get it
at nodejs.org). Then, in a terminal:

```
cd second-take
npm install          # downloads the pieces the app needs (once only)
npm run dev          # starts the app and opens it in your browser
npm run build:single # rebuilds the one-file Second-Take-Demo.html
```

## What the MVP covers

**Participant screens**

- **Name entry** — asked once. The name only appears on certificates.
- **Homepage** — welcome, one random affirmation in golden yellow, and a
  progress snapshot drawn as a sun rising along an upward path.
- **Check-In Quiz** — the eight questions from the build doc, question 7 open
  text and skippable.
- **Learning Path** — a sunrise trail with one lesson active at a time.
- **Lessons** — content is written into the app and rendered in place. No lesson
  sends you to an outside website.
- **Resource Directory** — Connections only, with a search box, filter pills, an
  icon per type, and an "Open Resource" button instead of a raw link.
- **Interview Practice** — six common questions, one at a time.
- **Release-Day Checklist** — the final step on every path.
- **Employment** — a "Coming Soon" screen with a golden lock.
- **Certificates** — earned by finishing every lesson in a module, with confetti.
- **Affirmations ticker** — a thin scrolling bar above the crisis bar on every
  screen. It pauses on hover or tap.
- **Crisis bar** — fixed red bar on every screen, 988 and 211 tappable.
- **Dark and light mode** — light by default, toggled in the top bar.

## How the path is ordered

Scoring is implemented exactly as the build doc specifies, in
`src/lib/quiz.js`, and the ordering rules are in `src/lib/path.js`:

| Score | Rule |
| --- | --- |
| Technology (Q5 + Q8) | 0–1 → Everyday Tech Skills, standard pace. 2+ → Digital Basics, slower pace, staff flag. |
| Support (Q2 + Q3) | 0–1 → standard. 2–3 → Support Network module early. 4+ → Support Network first, staff flag. |
| Interview (Q6) | 0–1 → Interview Practice in normal sequence. 2 → Talking About Your Record inserted before it, staff flag. |

Every path ends with the Release-Day Checklist. Staff flags are shown on the
quiz results screen; they stay on the device.

## Progressive disclosure and the 24-hour wait

Each lesson unlocks 24 hours after the previous one is completed. Only one
lesson is active at a time; earlier ones show as teal circles with a gold
checkmark, the active one as a larger glowing gold circle, and later ones as
outlined circles with a gold lock.

**A real 24-hour wait makes the app impossible to demonstrate**, so the Learning
Path screen has a clearly-labelled "Demo controls" panel with a switch that
removes the wait. A participant build would not include it. The switch is stored
under its own key, so "Start over" does not silently turn it back on.

## Where the content lives

| What | Where |
| --- | --- |
| Structure, affirmations, resources | `src/data/content.json` |
| Five Technology lessons | `src/content/technology/*.md` |
| Support Network and Record modules | `src/content/modules/*.md` |
| Release-Day Checklist | `src/content/modules/Release_Day_Checklist.md` |

Each lesson file follows the same four parts: Introduction, Content, Activity,
Encouragement. The app renders the Activity heading in golden yellow and the
Encouragement line in teal.

The five Technology lessons use the exact text from the build doc. The module
lesson text was written for this build, since the doc specified the titles and
interaction types but not the body copy.

## Link corrections

Every link was checked against a live web search index on **22 September 2026**.
Two in the supplied JSON did not resolve and were corrected:

| Was | Now | Why |
| --- | --- | --- |
| `maine.gov/corrections/reentry` | [`maine.gov/corrections/programs/reentry`](https://www.maine.gov/corrections/programs/reentry) | The original path does not exist. Affected three entries. |
| `fairchancehiring.org` | [`eeoc.gov/arrestandconviction`](https://www.eeoc.gov/arrestandconviction) | Could not confirm the original as a real site. The EEOC page is the official federal source. |

Confirmed as correct and left alone: all four library sites, and the addresses
and phone numbers.

Still worth your attention: **Reentry Programs, Faith Groups, and Peer Mentors
all point at the same Maine Corrections page.** Better links for faith groups
and peer mentors would make that section much stronger.

## Design system

| Purpose | Colour |
| --- | --- |
| Primary action buttons, key highlights | Sunrise orange `#FF6B35` |
| Headers, navigation, structure | Bright teal `#2EC4B6` |
| Progress markers, badges, celebration | Golden yellow `#FFBF69` |
| Main background | Warm cream `#FFFBF5` |
| Body text and secondary headers | Deep charcoal teal `#264653` |
| Crisis support bar only | Red `#E63946` |

Nunito throughout, with a rounded system fallback if the web font cannot load.
Headers 26–30px bold, body 16–18px at 1.5 line height, buttons 16–18px bold,
rounded corners everywhere, at least 24px of screen padding, 32–40px between
major sections, and every button at least 48px tall with a subtle shadow.

### Three colour pairings that had to change

Text contrast was measured in both themes rather than eyeballed. Three
combinations in the spec were unreadable as written, so the role changed while
the colour stayed:

- **Affirmation text.** Golden yellow on cream is about 1.6:1, well below the
  readable threshold. The affirmation now sits on a charcoal teal panel, so the
  text is still exactly `#FFBF69`, at 6.2:1.
- **Top bar text.** White on bright teal is 2.2:1. The bar is still bright teal;
  its text is charcoal, at 6.4:1.
- **Teal text on cream.** Bright teal on cream is 2.1:1, so teal text on light
  backgrounds (links, the ticker, tile headings) uses the deeper teal from the
  same family. Bright teal is still used for fills, borders, and dark-mode text.

Primary buttons use the deeper end of the sunrise orange so white button text
clears 4.5:1; `#FF6B35` remains the highlight colour. The crisis bar keeps
`#E63946` exactly, with its text at 19px bold.

Lowest measured contrast anywhere: 4.17:1 on the crisis bar, which passes for
text at that size and weight.

## What this build skips

- Employment lessons (`Employment_Phase2`) — visible as a locked "Coming Soon"
  screen.
- Any external video. All five Technology lessons are static written content.
- Staff login and a cloud database, both of which need paid or account services.
