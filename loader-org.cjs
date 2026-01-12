module.exports = function loader(code) {
  const callback = this.async();

  let orgLoader;
  try {
    orgLoader = require('./dist/loaders/org.js');
  } catch (e) {
    callback(e);
    return;
  }

  // Handle both ESM default export and CommonJS module.exports
  const loaderFn = orgLoader.default || orgLoader;

  if (typeof loaderFn === 'function') {
    loaderFn.call(this, code, callback);
  } else {
    callback(new Error('Org loader is not a function'));
  }
};
