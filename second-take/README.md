# Second Take — demo build

A working prototype of a reentry coaching app. It runs entirely in the
browser: no signup, no login, no database, no paid services, no cost.

## The quickest way to look at it — no install needed

Open **`Second-Take-Demo.html`** (in this folder). Download it, double-click it,
and it opens in your browser. That one file has the whole app baked inside it:
no install, no terminal, no internet connection needed.

To download it from GitHub: open the file, click the **Raw** button, then save
the page (Ctrl+S on Windows, Cmd+S on a Mac).

One small note: opened this way, your progress is remembered by the browser in
most cases, but Safari can block that for files opened off your own computer.
If your progress does not stick, open it in Chrome, Edge, or Firefox instead.

## Running it as a live project (only if you want to change the code)

You need Node.js installed (a free tool that runs code on your machine —
get it at nodejs.org). Then, in a terminal:

```
cd second-take
npm install     # downloads the pieces the app needs (once only)
npm run dev     # starts the app and opens it in your browser
```

Press `Ctrl + C` in the terminal to stop it.

To make a version you can put on a website:

```
npm run build        # puts a ready-to-host copy in the "dist" folder
npm run preview      # check that built copy before you share it
npm run build:single # rebuilds the one-file Second-Take-Demo.html
```

## What's in the demo

**For participants**

- **Homepage** — welcome message, progress snapshot, and buttons into everything else.
- **Check-In Quiz** — five plain-language questions. Your answers pick a starting
  category, and the learning path reorders itself to match.
- **Learning Path** — a vertical trail. Finished lessons are electric blue, the one
  you're on is gold, the rest are gray outlines.
- **Resource Directory** — Technology, Employment, and Connections sections with a
  search box and a category filter.
- **Interview Practice** — common interview questions one at a time. Type your own
  answer or start from an example. Nothing you type leaves the browser.
- **Crisis support** — a fire orange bar fixed to the bottom of every screen with
  tappable 988 and 211 numbers.
- **Dark and light mode** — dark by default; the top bar toggles it and remembers
  your choice.

**For staff (Admin button in the top bar — no login in this demo)**

- **Dashboard** — quick-glance cards for active lessons, flagged links, and total
  entries, plus an activity log of edits made this session.
- **Technology / Employment / Connections** — table views showing title, category, and
  link, with Edit and Remove on every row and a gold "Add New Resource" button on top.
- **Edit form** — title, description, link, category, subcategory, and a live preview
  panel showing exactly what participants will see.
- **Flagged Links** — deep navy header with a gold count badge, category and reason
  filters, and orange warning cards with "Replace Link" and "Remove Resource".
  Replacing a link clears its flag. When nothing is flagged, you get a blue
  checkmark empty state.

"Reset demo" in the top bar wipes everything back to the starting content.

## Where the lessons and resources come from

All lessons, resources, quiz questions, and interview questions live in one file:
`src/data/content.json`. That's the file to edit if you want to change the demo's
starting content. Every link in it was checked against a live web search index on
**21 September 2026** (`linksCheckedOn` in the file records that date).

The content pulls from four places that publish free, plain-language material:

| Source | What it covers |
| --- | --- |
| [CareerOneStop — Justice-Impacted](https://www.careeronestop.org/JusticeImpacted/get-started-guide.aspx) | Reentry job search, resumes, interviews, work-ready checklist. Run by the U.S. Department of Labor. Has its own [video library](https://www.careeronestop.org/JusticeImpacted/Help/videos.aspx). |
| [GCFGlobal LearnFree](https://edu.gcfglobal.org/en/) | Free self-paced tech lessons: phones, email, passwords, search, online forms. |
| [DigitalLearn](https://www.digitallearn.org/) | Free beginner computer courses, also used by public libraries in person. |
| Federal services | [USAGov](https://www.usa.gov/replace-vital-documents) for ID and documents, [Benefits.gov](https://www.benefits.gov/), [HUD Find Shelter](https://www.hud.gov/findshelter), [211](https://www.211.org/), [988](https://988lifeline.org/), [SAMHSA](https://www.samhsa.gov/find-support). |

If you want more lessons, the CareerOneStop Justice-Impacted guide and the
GCFGlobal library are the two places to pull from. Both are free, need no
account, and are written in plain language.

**About the flagged entries.** Three entries carry a flag so the Flagged Links
screen has something to show. They are sample flags for the demo, not dead links
— the reasons say "Needs staff review", "Newer version available", and "Flagged
by a participant" rather than claiming the link is broken.

When the app runs, it copies that content into **localStorage** (a small storage box
built into every browser). Admin edits are saved there, so they survive a page
refresh but stay on that one device. Clearing your browser data, or clicking
"Reset demo", puts everything back.

Because nothing talks to a server, the app keeps working offline once the page
has loaded.

## What this build deliberately skips

- Real video-link checking (would need the YouTube Data API). Flags here are set
  by hand in the content file.
- Cloud syncing between devices (would need a hosted database such as Firebase).
- Staff login (would need an account service).

Each of those needs a paid or account-based service, so they belong to a later
phase once the project moves past the demo.

## Design system used

| Purpose | Colour |
| --- | --- |
| Brand header and side nav (both themes) | Deep navy `#0A0E1A` |
| Primary buttons, links, finished lessons | Electric blue `#00A3FF` |
| Calls to action, the lesson you're on | Gold `#FFD700` |
| Crisis support only | Fire orange `#FF6B00` |
| Dark background / light background | `#0A0E1A` / `#EDF2FA` |

These are the Jay Flow values from the repository's `DESIGN.md`.

**Dark and light mode.** Dark is the default. The toggle in the top bar switches
to light and saves your choice in the browser, so it sticks on your next visit.
Every colour is a variable defined twice — once on `:root` for dark, once on
`:root[data-theme="light"]` — so nothing is hardcoded to one theme. Blue, gold,
and orange are darkened in light mode so text keeps its contrast.

In light mode the header and admin side nav stay deep navy on purpose, so the
branding reads the same either way.

Clean sans-serif throughout: headers 24–28px bold, body 16–18px regular,
button text 16px bold. Every screen has at least 24px of padding and every
button is at least 48px tall.

One colour role changed from the original brief: completed lessons and progress
bars were grounded green, which has no place in this palette. They use electric
blue now, with gold still marking the lesson you're on, so the three states stay
easy to tell apart.
