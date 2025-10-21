const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createReview = async(req,res) =>{
    let Listings = await listing.findById(req.params.id);
    let newReviews = new review(req.body.review);
    newReviews.author = req.user._id;
    await Listings.reviews.push(newReviews);

    await newReviews.save();
    await Listings.save();
    req.flash("success", "New Review created successfully!");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewID} = req.params;

    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await review.findByIdAndDelete(reviewID);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}