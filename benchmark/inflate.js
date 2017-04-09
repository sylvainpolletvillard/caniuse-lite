const fs = require("fs");
const zlib = require("zlib");

const file = fs.readFileSync("data/agents.js.zz")
console.time("inflate");
zlib.inflateSync(file);
console.timeEnd("inflate");