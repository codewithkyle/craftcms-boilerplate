(() => {
    import('./runtime.js').then((module) => {
        module.runtime.init();
    });
})();