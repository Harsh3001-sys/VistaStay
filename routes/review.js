const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {ValidateReview, isLoggedIn, isOwner, isAuthor} = require("../middlewear.js")
const reviewController = require("../controllers/review.js");

// review
router.post("/", isLoggedIn,ValidateReview, wrapAsync(reviewController.createReview))

// review delete
router.delete("/:reviewID", isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;