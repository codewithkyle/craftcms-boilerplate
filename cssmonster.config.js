module.exports = {
	outDir: "_css",
	sources: ["./templates", "./brixi/src"],
	minify: true,
	purge: false,
	blacklist: ["./templates/frameworks"],
	purgeCSS: {
		content: ["./templates/**/*.twig"],
	},
};
