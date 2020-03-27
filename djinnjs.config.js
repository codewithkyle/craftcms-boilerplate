module.exports = {
	src: ["./_compiled", "./_css", "./web_modules"],
	noCachePattern: /(\/webmaster\/)|(\/cpresources\/)|(index\.php)|(cachebust\.js)|(\/pwa\/)|(\.json)$/gi,
	cachebustURL: "/pwa/cachebust.json",
	usePercentage: true,
};
