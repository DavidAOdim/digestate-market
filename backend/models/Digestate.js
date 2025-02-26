const mongoose = require("mongoose");

const DigestateSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: Number, required: true },  // in tons
    price: { type: Number, required: true },      // price per ton
    lat: { type: Number, required: true },        // latitude
    lng: { type: Number, required: true }         // longitude
});

module.exports = mongoose.model("Digestate", DigestateSchema);
