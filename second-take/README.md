# Second Take — demo build

A working prototype of a reentry coaching app. It runs entirely in the
browser: no signup, no login, no database, no paid services, no cost.

## Running it on your computer

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
npm run build   # puts a ready-to-host copy in the "dist" folder
npm run preview # check that built copy before you share it
```

## What's in the demo

**For participants**

- **Homepage** — welcome message, progress snapshot, and buttons into everything else.
- **Check-In Quiz** — five plain-language questions. Your answers pick a starting
  category, and the learning path reorders itself to match.
- **Learning Path** — a vertical trail. Finished lessons are green, the one you're
  on is gold, the rest are gray outlines.
- **Resource Directory** — Technology, Employment, and Connections sections with a
  search box and a category filter.
- **Interview Practice** — common interview questions one at a time. Type your own
  answer or start from an example. Nothing you type leaves the browser.
- **Crisis support** — a coral bar fixed to the bottom of every screen with tappable
  988 and 211 numbers.

**For staff (Admin button in the top bar — no login in this demo)**

- **Dashboard** — quick-glance cards for active lessons, flagged links, and total
  entries, plus an activity log of edits made this session.
- **Technology / Employment / Connections** — table views showing title, category, and
  link, with Edit and Remove on every row and a gold "Add New Resource" button on top.
- **Edit form** — title, description, link, category, subcategory, and a live preview
  panel showing exactly what participants will see.
- **Flagged Links** — navy header with a gold count badge, category and reason filters,
  and coral warning cards with "Replace Link" and "Remove Resource". Replacing a link
  clears its flag. When nothing is flagged, you get a green checkmark empty state.

"Reset demo" in the top bar wipes everything back to the starting content.

## How the content is stored

All lessons, resources, quiz questions, and interview questions live in one file:
`src/data/content.json`. That's the file to edit if you want to change the demo's
starting content.

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
| Headers, primary buttons | Deep navy `#1B2A4A` |
| Accents, calls to action | Warm gold `#D4A537` |
| Backgrounds | Soft off-white `#F7F5F0` |
| Progress bars, completed states | Grounded green `#4A7C59` |
| Crisis support only | Coral `#E07A5F` |

Clean sans-serif throughout: headers 24–28px bold, body 16–18px regular,
button text 16px bold. Every screen has at least 24px of padding and every
button is at least 48px tall.

Note: this project uses its own colour set rather than the Jay Flow palette in
the repository's `DESIGN.md`, because the Second Take brief specifies one.
