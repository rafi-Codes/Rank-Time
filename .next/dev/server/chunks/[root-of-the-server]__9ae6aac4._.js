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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/Rank Time (Vibe)/ranktime/src/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateOtp",
    ()=>generateOtp,
    "sendEmail",
    ()=>sendEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
;
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
if (!host || !port || !user || !pass) {
    // We don't throw here because dev may not use email sending locally.
    console.warn('SMTP not fully configured. Email sending will fail if attempted.');
}
async function sendEmail(to, subject, text, html) {
    if (!host || !port || !user || !pass) {
        throw new Error('SMTP not configured');
    }
    const transporter = __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        }
    });
    const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
    });
    return info;
}
function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for(let i = 0; i < length; i++)otp += digits[Math.floor(Math.random() * digits.length)];
    return otp;
}
}),
"[project]/Rank Time (Vibe)/ranktime/src/lib/utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "generateUserTag",
    ()=>generateUserTag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/clsx/dist/clsx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-route] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function generateUserTag() {
    const adjectives = [
        'Swift',
        'Bold',
        'Clever',
        'Brave',
        'Wise',
        'Quick',
        'Sharp',
        'Smart',
        'Fast',
        'Agile',
        'Keen',
        'Bright',
        'Crafty',
        'Daring',
        'Eager',
        'Fierce',
        'Grand',
        'Hasty',
        'Ideal',
        'Jolly',
        'Kind',
        'Lively',
        'Mighty',
        'Noble',
        'Proud',
        'Quick',
        'Rapid',
        'Smart',
        'Tough',
        'Ultra',
        'Vivid',
        'Witty',
        'Xenon',
        'Young',
        'Zesty',
        'Alpha',
        'Beta',
        'Gamma',
        'Delta',
        'Echo'
    ];
    const nouns = [
        'Coder',
        'Hacker',
        'Dev',
        'Ninja',
        'Wizard',
        'Guru',
        'Master',
        'Pro',
        'Expert',
        'Ace',
        'Champ',
        'Hero',
        'Star',
        'King',
        'Queen',
        'Lord',
        'Sage',
        'Mind',
        'Brain',
        'Soul',
        'Spirit',
        'Force',
        'Power',
        'Storm',
        'Thunder',
        'Lightning',
        'Fire',
        'Ice',
        'Wind',
        'Earth',
        'Sky',
        'Sea'
    ];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    return `${randomAdjective}${randomNoun}${randomNumber}`;
}
}),
"[project]/Rank Time (Vibe)/ranktime/src/app/api/auth/signup/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
// src/app/api/auth/signup/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/email.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Rank Time (Vibe)/ranktime/src/lib/utils.ts [app-route] (ecmascript)");
;
;
;
;
;
const dynamic = 'force-dynamic';
const runtime = 'nodejs';
async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, resend } = body;
        // Handle resend OTP case
        if (resend && email) {
            const client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
            const db = client.db();
            const otpRecord = await db.collection('emailOtps').findOne({
                email,
                registrationData: {
                    $exists: true
                }
            });
            if (!otpRecord) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: 'No pending registration found for this email'
                }, {
                    status: 404
                });
            }
            // Remove existing OTPs for this email
            await db.collection('emailOtps').deleteMany({
                email
            });
            // Generate new OTP with the same registration data
            const otp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateOtp"])(4);
            const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
            await db.collection('emailOtps').insertOne({
                email,
                otp,
                expiresAt,
                createdAt: new Date(),
                registrationData: otpRecord.registrationData
            });
            // Send OTP email
            try {
                const subject = 'Your RankTime verification code (resent)';
                const text = `Your new verification code is: ${otp}. It expires in 10 minutes.`;
                const html = `<p>Your new verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(email, subject, text, html);
            } catch (err) {
                console.error('Failed to send OTP email:', err);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'OTP resent successfully'
            }, {
                status: 200
            });
        }
        // Handle new user registration
        if (!name || !email || !email.includes('@') || !password || password.trim().length < 7) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Invalid input - name, valid email, and password (min 7 characters) are required.'
            }, {
                status: 422
            });
        }
        const client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const db = client.db();
        const existingUser = await db.collection('users').findOne({
            email: email
        });
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'User exists already!'
            }, {
                status: 422
            });
        }
        const hashedPassword = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(password);
        // Generate unique usertag
        let usertag;
        let attempts = 0;
        do {
            usertag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateUserTag"])();
            attempts++;
            if (attempts > 10) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: 'Failed to generate unique usertag. Please try again.'
                }, {
                    status: 500
                });
            }
        }while (await db.collection('users').findOne({
            usertag
        }))
        // Generate OTP and store registration data in OTP record (don't create user yet)
        const otp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateOtp"])(4);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes
        await db.collection('emailOtps').insertOne({
            email,
            otp,
            expiresAt,
            createdAt: new Date(),
            registrationData: {
                name,
                email,
                password: hashedPassword,
                usertag
            }
        });
        // send OTP email (may throw if SMTP not configured)
        try {
            const subject = 'Your RankTime verification code';
            const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;
            const html = `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$src$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])(email, subject, text, html);
        } catch (err) {
            console.error('Failed to send OTP email:', err);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'OTP sent to email for verification'
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Signup error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Rank__Time__$28$Vibe$292f$ranktime$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Something went wrong!'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9ae6aac4._.js.map