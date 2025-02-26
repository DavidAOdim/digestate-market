import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DigestateMarket() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/digestate")
            .then(response => setListings(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Digestate Marketplace</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((item, index) => (
                    <div key={index} className="p-4 border rounded shadow">
                        <p><strong>Owner:</strong> {item.owner}</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Quantity:</strong> {item.quantity} tons</p>
                        <p><strong>Price:</strong> ${item.price}/ton</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
