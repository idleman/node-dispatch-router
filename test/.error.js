// Only invoked in case 

var assert = require('assert');

module.exports = (function () {
  //can either
  return {
    404: function () {
      res.end(404);
    },
    500: function() {
      res.end(404);
    }
  };
})();