module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Rank Time (Vibe)/ranktime/src/app/api/codeforces/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
// src/app/api/codeforces/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = 'force-dynamic';
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');
    if (!handle) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Handle parameter is required'
        }, {
            status: 400
        });
    }
    try {
        // Fetch user info
        const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
            headers: {
                'User-Agent': 'RankTime-App/1.0'
            }
        });
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data from Codeforces');
        }
        const userData = await userResponse.json();
        if (userData.status !== 'OK' || !userData.result || userData.result.length === 0) {
            throw new Error('User not found on Codeforces');
        }
        const user = userData.result[0];
        // Fetch user submissions (limit to recent 100 for performance)
        const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=100`, {
            headers: {
                'User-Agent': 'RankTime-App/1.0'
            }
        });
        let stats = {
            solvedProblems: 0,
            totalSubmissions: 0,
            acceptedSubmissions: 0,
            wrongAnswer: 0,
            timeLimitExceeded: 0,
            memoryLimitExceeded: 0,
            runtimeError: 0,
            compilationError: 0,
            recentSubmissions: []
        };
        if (submissionsResponse.ok) {
            const submissionsData = await submissionsResponse.json();
            if (submissionsData.status === 'OK' && submissionsData.result) {
                const submissions = submissionsData.result;
                stats.totalSubmissions = submissions.length;
                // Track solved problems
                const solvedProblems = new Set();
                submissions.forEach((submission)=>{
                    const problemKey = `${submission.problem.contestId || 'gym'}-${submission.problem.index}`;
                    // Count verdict types
                    switch(submission.verdict){
                        case 'OK':
                            stats.acceptedSubmissions++;
                            solvedProblems.add(problemKey);
                            break;
                        case 'WRONG_ANSWER':
                            stats.wrongAnswer++;
                            break;
                        case 'TIME_LIMIT_EXCEEDED':
                            stats.timeLimitExceeded++;
                            break;
                        case 'MEMORY_LIMIT_EXCEEDED':
                            stats.memoryLimitExceeded++;
                            break;
                        case 'RUNTIME_ERROR':
                            stats.runtimeError++;
                            break;
                        case 'COMPILATION_ERROR':
                            stats.compilationError++;
                            break;
                    }
                });
                stats.solvedProblems = solvedProblems.size;
                // Get recent submissions (last 20)
                stats.recentSubmissions = submissions.slice(0, 20).map((submission)=>({
                        id: submission.id,
                        contestId: submission.contestId,
                        problem: {
                            contestId: submission.problem.contestId,
                            index: submission.problem.index,
                            name: submission.problem.name,
                            rating: submission.problem.rating,
                            tags: submission.problem.tags
                        },
                        verdict: submission.verdict,
                        programmingLanguage: submission.programmingLanguage,
                        timeConsumedMillis: submission.timeConsumedMillis,
                        memoryConsumedBytes: submission.memoryConsumedBytes,
                        creationTimeSeconds: submission.creationTimeSeconds
                    }));
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user,
            stats
        });
    } catch (error) {
        console.error('Codeforces API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to fetch data from Codeforces'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03902602._.js.map