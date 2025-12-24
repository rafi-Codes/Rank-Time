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
"[project]/Rank Time (Vibe)/ranktime/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "default",
    ()=>connectDB
]);
// src/lib/db.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/Rank Time (Vibe)/ranktime/node_modules/mongodb)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Rank Time (Vibe)/ranktime/node_modules/mongoose)");
;
;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const uri = ("TURBOPACK compile-time value", "mongodb+srv://rafihasan27rafi_db_user:hkP2N5DN9aHTeUK6@ranktimedatabase.jaxuw2l.mongodb.net/?appName=rankTimeDataBase");
const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxIdleTimeMS: 30000
};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongodb$29$__["MongoClient"](uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else //TURBOPACK unreachable
;
async function connectToDatabase() {
    try {
        const client = await clientPromise;
        return client;
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function connectDB() {
    if (global._mongooseConn) {
        return global._mongooseConn;
    }
    global._mongooseConn = (async ()=>{
        try {
            return await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["default"].connect(uri);
        } catch (error) {
            console.error('Mongoose connection error:', error);
            global._mongooseConn = undefined;
            throw error;
        }
    })();
    return global._mongooseConn;
}
}),
"[project]/Rank Time (Vibe)/ranktime/src/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Rank Time (Vibe)/ranktime/node_modules/mongoose)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: {
        type: Date
    },
    image: {
        type: String
    },
    codeforcesHandle: {
        type: String
    },
    usertag: {
        type: String,
        required: true,
        unique: true
    },
    following: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
            ref: 'User'
        }
    ],
    totalScore: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    maxStreak: {
        type: Number,
        default: 0
    },
    lastSessionDate: {
        type: Date
    },
    league: {
        type: String,
        enum: [
            'bronze',
            'silver',
            'gold',
            'platinum',
            'diamond',
            'master',
            'grandmaster'
        ],
        default: 'bronze'
    },
    rank: {
        type: Number,
        default: 0
    },
    totalSessions: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["default"].models?.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["default"].model('User', UserSchema);
}),
"[project]/Rank Time (Vibe)/ranktime/src/models/Session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Rank Time (Vibe)/ranktime/node_modules/mongoose)");
;
const LapSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    startedAt: {
        type: Date,
        required: true
    },
    endedAt: {
        type: Date,
        required: true
    },
    comment: {
        type: String
    }
});
const SessionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["Schema"]({
    user: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: String,
        required: true
    },
    problemName: {
        type: String,
        required: true
    },
    problemUrl: {
        type: String,
        required: true
    },
    problemRating: {
        type: Number,
        required: true
    },
    problemTags: [
        {
            type: String
        }
    ],
    laps: [
        LapSchema
    ],
    totalTime: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    streakBonus: {
        type: Number,
        default: 0
    },
    notes: {
        type: String
    },
    comments: {
        type: String
    },
    codeforcesHandle: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
// Create index for faster queries
SessionSchema.index({
    user: 1,
    createdAt: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["default"].models?.Session || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$mongoose$29$__["default"].model('Session', SessionSchema);
}),
"[project]/Rank Time (Vibe)/ranktime/src/app/api/leaderboard/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
// src/app/api/leaderboard/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$Session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/models/Session.ts [app-route] (ecmascript)");
;
;
;
;
const dynamic = 'force-dynamic';
const runtime = 'nodejs';
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const sortBy = searchParams.get('sort') || 'totalScore';
        const timeRange = searchParams.get('timeRange') || 'all';
        let users = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).select('name email totalScore currentStreak maxStreak rank league totalSessions');
        // Calculate time-based stats if needed
        if (timeRange !== 'all') {
            const startDate = new Date();
            if (timeRange === 'month') {
                startDate.setMonth(startDate.getMonth() - 1);
            } else if (timeRange === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            }
            // Get sessions within time range for each user
            for (const user of users){
                const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$Session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                    userId: user._id,
                    createdAt: {
                        $gte: startDate
                    }
                });
                if (sortBy === 'totalScore') {
                    user.totalScore = sessions.reduce((sum, session)=>sum + session.score, 0);
                } else if (sortBy === 'averageScore') {
                    user.averageScore = sessions.length > 0 ? sessions.reduce((sum, session)=>sum + session.score, 0) / sessions.length : 0;
                } else if (sortBy === 'totalSessions') {
                    user.totalSessions = sessions.length;
                }
            }
        }
        // Calculate average score for all users
        for (const user of users){
            if (!user.averageScore) {
                const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$Session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                    userId: user._id
                });
                user.averageScore = sessions.length > 0 ? sessions.reduce((sum, session)=>sum + session.score, 0) / sessions.length : 0;
            }
        }
        // Sort users based on the selected criteria
        users.sort((a, b)=>{
            let aValue, bValue;
            switch(sortBy){
                case 'totalScore':
                    aValue = a.totalScore;
                    bValue = b.totalScore;
                    break;
                case 'currentStreak':
                    aValue = a.currentStreak;
                    bValue = b.currentStreak;
                    break;
                case 'maxStreak':
                    aValue = a.maxStreak;
                    bValue = b.maxStreak;
                    break;
                case 'averageScore':
                    aValue = a.averageScore;
                    bValue = b.averageScore;
                    break;
                case 'totalSessions':
                    aValue = a.totalSessions;
                    bValue = b.totalSessions;
                    break;
                default:
                    aValue = a.totalScore;
                    bValue = b.totalScore;
            }
            return bValue - aValue; // Descending order
        });
        // Update ranks
        users.forEach((user, index)=>{
            user.rank = index + 1;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d2affc7f._.js.map