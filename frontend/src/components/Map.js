import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const libraries = ["places"]; // ✅ Moved outside component to prevent re-renders

const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
};

const defaultCenter = { lat: 29.7604, lng: -95.3698 }; // Houston, TX

const Map = ({ locations }) => {
    const [directions, setDirections] = useState(null);

    useEffect(() => {
        if (locations.length >= 2) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: locations[0],
                    destination: locations[locations.length - 1],
                    waypoints: locations.slice(1, -1).map((loc) => ({ location: loc, stopover: true })),
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error("Error fetching directions: ", status);
                    }
                }
            );
        }
    }, [locations]);

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
            <GoogleMap 
                mapContainerStyle={mapContainerStyle} 
                center={locations.length > 0 ? locations[0] : defaultCenter} 
                zoom={10}
            >
                {locations.map((location, index) => (
                    <Marker key={index} position={location} />
                ))}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
