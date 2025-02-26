import React, { useEffect, useState } from "react";
import axios from "axios";

const Listings = ({ onLocationSelect }) => {
    const [listings, setListings] = useState([]);
    const [hiddenListings, setHiddenListings] = useState(new Set());
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Function to fetch listings
    const fetchListings = async () => {
        try {
            const response = await axios.get("http://localhost:5000/listings");
            setListings(response.data);
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    };

    // Fetch listings on component mount
    useEffect(() => {
        fetchListings();
        
        // Listen for new listings in real time (if backend supports it)
        const interval = setInterval(fetchListings, 5000); // Polling every 5 seconds
        return () => clearInterval(interval); // Cleanup
    }, []);

    const getAddressFrom = async (lat, long) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${API_KEY}`
            );

            if (response.data.error_message) {
                console.log(response.data.error_message);
            } else {
                console.log(response.data.results[0].formatted_address);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const getCoordinates = async (location) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`
            );

            if (response.data.status === "OK") {
                const { lat, lng } = response.data.results[0].geometry.location;
                console.log(`Coordinates for ${location}:`, lat, lng);
                onLocationSelect({ lat, lng });

                await getAddressFrom(lat, lng);
            } else {
                console.error(`Geocoding API error: ${response.data.status}`);
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    const handleRemoveListing = (id) => {
        setHiddenListings((prevHidden) => new Set([...prevHidden, id]));
    };

    return (
        <div className="mt-6 p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-3">Available Listings</h2>
            {listings.length === 0 ? (
                <p className="text-gray-500">No listings available</p>
            ) : (
                <ul className="space-y-3">
                    {listings.map((listing, index) => (
                        !hiddenListings.has(listing.id || index) && (
                            <li key={listing.id || index} className="p-3 bg-gray-200 rounded flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{listing.title}</h3>
                                    <p>{listing.location}</p>
                                    <p><strong>Price:</strong> ${listing.price}</p> {/* ✅ Added price field */}

                                    {/* ✅ Contact Seller Button */}
                                    <a href={`mailto:${listing.email}`}>
                                        <button className="bg-green-500 text-white px-3 py-1 mt-2 rounded">
                                            Contact Seller
                                        </button>
                                    </a>

                                    <button
                                        className="text-blue-500 underline mt-1 ml-2"
                                        onClick={() => getCoordinates(listing.location)}
                                    >
                                        View on Map
                                    </button>
                                </div>
                                <button
                                    className="text-red-500 text-lg font-bold ml-4"
                                    onClick={() => handleRemoveListing(listing.id || index)}
                                >
                                    ❌
                                </button>
                            </li>
                        )
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Listings;
