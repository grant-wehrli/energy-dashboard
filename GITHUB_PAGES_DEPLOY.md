# GitHub Pages Deployment

This project has a static GitHub Pages build alongside the existing app build.

## One-time GitHub setup

1. Push this repository to GitHub.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

## Deploy

Push to the `main` branch:

```bash
git push origin main
```

The workflow at `.github/workflows/deploy-github-pages.yml` will:

1. Install dependencies with `npm ci`.
2. Build the static site with `npm run build:pages`.
3. Upload `dist/github-pages`.
4. Publish it to GitHub Pages.

After the workflow finishes, the app will be available at:

```text
https://<github-username>.github.io/<repository-name>/
```

## Local static build check

```bash
npm run build:pages
npm run preview:pages
```

## Notes

- `npm run build` is still the existing TanStack Start / Cloudflare build.
- `npm run build:pages` is the static GitHub Pages build.
- The GitHub Pages build automatically uses `/<repository-name>/` as the base path in GitHub Actions.
- If the repository is named `<github-username>.github.io`, it automatically uses `/` as the base path.
- For a custom base path, set `GITHUB_PAGES_BASE` before building:

```bash
GITHUB_PAGES_BASE=/my-custom-path/ npm run build:pages
```
