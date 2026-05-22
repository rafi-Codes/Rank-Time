# Progress (Phase 1)

- [x] Step 1: db.ts consolidation (remove connectToDatabase, pool config)

- [x] Step 2: Update call sites (OAuth auth + signup + OTP routes) to use connectDB()/Mongoose
- [x] Step 3: DB health check endpoint
- [x] Step 4: OTP brute-force protection integration (rate limiter + generic responses)
- [x] Step 5: Standardized error/envelope for Phase-1 routes (apiResponse + withErrorHandler)
- [x] Step 6: Sessions streak fixes (UTC day keys, validation, transaction, concurrency)
- [x] Step 7: Run typecheck/lint/tests (if available)

