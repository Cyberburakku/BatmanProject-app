# FlowDeck

Capture today's tasks, estimate the time, then focus until they're done.

Two steps to plan the day, a Pomodoro timer with a Strict Mode that makes leaving
deliberate, and reports that compare your estimates to what actually happened.

## Running it on your own machine

```bash
cd app
npm install
npm run dev        # opens http://localhost:5173
```

```bash
npm run build       # production build into app/dist
npm run preview     # serve that build locally to check it
```

## Does it need a database?

No. Everything is saved in your browser and survives a refresh, so the app works
the moment it loads with nothing to sign up for.

Adding two Supabase keys switches on accounts and cross-device sync. Sign-in only
appears in Settings once those keys exist — see `../CLOUDFLARE-SETUP.md`.

## How it is put together

| Path | What's in it |
| --- | --- |
| `src/App.jsx` | Screen layout, tabs, the pinned Today header |
| `src/state/store.jsx` | All tasks and settings, saving, and Supabase sync |
| `src/state/useTimer.js` | The countdown — stores its finish time, so a sleeping phone stays accurate |
| `src/components/Onboarding.jsx` | "What must you do today?", two steps |
| `src/components/FocusView.jsx` | Full-screen countdown and Strict Mode |
| `src/components/Reports.jsx` | Daily percentage, the week, estimated vs actual |
| `src/lib/recurrence.js` | Daily / weekly / every-N-days repeats |
| `src/lib/useDragList.js` | Drag to reorder, written for touch as well as mouse |
| `public/_redirects` | Tells Cloudflare to serve the app for every path |

Colours and fonts follow `../DESIGN.md`.
