module.exports = {
	src: ["./_compiled", "./_css"],
	noCachePattern: /(\/webmaster\/)|(\/cpresources\/)|(index\.php)|(cachebust\.js)|(\/pwa\/)|(\.json)$/gi,
	cachebustURL: "/pwa/cachebust.json",
	usePercentage: true,
};
