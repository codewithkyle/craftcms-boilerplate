module.exports = {
    outDir: "_css",
    sources: ["./templates"],
    minify: true,
    purge: true,
    blacklist: ["./templates/frameworks"],
    purgeCSS: {
        content: ["./templates/**/*.twig"],
    },
};