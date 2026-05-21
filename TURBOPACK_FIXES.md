Recommended Turbopack troubleshooting and workaround

1) Quick workaround (use this when Turbopack panics locally)

- Start dev without Turbopack (works in Git Bash / macOS / Linux):

  npm run dev:classic

- Build without Turbopack:

  npm run build:classic

2) Clean caches

- Remove Next.js build cache to force a clean Turbopack rebuild:

  - Delete the `.next` directory in the project root.

3) Workspace root / lockfile

- Next emitted a warning about multiple lockfiles and selected a parent `package-lock.json` as the workspace root. This can confuse Turbopack and caching.
- If that parent `package-lock.json` (e.g. `C:\Users\rafi2\package-lock.json`) is not needed, consider removing or moving it so your project folder is the only package root.

4) If you need Turbopack working permanently

- Try upgrading/downgrading Next.js to a version with a stable Turbopack on your platform.
- If the panic reproduces, collect the panic log (Next prints a temp path on crash) and report it to the Next.js/Turbopack issue tracker including:
  - The panic log file
  - Your OS and Node version
  - Steps to reproduce (app routes visited)

5) Notes

- I've added `dev:classic` and `build:classic` scripts to `package.json` so you can reliably run without Turbopack.
- If you want, I can try setting `turbopack.root` in `next.config.js` (experimental) or attempt to reproduce the panic and dig deeper into the temporary panic log.

Latest captured panic
---------------------

Last panic observed while testing (saved verbatim below):

```
range start index 805306369 out of range for slice of length 999
```

I saved this message from the temporary panic file created by Next in your system temp directory. If you'd like, I can also add the full temp file contents to a new file in the repo and prepare an issue report for the Next/Turbopack team.

Test results (2026-05-15)
------------------------

- I ran `npm install` to update the project's `package-lock.json` so installs succeed.
- I started the stable dev server with Turbopack disabled using `npm run dev:classic` (environment `NEXT_EXPERIMENTAL_TURBOPACK=false`). Server served on `http://localhost:3001` (port 3000 was in use).
- I cleared the Next cache (`rm -rf .next`) and then ran `npx next dev` to start with Turbopack enabled. The server reported "Ready" and served requests on `http://localhost:3001`.
- I ran a smoke test against common pages and API routes. Responses were as expected (200 / 307 / 400 / 404 / 405 depending on route and params). No Turbopack panic was reproduced during this test run.

Recommendation
--------------

- Use `npm run dev:classic` as the default local development workflow to avoid intermittent Turbopack instability while you continue development.
- If you want to continue investigating Turbopack, reproduce the panic by exercising the app until it crashes, then collect the temporary panic file that Next prints on crash and attach it to a GitHub issue. I can prepare that issue for you if you want.

How to collect a Turbopack panic (if it reappears)
-------------------------------------------------

1. Clear the Next cache: `rm -rf .next`
2. Start Next normally: `npx next dev` (do not disable Turbopack).
3. If Next panics, it prints a temporary file path to the crash log — copy that file.
4. Save the crash file into the repo (for example `turbopack-panic-<timestamp>.log`) and open an issue on the Next.js repository including:
  - the panic log file
  - your OS and Node version
  - the exact steps and routes visited

If you'd like, I can automatically save the crash log into the repo and draft the issue text for you.
