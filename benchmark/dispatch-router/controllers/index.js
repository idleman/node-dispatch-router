module.exports = (function () {
  return {
    get: function () {
      this.Response.end('test');
    }
  };
})();