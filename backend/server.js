require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("DB Connection Error:", err));

const ListingSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    price: Number,
    lat: Number,
    lng: Number
});
const Listing = mongoose.model("Listing", ListingSchema);

app.post("/listings", async (req, res) => {
    try {
        const { title, description, location, price } = req.body;

        // ✅ 1. Ensure location is provided
        if (!location || location.trim() === "") {
            return res.status(400).json({ message: "Location is required" });
        }

        console.log("🔍 Fetching geocode for location:", location); // ✅ Debugging

        const geoRes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: { address: location, key: process.env.GOOGLE_MAPS_API_KEY }
        });

        console.log("🌍 Geocode API Response:", JSON.stringify(geoRes.data, null, 2)); // ✅ Debugging

        // ✅ 2. Ensure a valid location is returned
        if (!geoRes.data.results || geoRes.data.results.length === 0) {
            return res.status(400).json({ message: "Invalid location" });
        }

        const { lat, lng } = geoRes.data.results[0].geometry.location;
        console.log(`✅ Coordinates found: Lat=${lat}, Lng=${lng}`);

        // ✅ 3. Save the listing
        const newListing = new Listing({ title, description, location, price, lat, lng });
        await newListing.save();

        io.emit("new-listing", newListing);
        res.json({ success: true, data: newListing });

    } catch (error) {
        console.error("❌ Error adding listing:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/listings", async (req, res) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(process.env.PORT || 5000, () => console.log("Server running"));
