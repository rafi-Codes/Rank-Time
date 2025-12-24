"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/signup/route";
exports.ids = ["app/api/auth/signup/route"];
exports.modules = {

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_rafi2_Rank_Time_Vibe_ranktime_src_app_api_auth_signup_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/signup/route.ts */ \"(rsc)/./src/app/api/auth/signup/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/signup/route\",\n        pathname: \"/api/auth/signup\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/signup/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\rafi2\\\\Rank Time (Vibe)\\\\ranktime\\\\src\\\\app\\\\api\\\\auth\\\\signup\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_rafi2_Rank_Time_Vibe_ranktime_src_app_api_auth_signup_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/auth/signup/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGc2lnbnVwJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGc2lnbnVwJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRnNpZ251cCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNyYWZpMiU1Q1JhbmslMjBUaW1lJTIwKFZpYmUpJTVDcmFua3RpbWUlNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3JhZmkyJTVDUmFuayUyMFRpbWUlMjAoVmliZSklNUNyYW5rdGltZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNtQztBQUNoSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzZKOztBQUU3SiIsInNvdXJjZXMiOlsid2VicGFjazovL3Jhbmt0aW1lLz83YjQ5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHJhZmkyXFxcXFJhbmsgVGltZSAoVmliZSlcXFxccmFua3RpbWVcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxzaWdudXBcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvc2lnbnVwL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9zaWdudXBcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvc2lnbnVwL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxccmFmaTJcXFxcUmFuayBUaW1lIChWaWJlKVxcXFxyYW5rdGltZVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXHNpZ251cFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL3NpZ251cC9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/signup/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/auth/signup/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n/* harmony import */ var _lib_email__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/email */ \"(rsc)/./src/lib/email.ts\");\n// src/app/api/auth/signup/route.ts\n\n\n\n\nasync function POST(request) {\n    try {\n        const { name, email, password } = await request.json();\n        if (!name || !email || !email.includes(\"@\") || !password || password.trim().length < 7) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                message: \"Invalid input - name, valid email, and password (min 7 characters) are required.\"\n            }, {\n                status: 422\n            });\n        }\n        const client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_2__.connectToDatabase)();\n        const db = client.db();\n        const existingUser = await db.collection(\"users\").findOne({\n            email: email\n        });\n        if (existingUser) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                message: \"User exists already!\"\n            }, {\n                status: 422\n            });\n        }\n        const hashedPassword = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.hashPassword)(password);\n        // Create user as unverified\n        const result = await db.collection(\"users\").insertOne({\n            name: name,\n            email: email,\n            password: hashedPassword,\n            verified: false,\n            createdAt: new Date()\n        });\n        // Generate OTP and store in separate collection\n        const otp = (0,_lib_email__WEBPACK_IMPORTED_MODULE_3__.generateOtp)(6);\n        const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes\n        await db.collection(\"emailOtps\").insertOne({\n            userId: result.insertedId,\n            email,\n            otp,\n            expiresAt,\n            createdAt: new Date()\n        });\n        // send OTP email (may throw if SMTP not configured)\n        try {\n            const subject = \"Your RankTime verification code\";\n            const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;\n            const html = `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`;\n            await (0,_lib_email__WEBPACK_IMPORTED_MODULE_3__.sendEmail)(email, subject, text, html);\n        } catch (err) {\n            console.error(\"Failed to send OTP email:\", err);\n        }\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            message: \"Created user! OTP sent to email\",\n            userId: result.insertedId\n        }, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Signup error:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            message: \"Something went wrong!\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL3NpZ251cC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLG1DQUFtQztBQUNRO0FBQ0Q7QUFDRztBQUNRO0FBRTlDLGVBQWVLLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixNQUFNLEVBQUVDLElBQUksRUFBRUMsS0FBSyxFQUFFQyxRQUFRLEVBQUUsR0FBRyxNQUFNSCxRQUFRSSxJQUFJO1FBRXBELElBQUksQ0FBQ0gsUUFBUSxDQUFDQyxTQUFTLENBQUNBLE1BQU1HLFFBQVEsQ0FBQyxRQUFRLENBQUNGLFlBQVlBLFNBQVNHLElBQUksR0FBR0MsTUFBTSxHQUFHLEdBQUc7WUFDdEYsT0FBT2Isa0ZBQVlBLENBQUNVLElBQUksQ0FDdEI7Z0JBQUVJLFNBQVM7WUFBbUYsR0FDOUY7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE1BQU1DLFNBQVMsTUFBTWQsMERBQWlCQTtRQUN0QyxNQUFNZSxLQUFLRCxPQUFPQyxFQUFFO1FBRXBCLE1BQU1DLGVBQWUsTUFBTUQsR0FBR0UsVUFBVSxDQUFDLFNBQVNDLE9BQU8sQ0FBQztZQUFFWixPQUFPQTtRQUFNO1FBRXpFLElBQUlVLGNBQWM7WUFDaEIsT0FBT2xCLGtGQUFZQSxDQUFDVSxJQUFJLENBQ3RCO2dCQUFFSSxTQUFTO1lBQXVCLEdBQ2xDO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNTSxpQkFBaUIsTUFBTXBCLHVEQUFZQSxDQUFDUTtRQUUxQyw0QkFBNEI7UUFDNUIsTUFBTWEsU0FBUyxNQUFNTCxHQUFHRSxVQUFVLENBQUMsU0FBU0ksU0FBUyxDQUFDO1lBQ3BEaEIsTUFBTUE7WUFDTkMsT0FBT0E7WUFDUEMsVUFBVVk7WUFDVkcsVUFBVTtZQUNWQyxXQUFXLElBQUlDO1FBQ2pCO1FBRUEsZ0RBQWdEO1FBQ2hELE1BQU1DLE1BQU14Qix1REFBV0EsQ0FBQztRQUN4QixNQUFNeUIsWUFBWSxJQUFJRixLQUFLQSxLQUFLRyxHQUFHLEtBQUssT0FBTyxLQUFLLEtBQUssYUFBYTtRQUV0RSxNQUFNWixHQUFHRSxVQUFVLENBQUMsYUFBYUksU0FBUyxDQUFDO1lBQ3pDTyxRQUFRUixPQUFPUyxVQUFVO1lBQ3pCdkI7WUFDQW1CO1lBQ0FDO1lBQ0FILFdBQVcsSUFBSUM7UUFDakI7UUFFQSxvREFBb0Q7UUFDcEQsSUFBSTtZQUNGLE1BQU1NLFVBQVU7WUFDaEIsTUFBTUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFTixJQUFJLDJCQUEyQixDQUFDO1lBQzNFLE1BQU1PLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRVAsSUFBSSw2Q0FBNkMsQ0FBQztZQUN4RyxNQUFNdkIscURBQVNBLENBQUNJLE9BQU93QixTQUFTQyxNQUFNQztRQUN4QyxFQUFFLE9BQU9DLEtBQUs7WUFDWkMsUUFBUUMsS0FBSyxDQUFDLDZCQUE2QkY7UUFDN0M7UUFFQSxPQUFPbkMsa0ZBQVlBLENBQUNVLElBQUksQ0FDdEI7WUFBRUksU0FBUztZQUFtQ2dCLFFBQVFSLE9BQU9TLFVBQVU7UUFBQyxHQUN4RTtZQUFFaEIsUUFBUTtRQUFJO0lBRWxCLEVBQUUsT0FBT3NCLE9BQU87UUFDZEQsUUFBUUMsS0FBSyxDQUFDLGlCQUFpQkE7UUFDL0IsT0FBT3JDLGtGQUFZQSxDQUFDVSxJQUFJLENBQ3RCO1lBQUVJLFNBQVM7UUFBd0IsR0FDbkM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yYW5rdGltZS8uL3NyYy9hcHAvYXBpL2F1dGgvc2lnbnVwL3JvdXRlLnRzP2ZmMDgiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2FwcC9hcGkvYXV0aC9zaWdudXAvcm91dGUudHNcclxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5pbXBvcnQgeyBoYXNoUGFzc3dvcmQgfSBmcm9tICdAL2xpYi9hdXRoJztcclxuaW1wb3J0IHsgY29ubmVjdFRvRGF0YWJhc2UgfSBmcm9tICdAL2xpYi9kYic7XHJcbmltcG9ydCB7IGdlbmVyYXRlT3RwLCBzZW5kRW1haWwgfSBmcm9tICdAL2xpYi9lbWFpbCc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgbmFtZSwgZW1haWwsIHBhc3N3b3JkIH0gPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcclxuXHJcbiAgICBpZiAoIW5hbWUgfHwgIWVtYWlsIHx8ICFlbWFpbC5pbmNsdWRlcygnQCcpIHx8ICFwYXNzd29yZCB8fCBwYXNzd29yZC50cmltKCkubGVuZ3RoIDwgNykge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBtZXNzYWdlOiAnSW52YWxpZCBpbnB1dCAtIG5hbWUsIHZhbGlkIGVtYWlsLCBhbmQgcGFzc3dvcmQgKG1pbiA3IGNoYXJhY3RlcnMpIGFyZSByZXF1aXJlZC4nIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQyMiB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2xpZW50ID0gYXdhaXQgY29ubmVjdFRvRGF0YWJhc2UoKTtcclxuICAgIGNvbnN0IGRiID0gY2xpZW50LmRiKCk7XHJcblxyXG4gICAgY29uc3QgZXhpc3RpbmdVc2VyID0gYXdhaXQgZGIuY29sbGVjdGlvbigndXNlcnMnKS5maW5kT25lKHsgZW1haWw6IGVtYWlsIH0pO1xyXG5cclxuICAgIGlmIChleGlzdGluZ1VzZXIpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHsgbWVzc2FnZTogJ1VzZXIgZXhpc3RzIGFscmVhZHkhJyB9LFxyXG4gICAgICAgIHsgc3RhdHVzOiA0MjIgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgaGFzaFBhc3N3b3JkKHBhc3N3b3JkKTtcclxuXHJcbiAgICAvLyBDcmVhdGUgdXNlciBhcyB1bnZlcmlmaWVkXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VycycpLmluc2VydE9uZSh7XHJcbiAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgcGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxyXG4gICAgICB2ZXJpZmllZDogZmFsc2UsXHJcbiAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEdlbmVyYXRlIE9UUCBhbmQgc3RvcmUgaW4gc2VwYXJhdGUgY29sbGVjdGlvblxyXG4gICAgY29uc3Qgb3RwID0gZ2VuZXJhdGVPdHAoNik7XHJcbiAgICBjb25zdCBleHBpcmVzQXQgPSBuZXcgRGF0ZShEYXRlLm5vdygpICsgMTAwMCAqIDYwICogMTApOyAvLyAxMCBtaW51dGVzXHJcblxyXG4gICAgYXdhaXQgZGIuY29sbGVjdGlvbignZW1haWxPdHBzJykuaW5zZXJ0T25lKHtcclxuICAgICAgdXNlcklkOiByZXN1bHQuaW5zZXJ0ZWRJZCxcclxuICAgICAgZW1haWwsXHJcbiAgICAgIG90cCxcclxuICAgICAgZXhwaXJlc0F0LFxyXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBzZW5kIE9UUCBlbWFpbCAobWF5IHRocm93IGlmIFNNVFAgbm90IGNvbmZpZ3VyZWQpXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdWJqZWN0ID0gJ1lvdXIgUmFua1RpbWUgdmVyaWZpY2F0aW9uIGNvZGUnO1xyXG4gICAgICBjb25zdCB0ZXh0ID0gYFlvdXIgdmVyaWZpY2F0aW9uIGNvZGUgaXM6ICR7b3RwfS4gSXQgZXhwaXJlcyBpbiAxMCBtaW51dGVzLmA7XHJcbiAgICAgIGNvbnN0IGh0bWwgPSBgPHA+WW91ciB2ZXJpZmljYXRpb24gY29kZSBpczogPHN0cm9uZz4ke290cH08L3N0cm9uZz48L3A+PHA+SXQgZXhwaXJlcyBpbiAxMCBtaW51dGVzLjwvcD5gO1xyXG4gICAgICBhd2FpdCBzZW5kRW1haWwoZW1haWwsIHN1YmplY3QsIHRleHQsIGh0bWwpO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzZW5kIE9UUCBlbWFpbDonLCBlcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgeyBtZXNzYWdlOiAnQ3JlYXRlZCB1c2VyISBPVFAgc2VudCB0byBlbWFpbCcsIHVzZXJJZDogcmVzdWx0Lmluc2VydGVkSWQgfSxcclxuICAgICAgeyBzdGF0dXM6IDIwMSB9XHJcbiAgICApO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdTaWdudXAgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IG1lc3NhZ2U6ICdTb21ldGhpbmcgd2VudCB3cm9uZyEnIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKTtcclxuICB9XHJcbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiaGFzaFBhc3N3b3JkIiwiY29ubmVjdFRvRGF0YWJhc2UiLCJnZW5lcmF0ZU90cCIsInNlbmRFbWFpbCIsIlBPU1QiLCJyZXF1ZXN0IiwibmFtZSIsImVtYWlsIiwicGFzc3dvcmQiLCJqc29uIiwiaW5jbHVkZXMiLCJ0cmltIiwibGVuZ3RoIiwibWVzc2FnZSIsInN0YXR1cyIsImNsaWVudCIsImRiIiwiZXhpc3RpbmdVc2VyIiwiY29sbGVjdGlvbiIsImZpbmRPbmUiLCJoYXNoZWRQYXNzd29yZCIsInJlc3VsdCIsImluc2VydE9uZSIsInZlcmlmaWVkIiwiY3JlYXRlZEF0IiwiRGF0ZSIsIm90cCIsImV4cGlyZXNBdCIsIm5vdyIsInVzZXJJZCIsImluc2VydGVkSWQiLCJzdWJqZWN0IiwidGV4dCIsImh0bWwiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/signup/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n// src/lib/auth.ts\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials) return null;\n                let client;\n                try {\n                    client = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_2__.connectToDatabase)();\n                    const db = client.db();\n                    const user = await db.collection(\"users\").findOne({\n                        email: credentials.email\n                    });\n                    if (!user) {\n                        throw new Error(\"No user found!\");\n                    }\n                    if (user.verified === false) {\n                        throw new Error(\"Email not verified\");\n                    }\n                    const isValid = await verifyPassword(credentials.password, user.password);\n                    if (!isValid) {\n                        throw new Error(\"Invalid password!\");\n                    }\n                    return {\n                        id: user._id.toString(),\n                        email: user.email,\n                        name: user.name\n                    };\n                } catch (error) {\n                    console.error(\"Auth error:\", error);\n                    throw error;\n                }\n            // Don't close client in serverless - let connection pool handle it\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\"\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user.id = token.id;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    }\n};\nasync function hashPassword(password) {\n    return await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.hash)(password, 12);\n}\nasync function verifyPassword(password, hashedPassword) {\n    return await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.compare)(password, hashedPassword);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsa0JBQWtCO0FBQ3VCO0FBRXlCO0FBQ3JCO0FBRXRDLE1BQU1JLGNBQStCO0lBQzFDQyxXQUFXO1FBQ1RILDJFQUFtQkEsQ0FBQztZQUNsQkksTUFBTTtZQUNOQyxhQUFhO2dCQUNYQyxPQUFPO29CQUFFQyxPQUFPO29CQUFTQyxNQUFNO2dCQUFRO2dCQUN2Q0MsVUFBVTtvQkFBRUYsT0FBTztvQkFBWUMsTUFBTTtnQkFBVztZQUNsRDtZQUNBLE1BQU1FLFdBQVVMLFdBQVc7Z0JBQ3pCLElBQUksQ0FBQ0EsYUFBYSxPQUFPO2dCQUV6QixJQUFJTTtnQkFDSixJQUFJO29CQUNGQSxTQUFTLE1BQU1WLDBEQUFpQkE7b0JBQ2hDLE1BQU1XLEtBQUtELE9BQU9DLEVBQUU7b0JBRXBCLE1BQU1DLE9BQU8sTUFBTUQsR0FBR0UsVUFBVSxDQUFDLFNBQVNDLE9BQU8sQ0FBQzt3QkFDaERULE9BQU9ELFlBQVlDLEtBQUs7b0JBQzFCO29CQUVBLElBQUksQ0FBQ08sTUFBTTt3QkFDVCxNQUFNLElBQUlHLE1BQU07b0JBQ2xCO29CQUVBLElBQUlILEtBQUtJLFFBQVEsS0FBSyxPQUFPO3dCQUMzQixNQUFNLElBQUlELE1BQU07b0JBQ2xCO29CQUVBLE1BQU1FLFVBQVUsTUFBTUMsZUFDcEJkLFlBQVlJLFFBQVEsRUFDcEJJLEtBQUtKLFFBQVE7b0JBR2YsSUFBSSxDQUFDUyxTQUFTO3dCQUNaLE1BQU0sSUFBSUYsTUFBTTtvQkFDbEI7b0JBRUEsT0FBTzt3QkFDTEksSUFBSVAsS0FBS1EsR0FBRyxDQUFDQyxRQUFRO3dCQUNyQmhCLE9BQU9PLEtBQUtQLEtBQUs7d0JBQ2pCRixNQUFNUyxLQUFLVCxJQUFJO29CQUNqQjtnQkFDRixFQUFFLE9BQU9tQixPQUFPO29CQUNkQyxRQUFRRCxLQUFLLENBQUMsZUFBZUE7b0JBQzdCLE1BQU1BO2dCQUNSO1lBQ0EsbUVBQW1FO1lBQ3JFO1FBQ0Y7S0FDRDtJQUNERSxTQUFTO1FBQ1BDLFVBQVU7SUFDWjtJQUNBQyxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUVoQixJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUmdCLE1BQU1ULEVBQUUsR0FBR1AsS0FBS08sRUFBRTtZQUNwQjtZQUNBLE9BQU9TO1FBQ1Q7UUFDQSxNQUFNSixTQUFRLEVBQUVBLE9BQU8sRUFBRUksS0FBSyxFQUFFO1lBQzlCLElBQUlBLE9BQU87Z0JBQ1RKLFFBQVFaLElBQUksQ0FBQ08sRUFBRSxHQUFHUyxNQUFNVCxFQUFFO1lBQzVCO1lBQ0EsT0FBT0s7UUFDVDtJQUNGO0lBQ0FLLE9BQU87UUFDTEMsUUFBUTtJQUNWO0FBQ0YsRUFBRTtBQUVLLGVBQWVDLGFBQWF2QixRQUFnQjtJQUNqRCxPQUFPLE1BQU1YLDhDQUFJQSxDQUFDVyxVQUFVO0FBQzlCO0FBRU8sZUFBZVUsZUFDcEJWLFFBQWdCLEVBQ2hCd0IsY0FBc0I7SUFFdEIsT0FBTyxNQUFNbEMsaURBQU9BLENBQUNVLFVBQVV3QjtBQUNqQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Jhbmt0aW1lLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2xpYi9hdXRoLnRzXHJcbmltcG9ydCB7IGhhc2gsIGNvbXBhcmUgfSBmcm9tICdiY3J5cHRqcyc7XHJcbmltcG9ydCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gJ25leHQtYXV0aCc7XHJcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xyXG5pbXBvcnQgeyBjb25uZWN0VG9EYXRhYmFzZSB9IGZyb20gJ0AvbGliL2RiJztcclxuXHJcbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XHJcbiAgICAgIG5hbWU6ICdDcmVkZW50aWFscycsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB7XHJcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6IFwiRW1haWxcIiwgdHlwZTogXCJlbWFpbFwiIH0sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiUGFzc3dvcmRcIiwgdHlwZTogXCJwYXNzd29yZFwiIH1cclxuICAgICAgfSxcclxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscykgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCBjbGllbnQ7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGNsaWVudCA9IGF3YWl0IGNvbm5lY3RUb0RhdGFiYXNlKCk7XHJcbiAgICAgICAgICBjb25zdCBkYiA9IGNsaWVudC5kYigpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBkYi5jb2xsZWN0aW9uKCd1c2VycycpLmZpbmRPbmUoe1xyXG4gICAgICAgICAgICBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwsXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB1c2VyIGZvdW5kIScpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh1c2VyLnZlcmlmaWVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtYWlsIG5vdCB2ZXJpZmllZCcpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSBhd2FpdCB2ZXJpZnlQYXNzd29yZChcclxuICAgICAgICAgICAgY3JlZGVudGlhbHMucGFzc3dvcmQsXHJcbiAgICAgICAgICAgIHVzZXIucGFzc3dvcmRcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXNzd29yZCEnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZDogdXNlci5faWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1dGggZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIERvbid0IGNsb3NlIGNsaWVudCBpbiBzZXJ2ZXJsZXNzIC0gbGV0IGNvbm5lY3Rpb24gcG9vbCBoYW5kbGUgaXRcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgc2Vzc2lvbjoge1xyXG4gICAgc3RyYXRlZ3k6ICdqd3QnLFxyXG4gIH0sXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XHJcbiAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgdG9rZW4uaWQgPSB1c2VyLmlkO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH0sXHJcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5pZCBhcyBzdHJpbmc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlc3Npb247XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGFnZXM6IHtcclxuICAgIHNpZ25JbjogJy9sb2dpbicsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYXNoUGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgcmV0dXJuIGF3YWl0IGhhc2gocGFzc3dvcmQsIDEyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVBhc3N3b3JkKFxyXG4gIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgaGFzaGVkUGFzc3dvcmQ6IHN0cmluZ1xyXG4pOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICByZXR1cm4gYXdhaXQgY29tcGFyZShwYXNzd29yZCwgaGFzaGVkUGFzc3dvcmQpO1xyXG59Il0sIm5hbWVzIjpbImhhc2giLCJjb21wYXJlIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsImNvbm5lY3RUb0RhdGFiYXNlIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwiY2xpZW50IiwiZGIiLCJ1c2VyIiwiY29sbGVjdGlvbiIsImZpbmRPbmUiLCJFcnJvciIsInZlcmlmaWVkIiwiaXNWYWxpZCIsInZlcmlmeVBhc3N3b3JkIiwiaWQiLCJfaWQiLCJ0b1N0cmluZyIsImVycm9yIiwiY29uc29sZSIsInNlc3Npb24iLCJzdHJhdGVneSIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwicGFnZXMiLCJzaWduSW4iLCJoYXNoUGFzc3dvcmQiLCJoYXNoZWRQYXNzd29yZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectToDatabase: () => (/* binding */ connectToDatabase),\n/* harmony export */   \"default\": () => (/* binding */ connectDB)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_1__);\n// src/lib/db.ts\n\n\nif (false) {}\nconst uri = \"mongodb+srv://rafihasan27rafi_db_user:hkP2N5DN9aHTeUK6@ranktimedatabase.jaxuw2l.mongodb.net/?appName=rankTimeDataBase\";\nconst options = {\n    maxPoolSize: 10,\n    serverSelectionTimeoutMS: 5000,\n    socketTimeoutMS: 45000,\n    maxIdleTimeMS: 30000\n};\nlet client;\nlet clientPromise;\nif (true) {\n    // In development mode, use a global variable so that the value\n    // is preserved across module reloads caused by HMR (Hot Module Replacement).\n    if (!global._mongoClientPromise) {\n        client = new mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient(uri, options);\n        global._mongoClientPromise = client.connect();\n    }\n    clientPromise = global._mongoClientPromise;\n} else {}\nasync function connectToDatabase() {\n    try {\n        const client = await clientPromise;\n        return client;\n    } catch (error) {\n        console.error(\"Database connection error:\", error);\n        throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : \"Unknown error\"}`);\n    }\n}\n// Mongoose connection for models — cached on global to avoid multiple connections in serverless\nasync function connectDB() {\n    if (global._mongooseConn) {\n        return global._mongooseConn;\n    }\n    global._mongooseConn = (async ()=>{\n        try {\n            return await mongoose__WEBPACK_IMPORTED_MODULE_1___default().connect(uri);\n        } catch (error) {\n            console.error(\"Mongoose connection error:\", error);\n            global._mongooseConn = undefined;\n            throw error;\n        }\n    })();\n    return global._mongooseConn;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGdCQUFnQjtBQUNzQjtBQUNOO0FBRWhDLElBQUksS0FBd0IsRUFBRSxFQUU3QjtBQUVELE1BQU1NLE1BQU1KLHVIQUF1QjtBQUNuQyxNQUFNSyxVQUFVO0lBQ2RDLGFBQWE7SUFDYkMsMEJBQTBCO0lBQzFCQyxpQkFBaUI7SUFDakJDLGVBQWU7QUFDakI7QUFTQSxJQUFJQztBQUNKLElBQUlDO0FBRUosSUFBSVgsSUFBeUIsRUFBZTtJQUMxQywrREFBK0Q7SUFDL0QsNkVBQTZFO0lBQzdFLElBQUksQ0FBQ1ksT0FBT0MsbUJBQW1CLEVBQUU7UUFDL0JILFNBQVMsSUFBSVosZ0RBQVdBLENBQUNNLEtBQUtDO1FBQzlCTyxPQUFPQyxtQkFBbUIsR0FBR0gsT0FBT0ksT0FBTztJQUM3QztJQUNBSCxnQkFBZ0JDLE9BQU9DLG1CQUFtQjtBQUM1QyxPQUFPLEVBSU47QUFFTSxlQUFlRTtJQUNwQixJQUFJO1FBQ0YsTUFBTUwsU0FBUyxNQUFNQztRQUNyQixPQUFPRDtJQUNULEVBQUUsT0FBT00sT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsOEJBQThCQTtRQUM1QyxNQUFNLElBQUliLE1BQU0sQ0FBQywrQkFBK0IsRUFBRWEsaUJBQWlCYixRQUFRYSxNQUFNRSxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7SUFDOUc7QUFDRjtBQUVBLGdHQUFnRztBQUNqRixlQUFlQztJQUM1QixJQUFJUCxPQUFPUSxhQUFhLEVBQUU7UUFDeEIsT0FBT1IsT0FBT1EsYUFBYTtJQUM3QjtJQUVBUixPQUFPUSxhQUFhLEdBQUcsQ0FBQztRQUN0QixJQUFJO1lBQ0YsT0FBTyxNQUFNckIsdURBQWdCLENBQUNLO1FBQ2hDLEVBQUUsT0FBT1ksT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsOEJBQThCQTtZQUM1Q0osT0FBT1EsYUFBYSxHQUFHQztZQUN2QixNQUFNTDtRQUNSO0lBQ0Y7SUFFQSxPQUFPSixPQUFPUSxhQUFhO0FBQzdCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFua3RpbWUvLi9zcmMvbGliL2RiLnRzPzllNGYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2xpYi9kYi50c1xyXG5pbXBvcnQgeyBNb25nb0NsaWVudCB9IGZyb20gJ21vbmdvZGInO1xyXG5pbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuaWYgKCFwcm9jZXNzLmVudi5NT05HT0RCX1VSSSkge1xyXG4gIHRocm93IG5ldyBFcnJvcignSW52YWxpZC9NaXNzaW5nIGVudmlyb25tZW50IHZhcmlhYmxlOiBcIk1PTkdPREJfVVJJXCInKTtcclxufVxyXG5cclxuY29uc3QgdXJpID0gcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkk7XHJcbmNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgbWF4UG9vbFNpemU6IDEwLFxyXG4gIHNlcnZlclNlbGVjdGlvblRpbWVvdXRNUzogNTAwMCxcclxuICBzb2NrZXRUaW1lb3V0TVM6IDQ1MDAwLFxyXG4gIG1heElkbGVUaW1lTVM6IDMwMDAwLFxyXG59O1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby12YXJcclxuICB2YXIgX21vbmdvQ2xpZW50UHJvbWlzZTogUHJvbWlzZTxNb25nb0NsaWVudD4gfCB1bmRlZmluZWQ7XHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXZhclxyXG4gIHZhciBfbW9uZ29vc2VDb25uOiBQcm9taXNlPHR5cGVvZiBtb25nb29zZT4gfCB1bmRlZmluZWQ7XHJcbn1cclxuXHJcbmxldCBjbGllbnQ6IE1vbmdvQ2xpZW50O1xyXG5sZXQgY2xpZW50UHJvbWlzZTogUHJvbWlzZTxNb25nb0NsaWVudD47XHJcblxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcclxuICAvLyBJbiBkZXZlbG9wbWVudCBtb2RlLCB1c2UgYSBnbG9iYWwgdmFyaWFibGUgc28gdGhhdCB0aGUgdmFsdWVcclxuICAvLyBpcyBwcmVzZXJ2ZWQgYWNyb3NzIG1vZHVsZSByZWxvYWRzIGNhdXNlZCBieSBITVIgKEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQpLlxyXG4gIGlmICghZ2xvYmFsLl9tb25nb0NsaWVudFByb21pc2UpIHtcclxuICAgIGNsaWVudCA9IG5ldyBNb25nb0NsaWVudCh1cmksIG9wdGlvbnMpO1xyXG4gICAgZ2xvYmFsLl9tb25nb0NsaWVudFByb21pc2UgPSBjbGllbnQuY29ubmVjdCgpO1xyXG4gIH1cclxuICBjbGllbnRQcm9taXNlID0gZ2xvYmFsLl9tb25nb0NsaWVudFByb21pc2U7XHJcbn0gZWxzZSB7XHJcbiAgLy8gSW4gcHJvZHVjdGlvbiBtb2RlLCBpdCdzIGJlc3QgdG8gbm90IHVzZSBhIGdsb2JhbCB2YXJpYWJsZS5cclxuICBjbGllbnQgPSBuZXcgTW9uZ29DbGllbnQodXJpLCBvcHRpb25zKTtcclxuICBjbGllbnRQcm9taXNlID0gY2xpZW50LmNvbm5lY3QoKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbm5lY3RUb0RhdGFiYXNlKCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBjbGllbnRQcm9taXNlO1xyXG4gICAgcmV0dXJuIGNsaWVudDtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRGF0YWJhc2UgY29ubmVjdGlvbiBlcnJvcjonLCBlcnJvcik7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjb25uZWN0IHRvIGRhdGFiYXNlOiAke2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ1Vua25vd24gZXJyb3InfWApO1xyXG4gIH1cclxufVxyXG5cclxuLy8gTW9uZ29vc2UgY29ubmVjdGlvbiBmb3IgbW9kZWxzIOKAlCBjYWNoZWQgb24gZ2xvYmFsIHRvIGF2b2lkIG11bHRpcGxlIGNvbm5lY3Rpb25zIGluIHNlcnZlcmxlc3NcclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY29ubmVjdERCKCkge1xyXG4gIGlmIChnbG9iYWwuX21vbmdvb3NlQ29ubikge1xyXG4gICAgcmV0dXJuIGdsb2JhbC5fbW9uZ29vc2VDb25uO1xyXG4gIH1cclxuXHJcbiAgZ2xvYmFsLl9tb25nb29zZUNvbm4gPSAoYXN5bmMgKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIGF3YWl0IG1vbmdvb3NlLmNvbm5lY3QodXJpKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ01vbmdvb3NlIGNvbm5lY3Rpb24gZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgICBnbG9iYWwuX21vbmdvb3NlQ29ubiA9IHVuZGVmaW5lZDtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgcmV0dXJuIGdsb2JhbC5fbW9uZ29vc2VDb25uO1xyXG59Il0sIm5hbWVzIjpbIk1vbmdvQ2xpZW50IiwibW9uZ29vc2UiLCJwcm9jZXNzIiwiZW52IiwiTU9OR09EQl9VUkkiLCJFcnJvciIsInVyaSIsIm9wdGlvbnMiLCJtYXhQb29sU2l6ZSIsInNlcnZlclNlbGVjdGlvblRpbWVvdXRNUyIsInNvY2tldFRpbWVvdXRNUyIsIm1heElkbGVUaW1lTVMiLCJjbGllbnQiLCJjbGllbnRQcm9taXNlIiwiZ2xvYmFsIiwiX21vbmdvQ2xpZW50UHJvbWlzZSIsImNvbm5lY3QiLCJjb25uZWN0VG9EYXRhYmFzZSIsImVycm9yIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJjb25uZWN0REIiLCJfbW9uZ29vc2VDb25uIiwidW5kZWZpbmVkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/email.ts":
/*!**************************!*\
  !*** ./src/lib/email.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generateOtp: () => (/* binding */ generateOtp),\n/* harmony export */   sendEmail: () => (/* binding */ sendEmail)\n/* harmony export */ });\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nodemailer */ \"(rsc)/./node_modules/nodemailer/lib/nodemailer.js\");\n\nconst host = process.env.SMTP_HOST;\nconst port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;\nconst user = process.env.SMTP_USER;\nconst pass = process.env.SMTP_PASS;\nconst from = process.env.FROM_EMAIL || process.env.SMTP_USER;\nif (!host || !port || !user || !pass) {\n    // We don't throw here because dev may not use email sending locally.\n    console.warn(\"SMTP not fully configured. Email sending will fail if attempted.\");\n}\nasync function sendEmail(to, subject, text, html) {\n    if (!host || !port || !user || !pass) {\n        throw new Error(\"SMTP not configured\");\n    }\n    const transporter = nodemailer__WEBPACK_IMPORTED_MODULE_0__.createTransport({\n        host,\n        port,\n        secure: port === 465,\n        auth: {\n            user,\n            pass\n        }\n    });\n    const info = await transporter.sendMail({\n        from,\n        to,\n        subject,\n        text,\n        html\n    });\n    return info;\n}\nfunction generateOtp(length = 6) {\n    const digits = \"0123456789\";\n    let otp = \"\";\n    for(let i = 0; i < length; i++)otp += digits[Math.floor(Math.random() * digits.length)];\n    return otp;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2VtYWlsLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFvQztBQUVwQyxNQUFNQyxPQUFPQyxRQUFRQyxHQUFHLENBQUNDLFNBQVM7QUFDbEMsTUFBTUMsT0FBT0gsUUFBUUMsR0FBRyxDQUFDRyxTQUFTLEdBQUdDLE9BQU9MLFFBQVFDLEdBQUcsQ0FBQ0csU0FBUyxJQUFJRTtBQUNyRSxNQUFNQyxPQUFPUCxRQUFRQyxHQUFHLENBQUNPLFNBQVM7QUFDbEMsTUFBTUMsT0FBT1QsUUFBUUMsR0FBRyxDQUFDUyxTQUFTO0FBQ2xDLE1BQU1DLE9BQU9YLFFBQVFDLEdBQUcsQ0FBQ1csVUFBVSxJQUFJWixRQUFRQyxHQUFHLENBQUNPLFNBQVM7QUFFNUQsSUFBSSxDQUFDVCxRQUFRLENBQUNJLFFBQVEsQ0FBQ0ksUUFBUSxDQUFDRSxNQUFNO0lBQ3BDLHFFQUFxRTtJQUNyRUksUUFBUUMsSUFBSSxDQUFDO0FBQ2Y7QUFFTyxlQUFlQyxVQUFVQyxFQUFVLEVBQUVDLE9BQWUsRUFBRUMsSUFBWSxFQUFFQyxJQUFhO0lBQ3RGLElBQUksQ0FBQ3BCLFFBQVEsQ0FBQ0ksUUFBUSxDQUFDSSxRQUFRLENBQUNFLE1BQU07UUFDcEMsTUFBTSxJQUFJVyxNQUFNO0lBQ2xCO0lBRUEsTUFBTUMsY0FBY3ZCLHVEQUEwQixDQUFDO1FBQzdDQztRQUNBSTtRQUNBb0IsUUFBUXBCLFNBQVM7UUFDakJxQixNQUFNO1lBQ0pqQjtZQUNBRTtRQUNGO0lBQ0Y7SUFFQSxNQUFNZ0IsT0FBTyxNQUFNSixZQUFZSyxRQUFRLENBQUM7UUFDdENmO1FBQ0FLO1FBQ0FDO1FBQ0FDO1FBQ0FDO0lBQ0Y7SUFFQSxPQUFPTTtBQUNUO0FBRU8sU0FBU0UsWUFBWUMsU0FBUyxDQUFDO0lBQ3BDLE1BQU1DLFNBQVM7SUFDZixJQUFJQyxNQUFNO0lBQ1YsSUFBSyxJQUFJQyxJQUFJLEdBQUdBLElBQUlILFFBQVFHLElBQUtELE9BQU9ELE1BQU0sQ0FBQ0csS0FBS0MsS0FBSyxDQUFDRCxLQUFLRSxNQUFNLEtBQUtMLE9BQU9ELE1BQU0sRUFBRTtJQUN6RixPQUFPRTtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmFua3RpbWUvLi9zcmMvbGliL2VtYWlsLnRzPzRjMTgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5vZGVtYWlsZXIgZnJvbSAnbm9kZW1haWxlcic7XHJcblxyXG5jb25zdCBob3N0ID0gcHJvY2Vzcy5lbnYuU01UUF9IT1NUO1xyXG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuU01UUF9QT1JUID8gTnVtYmVyKHByb2Nlc3MuZW52LlNNVFBfUE9SVCkgOiB1bmRlZmluZWQ7XHJcbmNvbnN0IHVzZXIgPSBwcm9jZXNzLmVudi5TTVRQX1VTRVI7XHJcbmNvbnN0IHBhc3MgPSBwcm9jZXNzLmVudi5TTVRQX1BBU1M7XHJcbmNvbnN0IGZyb20gPSBwcm9jZXNzLmVudi5GUk9NX0VNQUlMIHx8IHByb2Nlc3MuZW52LlNNVFBfVVNFUjtcclxuXHJcbmlmICghaG9zdCB8fCAhcG9ydCB8fCAhdXNlciB8fCAhcGFzcykge1xyXG4gIC8vIFdlIGRvbid0IHRocm93IGhlcmUgYmVjYXVzZSBkZXYgbWF5IG5vdCB1c2UgZW1haWwgc2VuZGluZyBsb2NhbGx5LlxyXG4gIGNvbnNvbGUud2FybignU01UUCBub3QgZnVsbHkgY29uZmlndXJlZC4gRW1haWwgc2VuZGluZyB3aWxsIGZhaWwgaWYgYXR0ZW1wdGVkLicpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZEVtYWlsKHRvOiBzdHJpbmcsIHN1YmplY3Q6IHN0cmluZywgdGV4dDogc3RyaW5nLCBodG1sPzogc3RyaW5nKSB7XHJcbiAgaWYgKCFob3N0IHx8ICFwb3J0IHx8ICF1c2VyIHx8ICFwYXNzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NNVFAgbm90IGNvbmZpZ3VyZWQnKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHRyYW5zcG9ydGVyID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xyXG4gICAgaG9zdCxcclxuICAgIHBvcnQsXHJcbiAgICBzZWN1cmU6IHBvcnQgPT09IDQ2NSwgLy8gdHJ1ZSBmb3IgNDY1LCBmYWxzZSBmb3Igb3RoZXIgcG9ydHNcclxuICAgIGF1dGg6IHtcclxuICAgICAgdXNlcixcclxuICAgICAgcGFzcyxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGluZm8gPSBhd2FpdCB0cmFuc3BvcnRlci5zZW5kTWFpbCh7XHJcbiAgICBmcm9tLFxyXG4gICAgdG8sXHJcbiAgICBzdWJqZWN0LFxyXG4gICAgdGV4dCxcclxuICAgIGh0bWwsXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBpbmZvO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVPdHAobGVuZ3RoID0gNikge1xyXG4gIGNvbnN0IGRpZ2l0cyA9ICcwMTIzNDU2Nzg5JztcclxuICBsZXQgb3RwID0gJyc7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykgb3RwICs9IGRpZ2l0c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkaWdpdHMubGVuZ3RoKV07XHJcbiAgcmV0dXJuIG90cDtcclxufVxyXG4iXSwibmFtZXMiOlsibm9kZW1haWxlciIsImhvc3QiLCJwcm9jZXNzIiwiZW52IiwiU01UUF9IT1NUIiwicG9ydCIsIlNNVFBfUE9SVCIsIk51bWJlciIsInVuZGVmaW5lZCIsInVzZXIiLCJTTVRQX1VTRVIiLCJwYXNzIiwiU01UUF9QQVNTIiwiZnJvbSIsIkZST01fRU1BSUwiLCJjb25zb2xlIiwid2FybiIsInNlbmRFbWFpbCIsInRvIiwic3ViamVjdCIsInRleHQiLCJodG1sIiwiRXJyb3IiLCJ0cmFuc3BvcnRlciIsImNyZWF0ZVRyYW5zcG9ydCIsInNlY3VyZSIsImF1dGgiLCJpbmZvIiwic2VuZE1haWwiLCJnZW5lcmF0ZU90cCIsImxlbmd0aCIsImRpZ2l0cyIsIm90cCIsImkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/email.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/bcryptjs","vendor-chunks/nodemailer"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsignup%2Froute&page=%2Fapi%2Fauth%2Fsignup%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsignup%2Froute.ts&appDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Crafi2%5CRank%20Time%20(Vibe)%5Cranktime&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();