import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaPlane,
  FaClock,
  FaSuitcase,
  FaUtensils,
  FaWifi,
  FaPlug,
  FaFilm,
  FaUserCheck,
  FaShieldAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const FlightDetailsModal = ({ flight, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !flight) return null;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (minutes) => {
    return (minutes / 60).toFixed(1);
  };

  const amenities = [
    {
      icon: <FaWifi />,
      label: "Wi-Fi",
      included: flight.amenities?.includes("Wi-Fi"),
    },
    {
      icon: <FaUtensils />,
      label: "Meal",
      included: flight.amenities?.includes("Meal"),
    },
    {
      icon: <FaFilm />,
      label: "Entertainment",
      included: flight.amenities?.includes("Entertainment"),
    },
    {
      icon: <FaPlug />,
      label: "Power Outlet",
      included: flight.amenities?.includes("Power Outlet"),
    },
    {
      icon: <FaSuitcase />,
      label: "Checked Bag",
      included: flight.amenities?.includes("Checked Bag"),
    },
    {
      icon: <FaUserCheck />,
      label: "Priority Boarding",
      included:
        flight.travelClass === "BUSINESS" || flight.travelClass === "FIRST",
    },
  ];

  const handleContinueToBooking = () => {
    onClose();
    navigate("/checkout", {
      state: {
        flight,
        passengerCount: 1,
        totalPrice: flight.price,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Flight Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-2xl text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Flight Summary */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <FaPlane className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{flight.airline}</h3>
                  <p className="text-white/90">
                    {flight.flightNumber} • {flight.travelClass || "Economy"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">${flight.price}</div>
                <p className="text-white/80">Total per passenger</p>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0 md:w-1/3">
                  <div className="text-3xl font-bold mb-1">
                    {formatTime(flight.departureTime)}
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <FaMapMarkerAlt className="mr-2" />
                    <div>
                      <div className="text-xl font-semibold">
                        {flight.origin}
                      </div>
                      <div className="text-white/80">
                        {flight.originCity || "New York"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm mt-2">
                    {formatDate(flight.departureTime)}
                  </div>
                </div>

                <div className="md:w-1/3 text-center my-4 md:my-0">
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex-grow h-0.5 bg-white/30"></div>
                    <div className="mx-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                        <FaClock className="text-primary-600 text-xl" />
                      </div>
                    </div>
                    <div className="flex-grow h-0.5 bg-white/30"></div>
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {formatDuration(flight.duration)} hours
                  </div>
                  <div className="text-sm">
                    {flight.stops === 0
                      ? "Direct"
                      : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                  </div>
                </div>

                <div className="text-center md:text-right md:w-1/3">
                  <div className="text-3xl font-bold mb-1">
                    {formatTime(flight.arrivalTime)}
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <FaMapMarkerAlt className="mr-2" />
                    <div>
                      <div className="text-xl font-semibold">
                        {flight.destination}
                      </div>
                      <div className="text-white/80">
                        {flight.destinationCity || "Los Angeles"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm mt-2">
                    {formatDate(flight.arrivalTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Aircraft Info */}
            <div className="card">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Aircraft Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Aircraft Type</span>
                  <span className="font-semibold">{flight.aircraft}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Seats Available</span>
                  <span className="font-semibold">
                    {flight.seatsAvailable || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Cabin Layout</span>
                  <span className="font-semibold">3-3 Configuration</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="card">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Amenities & Services
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg ${
                      amenity.included
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`mr-3 ${
                        amenity.included ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {amenity.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-700">
                        {amenity.label}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        amenity.included
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {amenity.included ? "Included" : "Not Included"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Baggage Policy */}
            <div className="card">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Baggage Policy
              </h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaSuitcase className="text-primary-600 mr-3 text-lg" />
                  <div>
                    <div className="font-semibold text-gray-800">Cabin Bag</div>
                    <div className="text-sm text-gray-600">
                      1 item (up to 7kg, 22x35x56cm)
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaSuitcase className="text-primary-600 mr-3 text-lg" />
                  <div>
                    <div className="font-semibold text-gray-800">
                      Checked Bag
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.travelClass === "ECONOMY"
                        ? "1 item (23kg)"
                        : flight.travelClass === "PREMIUM_ECONOMY"
                        ? "2 items (23kg each)"
                        : "2 items (32kg each)"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Information */}
            <div className="card">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Safety & Health
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Enhanced cleaning procedures
                  </span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    HEPA air filtration system
                  </span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Contactless check-in available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="card bg-yellow-50 border border-yellow-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              Cancellation Policy
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">
                    Up to 24 hours before departure
                  </div>
                  <div className="text-sm text-gray-600">
                    Full refund available
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Free cancellation
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">
                    Within 24 hours of departure
                  </div>
                  <div className="text-sm text-gray-600">
                    Subject to airline fees
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  50% fee applies
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">No-show</div>
                  <div className="text-sm text-gray-600">Missed departure</div>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                  No refund
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <button
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto mb-3 sm:mb-0"
            >
              Close Details
            </button>
            <button
              onClick={handleContinueToBooking}
              className="btn-primary w-full sm:w-auto"
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsModal;
