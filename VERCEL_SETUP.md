# Vercel Setup for RankTime

## Required environment variables

Add these in `Vercel -> Project Settings -> Environment Variables`:

```env
MONGODB_URI=<your MongoDB Atlas connection string>
NEXTAUTH_SECRET=<generate a long random secret>
NEXTAUTH_URL=https://your-production-domain.vercel.app
MAILJET_API_KEY=<required for signup/reset emails>
MAILJET_SECRET_KEY=<required for signup/reset emails>
FROM_EMAIL=<verified sender address>
FROM_NAME=RankTime
```

Optional:

```env
OPENROUTER_API_KEY=<optional, enables Rank Buddy AI responses>
DEBUG_AUTH=false
ENABLE_SCHEDULER=false
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```

Generate a secret locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Vercel project settings

- Framework preset: `Next.js`
- Root directory: `ranktime`
- Install command: `npm install`
- Build command: `npm run build`

## MongoDB Atlas checklist

- Use MongoDB Atlas for production.
- Create a database user with read/write access.
- Add Vercel access to Atlas Network Access. A common starter option is `0.0.0.0/0`, then tighten later if needed.
- Put the final Atlas URI into `MONGODB_URI`.

## Before going live

1. Deploy once with the env vars above.
2. Test signup, OTP verification, login, create session, logout, forgot-password OTP, and social follow/unfollow.
3. If you use a custom domain, update `NEXTAUTH_URL` to that exact `https://` domain and redeploy.
4. Keep `DEBUG_AUTH=false` in production unless you are actively debugging.

## Notes

- Rank Buddy works without `OPENROUTER_API_KEY`, but it will use built-in fallback responses instead of AI.
- OTP email flows now depend on Mailjet being configured correctly; if Mailjet is missing or invalid, registration/reset will fail fast instead of pretending email was sent.
