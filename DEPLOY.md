# Deploying to nxtorbis.com

## What is live today

| | |
| --- | --- |
| Host | GitHub Pages |
| Repository | [`NXTORBIS/nxtorbis`](https://github.com/NXTORBIS/nxtorbis) (public) |
| `main` branch | Angular source |
| `gh-pages` branch | the built site Pages actually serves, plus `CNAME` and `.nojekyll` |
| DNS | GoDaddy nameservers pointing at GitHub Pages; `www` already redirects to the apex |

> All commands below are **PowerShell** (the shell that opens by default on
> Windows). It does not support `&&` for chaining, which is why everything is
> wrapped in a script.

Because Pages publishes **from the `gh-pages` branch**, going live needs no
change to any GitHub setting. Replace the contents of that branch and the site
changes over.

This project is already prepared for it: `public/CNAME` and `public/.nojekyll`
are copied into `out/` by every build, so the custom domain and the `_next`
folder both survive deployment.

---

## Step 1 - take a backup (do this first)

Open **PowerShell** in the project folder and run:

```powershell
.\scripts\deploy.ps1 -Backup
```

This copies the live site and the Angular source onto their own branches
(`gh-pages-angular-backup`, `angular-source-backup`) so you can always return to
them. A browser window will ask you to sign in to GitHub the first time; that is
Git Credential Manager, and later runs are silent.

## Step 2 - go live

```powershell
.\scripts\deploy.ps1
```

It builds, checks the export really is deployable, then replaces the `gh-pages`
branch. If anything fails it stops before publishing, so a broken build cannot
reach the live site. The site changes over in about a minute.

To rehearse without touching anything:

```powershell
.\scripts\deploy.ps1 -DryRun
```

### If you would rather also keep the source in the repository

Optional. This replaces the Angular source on `main` (backed up in step 1) and
enables automatic redeploys on every future push:

```powershell
git push --force origin main
```

The included workflow then needs write access once:
**Settings - Actions - General - Workflow permissions - "Read and write
permissions" - Save**. If you would rather not change that setting, ignore this
section; `.\scripts\deploy.ps1` deploys perfectly well on its own.

## Step 3 — check the result

- [ ] `https://nxtorbis.com` shows the new design (hard refresh: Ctrl+F5)
- [ ] `https://www.nxtorbis.com` still redirects to the apex
- [ ] Padlock is valid — GitHub may take a few minutes to settle the certificate
- [ ] `/about`, `/services`, `/products`, `/pricing`, `/contact` each load on a direct hit, not only via a link
- [ ] `/products/true-review` loads directly
- [ ] `/sitemap.xml` and `/robots.txt` respond
- [ ] Submit the sitemap in Google Search Console

## Rolling back

```bash
git push --force https://github.com/NXTORBIS/nxtorbis.git \
  refs/remotes/origin/gh-pages-angular-backup:refs/heads/gh-pages
```

The old site returns as soon as Pages rebuilds, usually under a minute.

---

## Two things worth doing before or soon after launch

1. **Contact form.** With no backend configured it opens the visitor's email
   client, and the interface says so. To collect submissions on the site, set
   `NEXT_PUBLIC_CONTACT_ENDPOINT` (Formspree, Basin, or your own endpoint) and
   rebuild. See the README.
2. **Phone number.** The old site's number was placeholder text, so none is
   published. Add a real one to `company` in `src/content/site.ts`.
