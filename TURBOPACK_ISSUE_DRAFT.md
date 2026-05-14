## Draft: Report Turbopack panic — range start index out of range

Summary
-------

While running Next.js 16.2.6 locally on Windows with Node 24 I observed an intermittent Turbopack panic. The panic message (excerpt) is saved in `turbopack-panic-2026-05-15.log` in this repo.

Panic excerpt
-------------

```
range start index 805306369 out of range for slice of length 999
```

Steps I followed
----------------

1. Cleaned `.next`: `rm -rf .next`
2. Started dev server with Turbopack enabled: `npx next dev`
3. Exercised several routes (/, /login, /register, /contact, /privacy, /api/test-email, /api/codeforces)
4. The server sometimes panicked and printed a temporary crash log file. I saved the panic excerpt into `turbopack-panic-2026-05-15.log`.

Environment
-----------

- Next.js: 16.2.6
- Node: 24
- OS: Windows
- Repo: (private) — local dev reproduction steps above

What I tried to mitigate
-----------------------

- Deleted `.next` to force a clean rebuild
- Removed parent `package-lock.json` (if present) to avoid workspace-root confusion
- Used `NEXT_EXPERIMENTAL_TURBOPACK=false` as fallback (dev:classic)

Logs / Files attached
---------------------

- `turbopack-panic-2026-05-15.log` (excerpt). If maintainers need the full temporary crash file, I can attach it — please advise whether to paste full content here or upload.

Request
-------

Please advise whether this is a known issue and any further data you need. I can reproduce and attach the full panic file on request, or provide a minimal reproduction if helpful.

---

If you want, I can open this issue in the Next.js repo and attach the full panic file (if/when we capture it). Otherwise I can keep this draft here and we can iterate.
