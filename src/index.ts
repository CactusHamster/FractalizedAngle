let LEVELS = 10;
let SCALE_MODIFIER = 0.7;
let COLORS: string[] = Array(LEVELS).fill(0).map((_,i) => {
    let frequency = Math.PI*2/LEVELS;
    let color = [ 0, 2, 4 ].map(c => (Math.sin(frequency * i + c) * 127.5 + 127.5) * 1.5)
    return `rgb(${color.join(", ")})`
})

type coord = [ number, number ];
let line = (ctx: CanvasRenderingContext2D | null, p1: coord, p2: coord): void => {
    if (ctx == null) throw new Error("bad ctx");
    ctx.beginPath();
    ctx.moveTo(...p1);
    ctx.lineTo(...p2);
    ctx.stroke();
}
const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("invalid canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.style.position = "absolute";
const ctx = canvas.getContext("2d");
if (ctx === null) throw new Error("failed to create 2d context");

interface Branch {
    angle: number,
    length: number,
    x: number,
    y: number,
}

let branchs: Branch[] = [{
    angle: -Math.PI/2,
    length: 120,
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
}, {
    angle: -Math.PI/2,
    length: 120,
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
}]

// basically just implement a function to draw two branchs at a certain starting point
// and then recurse at the end of the two branchs you just drew
function recurse (ctx: CanvasRenderingContext2D, branchs: Branch[], levels: number) {
    // this should be iterating infinitely... right?
    function iterate (branch: Branch, scale: number, level: number) {
        let { x, y, angle, length } = branch;
        let p1: coord = [ x, y ];
        let l = scale*length;
        let p2: coord = [ p1[0] + l*Math.cos(angle), p1[1] + l*Math.sin(angle) ];
        //if (!colors[level]) colors[level] = `rgb(${255 * (level / levels)}, 0, 255)`
        ctx.strokeStyle = COLORS[level]
        line(ctx, p1, p2);
        if (level < levels) branchs.forEach((branch) => iterate({ x: p2[0], y: p2[1], angle: branch.angle + angle, length: branch.length }, SCALE_MODIFIER * scale, level + 1))
    }
    branchs.forEach(branch => iterate(branch, 1, 0));
}

function doclock () {
    // minute hand (time until next hour / time in an hour)
    let hourTime = 60 * 60 * 1000
    branchs[0].angle = ((hourTime - new Date().getTime() % hourTime) / hourTime) * 2 * Math.PI;
    // hour hand
    let halfDayTime = (24/2) * hourTime
    branchs[1].angle = ((halfDayTime - new Date().getTime() % halfDayTime) / halfDayTime) * 2 * Math.PI
    // second hand
    let secondTime = 10000
    branchs[2].angle = ((secondTime - new Date().getTime() % secondTime) / secondTime) * 2 * Math.PI
}

function draw () {
    if (ctx === null) throw new Error("broken context");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    branchs.forEach((branch, i) => branch.angle += (0.005 * (i+1)))
    recurse(ctx, branchs, LEVELS);
}

function reinitCanvas () {
    if (ctx == null) throw new Error("bad ctx")
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    branchs.forEach(branch => {
        branch.x = ctx.canvas.width / 2
        branch.y = ctx.canvas.height / 2
        let len = 0;
        for (let i = 0; i <= LEVELS; i++) len += SCALE_MODIFIER**i
        len = Math.min(ctx.canvas.width, ctx.canvas.height) / (len*2)
        branch.length = len;
    })
}

window.addEventListener("resize", reinitCanvas)
window.addEventListener("load", reinitCanvas, { once: true })

let delay = (ms: number) => new Promise(res => setTimeout(res, ms));
let getFrame = () => new Promise(res => requestAnimationFrame(res));
;(async function loop (): Promise<void> {
    while (true) {
        draw();
        await delay(30);
        await getFrame();
    }
})();