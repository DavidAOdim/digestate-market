import React, { useState } from "react";
import axios from "axios";

const AddListing = ({ onListingAdded }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        price: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { title, description, location, price } = formData;
            
            const response = await axios.post("http://localhost:5000/listings", 
                { title, description, location, price }, 
                { headers: { "Content-Type": "application/json" } }
            );

            onListingAdded(response.data.data);
            setFormData({ title: "", description: "", location: "", price: "" });
        } catch (error) {
            console.error("Error adding listing:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-3">Add a Digestate Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Product Name"
                    className="w-full p-2 border rounded"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location (City, State)"
                    className="w-full p-2 border rounded"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price (USD)"
                    className="w-full p-2 border rounded"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit Listing
                </button>
            </form>
        </div>
    );
};

export default AddListing;
