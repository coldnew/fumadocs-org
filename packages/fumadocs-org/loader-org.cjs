module.exports = function loader(code) {
  const callback = this.async();

  import('./dist/loaders/org.js').then((mod) =>
    mod.default.call(this, code, callback),
  );
};
