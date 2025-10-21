const mongoose = require('mongoose');
const review = require('./review');
const { object } = require('joi');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["trending", "iconic cities", "castles", "camping", "farms", "mountains", "arctic"],
    }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await review.deleteMany({_id:{$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;