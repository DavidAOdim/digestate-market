import React, { useState, useEffect } from "react"; 
import AddListing from "./components/AddListing";
import Listings from "./components/Listings";
import Map from "./components/Map";
import axios from "axios";

function App() {
    const [listings, setListings] = useState([]);
    const [locations, setLocations] = useState([]);

    // Fetch listings when the component mounts
    useEffect(() => {
        fetchListings();

        // Poll for updates every 5 seconds
        const interval = setInterval(fetchListings, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchListings = async () => {
        try {
            const response = await axios.get("http://localhost:5000/listings");
            setListings(response.data);
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    };

    const handleListingAdded = async (newListing) => {
        setListings((prevListings) => [...prevListings, newListing]);
        await convertAddressToCoordinates(newListing.location);
    };

    const convertAddressToCoordinates = async (address) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json`,
                {
                    params: {
                        address: address,
                        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                    },
                }
            );

            const { results } = response.data;
            if (results.length > 0) {
                const { lat, lng } = results[0].geometry.location;
                setLocations((prevLocations) => [...prevLocations, { lat, lng }]);
            } else {
                console.error("No location data found for:", address);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            {/* Header Section */}
            <div className="flex justify-start items-center w-full max-w-6xl mb-6">
                <div className="bg-green-500 text-white p-4 rounded-lg font-semibold text-3xl mr-4">
                    Ecosix
                </div>
                <h1 className="text-4xl font-bold text-gray-800">Digestate Marketplace</h1>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div>
                    <AddListing onListingAdded={handleListingAdded} />
                    <Listings listings={listings} onLocationSelect={convertAddressToCoordinates} />
                </div>
                <Map locations={locations} />
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4 text-center mt-6 w-full">
                <p>&copy; 2025 Ecosix. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
