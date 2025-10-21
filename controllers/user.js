const userModel = require("../models/user.js");

module.exports.renderSignupForm = async (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new userModel({ email, username });
        const registeredUser = await userModel.register(newUser, password);
        console.log(registeredUser);
        req.logIn(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Welcome ${username}`);
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = async (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back on Wanderlust");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
}