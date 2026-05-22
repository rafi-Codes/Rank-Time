# RankTime - Production Readiness TODO (Phase 1)

## ✅ Phase 1 (Critical)

### 1) Database connection consolidation
- [ ] Edit `src/lib/db.ts`: remove `connectToDatabase()` and keep only Mongoose `connectDB()`
- [ ] Update remaining call sites of `connectToDatabase()` (OAuth auth + OTP + signup) to Mongoose-based access


- [ ] Configure Mongoose pool: `minPoolSize: 5`, `maxPoolSize: 20`

- [ ] Update all OTP auth routes to stop using `connectToDatabase()`
- [ ] Add DB connection health check endpoint

### 2) Authentication security - OTP brute-force protection
- [x] Create `src/lib/rateLimiters.ts` with `checkOtpAttempts()` and `checkPasswordResetAttempts()`

- [ ] Update OTP routes to call rate limiter
- [ ] Ensure generic error messages (no email enumeration)

### 3) Session streak calculation fixes
- [ ] Update `src/app/api/sessions/route.ts`: UTC day keys for streak comparisons
- [ ] Add input validation for session payload
- [ ] Wrap session creation + user stats update in Mongo transaction
- [ ] Prevent double-counting streaks on concurrent requests

### 4) Standardized error responses
- [x] Create `src/lib/apiResponse.ts`
- [x] Create `src/lib/withErrorHandler.ts`

- [ ] Update Phase-1-touched routes to return unified envelope

## Notes
- Redis-based storage for OTP attempts is preferred; if not available yet, use Mongo-backed tracking as a fallback.

