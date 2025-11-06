module.exports = function loader(code) {
  const callback = this.async();

  import('./dist/loaders/org.js')
    .then((mod) => {
      // Extract the actual loader function
      let loaderFn = mod.default || mod;

      // Handle nested default export: { default: () => loader }
      if (loaderFn && typeof loaderFn === 'object' && loaderFn.default) {
        loaderFn = loaderFn.default;
      }

      // At this point, loaderFn should be the actual loader function
      if (typeof loaderFn !== 'function') {
        callback(new Error('Loader function not found'));
        return;
      }

      // Call the actual loader function with the proper context and source code
      const result = loaderFn.call(this, code);

      // If the loader returns a value (synchronous mode), pass it to callback
      if (typeof result !== 'undefined') {
        callback(null, result);
      }
      // If loader doesn't return anything, it should handle callback internally
    })
    .catch((error) => {
      callback(error);
    });
};
