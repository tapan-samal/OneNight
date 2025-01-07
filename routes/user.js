const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middleware.js");
const {
  renderSignupForm,
  signup,
  renderLoginForm,
  login,
  logout,
} = require("../controllers/user.js");

const router = express.Router();

//Signup routing
router.route("/signup").get(renderSignupForm).post(wrapAsync(signup));

//Login routing
router.route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

//Logout routing
router.get("/logout", logout);

module.exports = router;
