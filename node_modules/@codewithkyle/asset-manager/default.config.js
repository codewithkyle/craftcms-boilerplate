module.exports = {
    src: [
        {
            files: "./public/js/*.js",
            publicDir: "/js"
        },
        {
            files: "./public/css/*.css",
            publicDir: "/css"
        }
    ],
    output: "./public/service-worker-assets.js",
};