module.exports = function parseVErr(err, req) {
  for (const key in err.errors) {
    if (err.errors[key].message) {
      req.flash("error", err.errors[key].message);
    }
  }
};