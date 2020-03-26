module.exports = {
	outDir: "_css",
	sources: ["./templates", "./brixi/src"],
	minify: true,
	purge: true,
	blacklist: ["./templates/frameworks"],
	purgeCSS: {
		content: ["./templates/**/*.twig"],
	},
};
