# Put FlowDeck online — step by step

By the end of this you'll have a link like `flowdeck.pages.dev` that works on your
phone, your laptop, and anyone else's device. It costs nothing, and every time you
push a change to GitHub the live site updates itself.

Set aside about 15 minutes. You don't need a database to go live — skip Part 3 if
you just want it working today.

**One thing to know before you start:** the app lives in the `app` folder of this
repo, not at the top level. Your Builder Card site is still at the top level, and
the two don't touch each other. That's why Step 4 asks for a "root directory".

---

## Part 1 — Get the code onto GitHub

Already done. The code is on the branch `claude/productivity-app-focus-timer-u3n2jr`
in `Cyberburakku/BatmanProject-app`.

Cloudflare rebuilds whenever you push to whichever branch you pick, so you have two
options:

- **Deploy from this branch** — good for trying it out. Pick this branch in Step 3.
- **Merge into `main` first** — better once you're happy with it, because `main` is
  the branch you'll keep pushing to.

Either works. You can change it later in the Cloudflare settings.

---

## Part 2 — Create the Cloudflare project

### Step 1: Make a Cloudflare account

1. Go to [cloudflare.com](https://cloudflare.com) and sign up. The free plan is all you need.
2. Verify your email, then log in.

### Step 2: Start a Pages project

1. In the left sidebar, click **Workers & Pages**.
2. Click **Create application**, then the **Pages** tab.
3. Click **Connect to Git**.

### Step 3: Connect your repo

1. Click **Connect GitHub** and authorise Cloudflare.
2. When GitHub asks which repositories to share, pick **BatmanProject-app**.
   (You can choose "only select repositories" — Cloudflare doesn't need the rest.)
3. Back in Cloudflare, select **BatmanProject-app** from the list.
4. Under **Production branch**, choose the branch you decided on in Part 1.
5. Click **Begin setup**.

### Step 4: Fill in the build settings

This is the screen people get wrong, so copy it exactly:

| Field | What to enter |
| --- | --- |
| Project name | `flowdeck` (this becomes your web address) |
| Framework preset | **Vite** — or leave it as "None", the fields below are what matter |
| Build command | `npm run build` |
| Build output directory | `dist` |
| **Root directory** | `app` ← **easy to miss, and nothing works without it** |

**Why the root directory matters:** it tells Cloudflare "the app is in the `app`
folder, run everything from in there". Leave it blank and the build fails with
something like *"npm: no package.json found"*, because the top level of this repo
is your Builder Card site instead.

### Step 5: Deploy

1. Click **Save and Deploy**.
2. Cloudflare builds it. Takes 1–3 minutes the first time.
3. Green tick means you're live. Your link is at the top: `flowdeck.pages.dev`
   (or `flowdeck-xxx.pages.dev` if the name was taken).

Open it on your phone. Add a few tasks. Start a timer. That's the app working.

**If the build goes red:** click **View build log** and read the last 10 lines.
Nine times out of ten it says `package.json not found`, which means the root
directory in Step 4 isn't set to `app`.

---

## Part 3 — Turn on accounts and sync (optional)

Skip this and the app still works perfectly — it just saves to whichever browser
you're using, so your phone and laptop each keep their own separate list.

Do this part when you want one list that follows you between devices.

### Step 6: Create the database

1. Sign up at [supabase.com](https://supabase.com) — free plan is fine.
2. Click **New project**. Give it a name and a strong database password, and pick
   the region closest to you.
3. Wait about two minutes while it sets itself up.

### Step 7: Create the table

1. In Supabase, click **SQL Editor** in the sidebar, then **New query**.
2. Open `app/supabase-schema.sql` from this repo, copy everything in it, and paste
   it into the box.
3. Click **Run**. You should see "Success".

That file creates one table and locks it down so each person can only ever read
their own tasks. Don't skip it — without it, sync has nowhere to put anything.

### Step 8: Copy your two keys

1. In Supabase, go to **Project Settings** → **API**.
2. Copy the **Project URL**.
3. Copy the **anon public** key. It's long. Copy the whole thing.

The anon key is designed to sit in a web page where anyone can read it — that's
normal and safe, because the rules you added in Step 7 are what actually protect
the data. The key labelled **service_role** is the dangerous one. Never put that
anywhere near this app.

### Step 9: Paste the keys into Cloudflare

1. In Cloudflare, open your `flowdeck` project.
2. Go to **Settings** → **Environment variables** (some accounts call it
   *Variables and Secrets*).
3. Under **Production**, click **Add variable** twice:

| Variable name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | your Project URL from Step 8 |
| `VITE_SUPABASE_ANON_KEY` | your anon public key from Step 8 |

4. Spelling matters, capitals included. `VITE_` at the front is not optional.
5. Click **Save**.
6. Go to **Deployments** → the newest one → **Retry deployment**.

**That last step is the one everybody forgets.** Environment variables are baked in
when the site is built, so the version already online can't see them. It needs a
fresh build.

### Step 10: Check it worked

1. Open your live site and go to **Settings** (the gear icon, top right).
2. You should now see a sign-in box. If it still says *"Saving to this browser
   only"*, the keys didn't reach the build — check the spelling and retry the
   deployment.
3. Create an account, then open the same site on your phone and sign in with it.
4. Add a task on one device. It shows up on the other within a second or two.

---

## Part 4 — Your own domain (optional)

1. In your `flowdeck` project, click **Custom domains** → **Set up a custom domain**.
2. Type a domain you own, like `mytaskapp.com`.
3. Cloudflare shows you the DNS records to add. If the domain is already on
   Cloudflare it does this for you.
4. Give it 10 minutes. The certificate that puts the padlock in the address bar is
   automatic.

---

## Things already handled for you

You don't need to do any of these — they're in the repo:

- **`app/public/_redirects`** contains `/*    /index.html   200`. Without it, some
  links would 404 on Cloudflare. It's already there.
- **`app/.env.example`** shows the two variable names, so you never have to guess
  the spelling.
- **`.gitignore`** keeps `node_modules`, `dist` and any real `.env` file out of
  GitHub, so your keys can't leak by accident.

---

## When something breaks

| What you see | What's wrong | Fix |
| --- | --- | --- |
| Build fails, `package.json not found` | Root directory isn't `app` | Settings → Builds → set root directory to `app`, redeploy |
| Site loads, blank white page | Wrong output directory | Set build output directory to `dist`, redeploy |
| A page 404s when you refresh it | `_redirects` didn't ship | Confirm `app/public/_redirects` is in GitHub |
| Settings still says "browser only" | Keys missing, or added after the build | Check both names start with `VITE_`, then retry the deployment |
| "Failed to fetch" when signing in | Step 7 SQL wasn't run | Run `app/supabase-schema.sql` in the Supabase SQL editor |
| Tasks vanished | You were saving to that browser only, and cleared its data | Turn on sync (Part 3) so they live in the database instead |

---

## Working on it locally

```bash
cd app
npm install
npm run dev
```

That opens `http://localhost:5173`. To test sync on your own machine, make a file
called `app/.env.local` with your two keys in it:

```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

`.env.local` is already ignored by git, so it stays on your machine.

---

## What to do next

Get Part 2 done first and open the link on your phone. That's the win — a real app,
live, that you built. Sync can wait until you actually feel the annoyance of two
separate lists.
