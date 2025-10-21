const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await listing.find();
    res.render("./listings/index.ejs", { allListings });
}

module.exports.trending = async(req,res)=>{
    const trendingListings = await listing.find({ category: "trending" });
    res.render("./listings/trending.ejs", {trendingListings});
}

module.exports.iconicCities = async(req,res)=>{
    const cities = await listing.find({ category: "iconic cities" });
    res.render("./listings/city.ejs", {cities});
}

module.exports.castles = async(req,res)=>{
    const castles = await listing.find({ category: "castles" });
    res.render("./listings/castle.ejs", {castles});
}

module.exports.camps = async(req,res)=>{
    const camps = await listing.find({ category: "camping" });
    res.render("./listings/camps.ejs", {camps});
}

module.exports.farms = async(req,res)=>{
    const farms = await listing.find({ category: "farms" });
    res.render("./listings/farms.ejs", {farms});
}

module.exports.mountains = async(req,res)=>{
    const mountains = await listing.find({ category: "mountains" });
    res.render("./listings/mountains.ejs", {mountains});
}

module.exports.arctic = async(req,res)=>{
    const arctics = await listing.find({ category: "arctic" });
    res.render("./listings/arctic.ejs", {arctics});
}

module.exports.newForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const infoListing = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!infoListing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("./listings/show.ejs", { infoListing });
    }
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new listing(req.body.listings);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const infoListing = await listing.findById(id);
    if (!infoListing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        let ogImgUrl = infoListing.image.url;
        ogImgUrl = ogImgUrl.replace("/upload", "/upload/h_100,w_250,e_blur:300");
        res.render("./listings/edit.ejs", { infoListing, ogImgUrl });
    }
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let updatedListing = await listing.findByIdAndUpdate(id, { ...req.body.listings });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}

module.exports.search = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.trim() === "") {
            req.flash("error", "Please enter a search term.");
            return res.redirect("/listings");
        }

        const regex = new RegExp(query, "i");
        const searchInp = await listing.find({
            $or: [{ title: regex }, { location: regex }, {country: regex}]
        });

        if(searchInp.length === 0){
            req.flash("error", "No listings found.");
            res.redirect("/listings");
        }else{
            res.render("./listings/searchResults.ejs", { searchInp, query });
        }
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while searching.");
        res.redirect("/listings");
    }
}

