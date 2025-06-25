import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LocationHandler = () => {
  const [location, setLocation] = useState({ lat: null, lon: null, zip: "", place: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            zip: "",
            place: ""
          });
          navigate("/jobs", { state: { location: { lat: position.coords.latitude, lon: position.coords.longitude } } });
        },
        (err) => {
          setError("Location access denied. Please enter your zip code or place name.");
        }
      );
    } else {
      setError("Geolocation is not supported. Please enter your zip code or place name.");
    }
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (location.zip) {
      navigate("/jobs", { state: { location: { zip: location.zip } } });
    } else if (location.place) {
      navigate("/jobs", { state: { location: { place: location.place } } });
    } else {
      setError("Please enter a valid zip code or place name.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Set Your Location</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          onClick={handleGeolocation}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-green-700 mb-4"
        >
          Use My Current Location
        </button>
        <form onSubmit={handleZipSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Zip Code"
            value={location.zip}
            onChange={(e) => setLocation({ ...location, zip: e.target.value, place: "" })}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
          />
          <div className="text-gray-500">or</div>
          <input
            type="text"
            placeholder="Enter Place Name (e.g. Sanpada, Navi Mumbai, India)"
            value={location.place}
            onChange={(e) => setLocation({ ...location, place: e.target.value, zip: "" })}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-green-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocationHandler;
