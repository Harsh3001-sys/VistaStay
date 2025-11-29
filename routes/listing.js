const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, ValidateListing } = require("../middlewear.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,ValidateListing,upload.single("listings[image]"),wrapAsync(listingController.createListing));

// new listings route
router.get("/new",isLoggedIn,listingController.newForm);


// search
router.get("/search",wrapAsync(listingController.search));

// trnding
router.get("/trending",wrapAsync(listingController.trending));

// Iconic cities
router.get("/cities",wrapAsync(listingController.iconicCities));

// castle
router.get("/castle",wrapAsync(listingController.castles));

// camps
router.get("/camps",wrapAsync(listingController.camps));

// farms
router.get("/farms",wrapAsync(listingController.farms));

// mountains
router.get("/mountains",wrapAsync(listingController.mountains));

// arctic
router.get("/arctic",wrapAsync(listingController.arctic));

// privacy
router.get("/privacy",wrapAsync(listingController.privacy));

// terms
router.get("/terms",wrapAsync(listingController.terms));

router
.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(ValidateListing,isLoggedIn,isOwner,upload.single("listings[image]"),wrapAsync(listingController.updateListing))
.delete( isLoggedIn,isOwner,wrapAsync(listingController.destroy))


// edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editForm));


module.exports = router;