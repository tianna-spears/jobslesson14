const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  registerShow,
  registerDo,
  logonShow,
  logoff,
} = require("../controllers/session");

// Show registration form
router.get("/register", registerShow);

// Handle registration submission
router.post("/register", registerDo);

// Show login form
router.get("/logon", logonShow);

// Handle login form submission with passport local strategy
router.post(
  "/logon",
  passport.authenticate("local", {
    successRedirect: "/jobs",
    failureRedirect: "/sessions/logon",
    failureFlash: true,
  })
);

// Handle logout
router.post("/logoff", logoff);

module.exports = router;
