# Vercel Environment Setup for Rank Time

Follow these steps to ensure NextAuth works correctly on Vercel and avoid sign-in freezes:

1. Open your Vercel dashboard and select the `rank-time` project.
2. Go to **Settings → Environment Variables**.
3. Add (or update) these variables for the `Production` environment:

   - `NEXTAUTH_URL` = `https://rank-time.vercel.app`
   - `NEXTAUTH_SECRET` = (a secure random string; e.g., run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` locally)
   - `MONGODB_URI` = (your production MongoDB connection string)

4. If you use Mailjet for OTP emails, also add:

   - `MAILJET_API_KEY`
   - `MAILJET_SECRET_KEY`
   - `FROM_EMAIL`
   - `FROM_NAME`

5. For Preview branches, set `NEXTAUTH_URL` to the preview URL (Vercel provides one).

6. Save variables and trigger a redeploy.

7. After deployment, test sign-in on other devices. If it still freezes, use the browser DevTools Network tab to inspect the POST to `/api/auth/callback/credentials` and the response headers — look for `Set-Cookie` and for `Secure` / `SameSite` attributes.

8. If you need debugging logs, check the Vercel deployment logs; we added extra logging in `src/lib/auth.ts` to help capture callback errors.
9. Optional temporary debugging flag

   - Set `DEBUG_AUTH=true` in Vercel (Preview or Production temporarily) to enable extra server-side logging
   - When `DEBUG_AUTH=true` you can call the safe endpoint `https://rank-time.vercel.app/api/debug/status` which returns non-sensitive environment checks (it will 404 when `DEBUG_AUTH` is not enabled)

   - Remember to set `DEBUG_AUTH` back to `false` or remove it after debugging to avoid extra log noise.

