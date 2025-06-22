const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect("/sessions/logon");
};

module.exports = requireAuth;
