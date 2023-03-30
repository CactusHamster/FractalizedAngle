"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var LEVELS = 10;
var SCALE_MODIFIER = 0.7;
var COLORS = Array(LEVELS).fill(0).map(function (_, i) {
    var frequency = Math.PI * 2 / LEVELS;
    var color = [0, 2, 4].map(function (c) { return (Math.sin(frequency * i + c) * 127.5 + 127.5) * 1.5; });
    return "rgb(".concat(color.join(", "), ")");
});
var line = function (ctx, p1, p2) {
    if (ctx == null)
        throw new Error("bad ctx");
    ctx.beginPath();
    ctx.moveTo.apply(ctx, p1);
    ctx.lineTo.apply(ctx, p2);
    ctx.stroke();
};
var canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement))
    throw new Error("invalid canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.style.position = "absolute";
var ctx = canvas.getContext("2d");
if (ctx === null)
    throw new Error("failed to create 2d context");
var branchs = [{
        angle: -Math.PI / 2,
        length: 120,
        x: ctx.canvas.width / 2,
        y: ctx.canvas.height / 2,
    }, {
        angle: -Math.PI / 2,
        length: 120,
        x: ctx.canvas.width / 2,
        y: ctx.canvas.height / 2,
    }];
// basically just implement a function to draw two branchs at a certain starting point
// and then recurse at the end of the two branchs you just drew
function recurse(ctx, branchs, levels) {
    // this should be iterating infinitely... right?
    function iterate(branch, scale, level) {
        var x = branch.x, y = branch.y, angle = branch.angle, length = branch.length;
        var p1 = [x, y];
        var l = scale * length;
        var p2 = [p1[0] + l * Math.cos(angle), p1[1] + l * Math.sin(angle)];
        //if (!colors[level]) colors[level] = `rgb(${255 * (level / levels)}, 0, 255)`
        ctx.strokeStyle = COLORS[level];
        line(ctx, p1, p2);
        if (level < levels)
            branchs.forEach(function (branch) { return iterate({ x: p2[0], y: p2[1], angle: branch.angle + angle, length: branch.length }, SCALE_MODIFIER * scale, level + 1); });
    }
    branchs.forEach(function (branch) { return iterate(branch, 1, 0); });
}
function doclock() {
    // minute hand (time until next hour / time in an hour)
    var hourTime = 60 * 60 * 1000;
    branchs[0].angle = ((hourTime - new Date().getTime() % hourTime) / hourTime) * 2 * Math.PI;
    // hour hand
    var halfDayTime = (24 / 2) * hourTime;
    branchs[1].angle = ((halfDayTime - new Date().getTime() % halfDayTime) / halfDayTime) * 2 * Math.PI;
    // second hand
    var secondTime = 10000;
    branchs[2].angle = ((secondTime - new Date().getTime() % secondTime) / secondTime) * 2 * Math.PI;
}
function draw() {
    if (ctx === null)
        throw new Error("broken context");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    branchs.forEach(function (branch, i) { return branch.angle += (0.005 * (i + 1)); });
    recurse(ctx, branchs, LEVELS);
}
function reinitCanvas() {
    if (ctx == null)
        throw new Error("bad ctx");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    branchs.forEach(function (branch) {
        branch.x = ctx.canvas.width / 2;
        branch.y = ctx.canvas.height / 2;
        var len = 0;
        for (var i = 0; i <= LEVELS; i++)
            len += Math.pow(SCALE_MODIFIER, i);
        len = Math.min(ctx.canvas.width, ctx.canvas.height) / (len * 2);
        branch.length = len;
    });
}
window.addEventListener("resize", reinitCanvas);
window.addEventListener("load", reinitCanvas, { once: true });
var delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
var getFrame = function () { return new Promise(function (res) { return requestAnimationFrame(res); }); };
;
(function loop() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 3];
                    draw();
                    return [4 /*yield*/, delay(30)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getFrame()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
})();
