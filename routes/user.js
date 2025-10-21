const express = require("express");
const router = express.Router();
const passport = require("passport");
const {saveDirectUrl} = require("../middlewear.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);


router.
route("/login")
.get(userController.renderLoginForm)
.post(saveDirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout)

module.exports = router;