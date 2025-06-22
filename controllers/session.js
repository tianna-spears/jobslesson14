const User = require("../models/User");
const parseVErr = require("../util/parseValidationErrors");

const registerShow = (req, res) => {
  res.render("register", { errors: req.flash("error"), csrfToken: req.csrfToken() });
};

const registerDo = async (req, res, next) => {
  const { name, email, password, password1 } = req.body;
  if (password !== password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { errors: req.flash("error"), csrfToken: req.csrfToken() });
  }

  try {
    const newUser = await User.create({ name, email, password });
    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.redirect("/jobs");
    });
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register", { errors: req.flash("error"), csrfToken: req.csrfToken() });
  }
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/jobs");
  }
  res.render("logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
    csrfToken: req.csrfToken()
  });
};

const logoff = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/sessions/logon");
  });
};

module.exports = {
  registerShow,
  registerDo,
  logonShow,
  logoff,
};
