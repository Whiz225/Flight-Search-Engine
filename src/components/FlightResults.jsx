import React from "react";
import FlightCard from "./FlightCard";
import { FaSortAmountUp, FaClock, FaDollarSign } from "react-icons/fa";

const FlightResults = ({
  flights,
  filters,
  formatTime,
  formatDuration,
  onViewDetails,
  onSortChange,
}) => {
  // console.log("flights", flights, "filters", filters);
  const sortedFlights = [...flights].sort((a, b) => {
    switch (filters.sortBy) {
      case "price":
        return a.price - b.price;
      case "duration":
        return a.duration - b.duration;
      case "departure":
        return new Date(a.departureTime) - new Date(b.departureTime);
      default:
        return 0;
    }
  });

  const handleSortClick = (sortType) => {
    if (onSortChange) {
      onSortChange(sortType);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Flights
          </h2>
          <div className="flex items-center mt-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {sortedFlights.length} flights found
            </span>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSortClick("price")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.sortBy === "price"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaDollarSign className="mr-2" />
              Price
            </button>
            <button
              onClick={() => handleSortClick("duration")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.sortBy === "duration"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaClock className="mr-2" />
              Duration
            </button>
            <button
              onClick={() => handleSortClick("departure")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.sortBy === "departure"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaSortAmountUp className="mr-2" />
              Departure
            </button>
          </div>
        </div>
      </div>

      {/* Flight List */}
      <div className="space-y-4">
        {sortedFlights.map((flight, index) => (
          <FlightCard
            key={`${flight.id}-${index}`}
            flight={flight}
            formatTime={formatTime}
            formatDuration={formatDuration}
            onViewDetails={onViewDetails}
          />
        ))}

        {sortedFlights.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">✈️</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No flights found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search parameters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightResults;
