const express = require("express");
const router = express.Router();
const Digestate = require("../models/Digestate");

// Create a listing
router.post("/", async (req, res) => {
    try {
        const newListing = new Digestate(req.body);
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all listings
router.get("/", async (req, res) => {
    try {
        const listings = await Digestate.find();
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
