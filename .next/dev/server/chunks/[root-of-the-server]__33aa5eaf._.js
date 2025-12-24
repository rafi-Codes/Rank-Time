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
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

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
"[project]/Rank Time (Vibe)/ranktime/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
// src/lib/auth.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/db.ts [app-route] (ecmascript)");
;
;
;
const authOptions = {
    secret: ("TURBOPACK compile-time value", "8c3b0c932c566ce67af5631648cd281b"),
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: 'Credentials',
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials) return null;
                let client;
                try {
                    client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
                    const db = client.db();
                    const user = await db.collection('users').findOne({
                        email: credentials.email
                    });
                    if (!user) {
                        throw new Error('No user found!');
                    }
                    if (user.verified === false) {
                        throw new Error('Email not verified');
                    }
                    const isValid = await verifyPassword(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error('Invalid password!');
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    throw error;
                }
            // Don't close client in serverless - let connection pool handle it
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false,
                maxAge: 30 * 24 * 60 * 60
            }
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: false,
                maxAge: 30 * 24 * 60 * 60
            }
        },
        csrfToken: {
            name: 'next-auth.csrf-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false,
                maxAge: 30 * 24 * 60 * 60
            }
        }
    },
    callbacks: {
        async jwt ({ token, user, account }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session ({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider
            if (token) {
                session.user.id = token.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
};
async function hashPassword(password) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hash"])(password, 12);
}
async function verifyPassword(password, hashedPassword) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compare"])(password, hashedPassword);
}
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
"[project]/Rank Time (Vibe)/ranktime/src/app/api/sessions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
// src/app/api/sessions/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$Session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/models/Session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/models/User.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const dynamic = 'force-dynamic';
const runtime = 'nodejs';
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        const { problemName, problemRating, laps, totalTime, score, comments } = body;
        // Find the user
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            email: session.user.email
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User not found'
            }, {
                status: 404
            });
        }
        // Calculate streak bonus
        let streakBonus = 0;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastSession = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$Session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            userId: user._id,
            createdAt: {
                $gte: yesterday
            }
        }).sort({
            createdAt: -1
        });
        if (lastSession) {
            user.currentStreak += 1;
            if (user.currentStreak > user.maxStreak) {
                user.maxStreak = user.currentStreak;
            }
            streakBonus = Math.floor(user.currentStreak / 5) * 10; // Bonus every 5 streak days
        } else {
            user.currentStreak = 1;
        }
        // Update user stats
        user.totalScore += score + streakBonus;
        user.totalSessions += 1;
        // Update rank based on total score
        const allUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).sort({
            totalScore: -1
        });
        const userRank = allUsers.findIndex((u)=>u._id.toString() === user._id.toString()) + 1;
        user.rank = userRank;
        // Update league based on score
        if (user.totalScore >= 10000) user.league = 'Legend';
        else if (user.totalScore >= 5000) user.league = 'Master';
        else if (user.totalScore >= 2500) user.league = 'Expert';
        else if (user.totalScore >= 1000) user.league = 'Advanced';
        else if (user.totalScore >= 500) user.league = 'Intermediate';
        else user.league = 'Beginner';
        await user.save();
        // Create session
        const newSession = new __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$Session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            userId: user._id,
            problemName,
            problemRating,
            laps,
            totalTime,
            score: score + streakBonus,
            streakBonus,
            comments
        });
        await newSession.save();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Session saved successfully',
            session: newSession,
            streakBonus
        });
    } catch (error) {
        console.error('Error saving session:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (!session?.user?.email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            email: session.user.email
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User not found'
            }, {
                status: 404
            });
        }
        const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$models$2f$Session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            userId: user._id
        }).sort({
            createdAt: -1
        }).limit(50);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__33aa5eaf._.js.map