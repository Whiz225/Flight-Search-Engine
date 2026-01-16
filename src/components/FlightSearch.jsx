import React, { useState } from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaUser,
  FaSearch,
  FaExchangeAlt,
} from "react-icons/fa";

const FlightSearch = ({ onSearch, initialParams }) => {
  const [searchParams, setSearchParams] = useState({
    origin: initialParams.origin || "JFK",
    destination: initialParams.destination || "LAX",
    departureDate:
      initialParams.departureDate || new Date().toISOString().split("T")[0],
    returnDate:
      initialParams.returnDate ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    passengers: initialParams.passengers || 1,
    travelClass: initialParams.travelClass || "ECONOMY",
  });

  const airports = [
    { code: "JFK", name: "New York (JFK)" },
    { code: "LAX", name: "Los Angeles (LAX)" },
    { code: "ORD", name: "Chicago (ORD)" },
    { code: "DFW", name: "Dallas (DFW)" },
    { code: "MIA", name: "Miami (MIA)" },
    { code: "SFO", name: "San Francisco (SFO)" },
    { code: "SEA", name: "Seattle (SEA)" },
    { code: "ATL", name: "Atlanta (ATL)" },
    { code: "LHR", name: "London (LHR)" },
    { code: "CDG", name: "Paris (CDG)" },
    { code: "DXB", name: "Dubai (DXB)" },
    { code: "HND", name: "Tokyo (HND)" },
  ];

  const travelClasses = [
    { value: "ECONOMY", label: "Economy" },
    { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
    { value: "BUSINESS", label: "Business" },
    { value: "FIRST", label: "First Class" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const swapLocations = () => {
    setSearchParams((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Find Your Perfect Flight
          </h2>
          <p className="text-gray-600 mt-2">
            Search and compare flights from hundreds of airlines
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6">
          {/* Origin */}
          <div className="lg:col-span-4">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaPlaneDeparture className="mr-2 text-primary-500" />
              From
            </label>
            <select
              name="origin"
              value={searchParams.origin}
              onChange={handleInputChange}
              required
              className="input-field"
            >
              <option value="">Select origin</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <button
              type="button"
              onClick={swapLocations}
              className="w-12 h-12 rounded-full border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-50 hover:border-primary-600 transition-all duration-300 flex items-center justify-center"
              aria-label="Swap locations"
            >
              <FaExchangeAlt className="text-lg" />
            </button>
          </div>

          {/* Destination */}
          <div className="lg:col-span-4">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaPlaneArrival className="mr-2 text-primary-500" />
              To
            </label>
            <select
              name="destination"
              value={searchParams.destination}
              onChange={handleInputChange}
              required
              className="input-field"
            >
              <option value="">Select destination</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.name}
                </option>
              ))}
            </select>
          </div>

          {/* Departure Date */}
          <div className="lg:col-span-3">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="mr-2 text-primary-500" />
              Departure
            </label>
            <input
              type="date"
              name="departureDate"
              value={searchParams.departureDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="input-field"
            />
          </div>

          {/* Return Date */}
          <div className="lg:col-span-3">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="mr-2 text-primary-500" />
              Return
            </label>
            <input
              type="date"
              name="returnDate"
              value={searchParams.returnDate}
              onChange={handleInputChange}
              required
              min={searchParams.departureDate}
              className="input-field"
            />
          </div>

          {/* Passengers */}
          <div className="lg:col-span-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaUser className="mr-2 text-primary-500" />
              Passengers
            </label>
            <select
              name="passengers"
              value={searchParams.passengers}
              onChange={handleInputChange}
              className="input-field"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "passenger" : "passengers"}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Class */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Class
            </label>
            <select
              name="travelClass"
              value={searchParams.travelClass}
              onChange={handleInputChange}
              className="input-field"
            >
              {travelClasses.map((cls) => (
                <option key={cls.value} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <button type="submit" className="btn-primary px-12">
            <FaSearch className="inline mr-2" />
            Search Flights
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Best prices guaranteed</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>No booking fees</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FlightSearch;

