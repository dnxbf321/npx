module.exports = function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
