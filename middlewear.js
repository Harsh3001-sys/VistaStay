const listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveDirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let list = await listing.findById(id);
    if (!list.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You dont have access to Edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.ValidateListing = (req, res, next) =>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

module.exports.ValidateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    let rev = await review.findById(reviewID);
    if (!rev.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
