import React from "react";
import { FaFilter, FaDollarSign, FaPlane, FaSlidersH } from "react-icons/fa";

const Filters = ({ filters, onFilterChange, flights }) => {
  const airlines = [
    { code: "AA", name: "American Airlines" },
    { code: "DL", name: "Delta Air Lines" },
    { code: "UA", name: "United Airlines" },
    { code: "WN", name: "Southwest Airlines" },
    { code: "B6", name: "JetBlue Airways" },
    { code: "AS", name: "Alaska Airlines" },
    { code: "F9", name: "Frontier Airlines" },
    { code: "NK", name: "Spirit Airlines" },
  ];

  const handlePriceChange = (e) => {
    onFilterChange({
      ...filters,
      maxPrice: parseInt(e.target.value),
    });
  };

  const handleStopsChange = (stops) => {
    onFilterChange({
      ...filters,
      stops,
    });
  };

  const handleAirlineChange = (airlineCode) => {
    const newAirlines = filters.airlines.includes(airlineCode)
      ? filters.airlines.filter((code) => code !== airlineCode)
      : [...filters.airlines, airlineCode];

    onFilterChange({
      ...filters,
      airlines: newAirlines,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      maxPrice: 1000,
      stops: "any",
      airlines: [],
      sortBy: "price",
    });
  };

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <FaFilter className="text-primary-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center">
          <FaDollarSign className="text-primary-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Price Range</h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-primary-600">
              ${filters.maxPrice}
            </span>
            <span className="text-sm text-gray-600">
              ${Math.round(filters.maxPrice * 0.5)} - ${filters.maxPrice}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$100</span>
            <span>$500</span>
            <span>$1000</span>
            <span>$1500</span>
            <span>$2000</span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div className="space-y-4">
        <div className="flex items-center">
          <FaPlane className="text-primary-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Stops</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "any", label: "Any stops" },
            { value: "nonstop", label: "Non-stop only" },
            { value: "1", label: "1 stop max" },
            { value: "2", label: "2 stops max" },
          ].map((stop) => (
            <button
              key={stop.value}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                filters.stops === stop.value
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleStopsChange(stop.value)}
            >
              {stop.label}
            </button>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div className="space-y-4">
        <div className="flex items-center">
          <FaSlidersH className="text-primary-600 mr-2" />
          <h4 className="font-semibold text-gray-700">Airlines</h4>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {airlines.map((airline) => (
            <label
              key={airline.code}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline.code)}
                onChange={() => handleAirlineChange(airline.code)}
                className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 focus:ring-2"
              />
              <div className="ml-3 flex-grow">
                <span className="text-gray-700 font-medium">
                  {airline.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-mono">
                ({airline.code})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">Active Filters</h4>
        <div className="flex flex-wrap gap-2">
          {filters.maxPrice < 1000 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
              Max: ${filters.maxPrice}
            </span>
          )}
          {filters.stops !== "any" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {filters.stops === "nonstop"
                ? "Non-stop"
                : `${filters.stops} stop${
                    filters.stops !== "1" ? "s" : ""
                  } max`}
            </span>
          )}
          {filters.airlines.map((airlineCode) => {
            const airline = airlines.find((a) => a.code === airlineCode);
            return airline ? (
              <span
                key={airlineCode}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700"
              >
                {airline.code}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
