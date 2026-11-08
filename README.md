# Eval results viewer

A small Next.js app that shows repeated-run evaluation results: a summary page, a table of every case, and a page for each case showing every run. All data is made up (a fictional coffee subscription's "should this go to a person?" classifier). Nothing comes from work.

It was created with `npx create-next-app@latest` (TypeScript, App Router), then the three pages were added.

---

## What's in the project

| File | What it does | React or Next.js idea it shows |
|---|---|---|
| `data/results.json` | The sample results: 10 cases, 5 runs each | — |
| `lib/results.ts` | Loads the data and works out accuracy, over-fire, under-fire and flaky cases | TypeScript types |
| `components/StatCard.tsx` | One box with a number and a label | A **component** that takes **props** (inputs) |
| `components/AnswerBadge.tsx` | Green or red label for each run | A component that changes its look based on props |
| `app/layout.tsx` | The header and footer around every page. Reads the `REPORT_TITLE` setting | Shared **layout**, **environment variable** |
| `app/page.tsx` | Summary page at `/` | Uses `StatCard` four times with different props |
| `app/cases/page.tsx` | Table of all cases at `/cases` | **Showing a list**: `.map()` turns each case into a table row |
| `app/cases/[id]/page.tsx` | One page per case, like `/cases/c04` | **Dynamic route**: the `[id]` folder name captures that part of the URL |
| `app/globals.css` | Styles, including dark mode | — |
| `AGENTS.md` | Notes Next.js writes for AI coding tools. Leave it | — |

Routing in Next.js follows folders: `app/page.tsx` is `/`, `app/cases/page.tsx` is `/cases`, and `app/cases/[id]/page.tsx` is any `/cases/something`.

---

## Step 1: Set up (about 30 minutes)

1. Install **Node.js**, the LTS version, from https://nodejs.org. Check it worked by opening a terminal and running `node --version`. You should see v20.9 or higher.
2. Make sure you can sign in to **GitHub**.
3. Go to https://vercel.com/signup, choose the free **Hobby** plan, and sign up with **Continue with GitHub**.

## Step 2: Run it on your computer

Unzip the project, then in a terminal:

```bash
cd eval-viewer
npm install      # downloads Next.js and React into node_modules (a minute or two)
npm run dev      # starts a local copy that reloads when you save a file
```

Open http://localhost:3000. Click around: Summary, All cases, then a case ID.

## Step 3: Change the data and watch it update

With `npm run dev` still running, open `data/results.json` and change one case. For example, change c02's runs to `[false, true, false, false, false]`. Save. The summary numbers and the "Cases to look at first" list update on their own.

Then try one change in the code, like editing a `help=` line in `app/page.tsx`.

Stop the local server with `Ctrl + C`.

## Step 4: Check it builds

```bash
npm run build
```

This is the same build Vercel runs. If it passes here, it should pass there. Running it before you push catches most mistakes early.

## Step 5: Put it on GitHub and deploy with Vercel

**GitHub**

1. On github.com, click **New repository**. Name it `eval-viewer`. Leave "Add a README" unticked, since the project already has one. Public is fine because the data is made up.
2. In the terminal, inside the project folder:

```bash
git init
git add .
git commit -m "Eval results viewer: first version"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/eval-viewer.git
git push -u origin main
```

If the push asks for a password and rejects it, GitHub wants a different sign-in method. The easiest fix is to install GitHub's CLI and run `gh auth login`, or use GitHub Desktop.

**Vercel**

1. In Vercel, click **Add New… → Project**.
2. Find `eval-viewer` in the list and click **Import**. Vercel detects that it's a Next.js app. Leave the settings as they are.
3. Click **Deploy**. Watch the build log scroll. When it finishes, you get a live link like `eval-viewer-xxxx.vercel.app`.

**Preview links**

Every push to a branch other than `main` gets its own preview link, and the live site stays unchanged:

```bash
git checkout -b try-a-change
# edit something, then:
git commit -am "Try a change"
git push -u origin try-a-change
```

In Vercel, open **Deployments**. The new one is labelled Preview and has its own URL. Merging into `main` updates the live site.

## Step 6: Add a subdomain (optional)

1. In Vercel: your project → **Settings → Domains** → add `evals.adelineyaw.com`.
2. Vercel shows the DNS record it needs, usually a **CNAME** record for `evals`. Copy the exact value Vercel shows you.
3. Add that CNAME wherever DNS for adelineyaw.com is managed. If the domain's DNS is on WordPress.com, that's the domain's DNS records page there.
4. Back in Vercel, the domain changes from "Invalid configuration" to "Valid" once DNS updates. Vercel then issues the SSL certificate (the padlock) by itself.

While you wait, notice which part shows an error and what fixes it on its own.

## Step 7: Break it on purpose

These show how Vercel handles mistakes. Do each one, read what Vercel tells you, then fix it.

**a. A failed build.** In `app/cases/page.tsx`, change `passCount(c)` to `passCont(c)`. Commit and push to `main`. In Vercel, open the failed deployment and read the **Build Logs**. Find the line that names the file, the line number and the error. Then check the live site: it's still on the last good version. A failed build doesn't take the site down. Fix the typo and push again.

**b. Broken data.** In `data/results.json`, delete one comma between two cases and push. Read how the error looks this time compared with (a). Fix it.

**c. An environment variable.** In Vercel: **Settings → Environment Variables** → add `REPORT_TITLE` with a value like `Adeline's eval viewer`. Save, then look at the live site. The title hasn't changed yet. Environment variables only apply to new deployments, so go to **Deployments**, open the menu on the latest one and choose **Redeploy**. Now the title changes.

To try it on your own computer, create a file called `.env.local` containing `REPORT_TITLE=Local test`, then restart `npm run dev`. This file stays off GitHub because `.gitignore` excludes it.

**d. A page that doesn't exist.** Visit `/cases/zzz` on the live site. You get the 404 page, because `app/cases/[id]/page.tsx` calls `notFound()` when the ID isn't in the data.

---

## How it works

- **Components and props:** `StatCard` is written once and used four times with different inputs.
- **Lists:** the cases table uses `.map()` to turn each case into a row. Each row has a `key` so React can track it.
- **Routing:** folders become URLs. `[id]` is a dynamic segment, and `generateStaticParams` tells Next.js to build all 10 case pages ahead of time.
- **Rendering:** these pages are Server Components (the default in the App Router). They run on the server, mostly ahead of time when the site is built, so visitors get ready-made HTML and the browser never fetches the data itself. Run `npm run build` and look at the route list at the end: ○ means a page was fully built ahead of time.
- **Deploys:** push → build → preview or production. A failed build leaves the last good version live. Environment variables need a redeploy.
