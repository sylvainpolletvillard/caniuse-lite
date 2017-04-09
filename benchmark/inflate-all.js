const fs = require("fs");
const zlib = require("mz/zlib");
const glob = require("glob");

glob("data/**/*.zz", {}, function (err, files) {
	//console.log(files);
	files = files.map(file => fs.readFileSync(file));

	console.time("inflate all");
	Promise.all(files.map(file => zlib.inflate(file))).then(() => {
		console.timeEnd("inflate all");
	});
})