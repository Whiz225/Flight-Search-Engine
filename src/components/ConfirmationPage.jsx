import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaDownload,
  FaEnvelope,
  FaPrint,
  FaShareAlt,
  FaCalendarAlt,
  FaClock,
  FaPlane,
  FaUser,
  FaQrcode,
} from "react-icons/fa";

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Load booking from localStorage
    const savedBooking = localStorage.getItem("lastBooking");
    if (savedBooking) {
      setBooking(JSON.parse(savedBooking));
    }
    setLoading(false);
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Booking not found
          </h2>
          <button onClick={() => navigate("/")} className="btn-primary w-full">
            Search for flights
          </button>
        </div>
      </div>
    );
  }

  const { flight, passengers, total, date, status } = booking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-600 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-2xl max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="text-green-500 text-5xl mr-4">
              <FaCheckCircle />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600">
                Your flight has been successfully booked
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {bookingId}
            </div>
            <div className="text-primary-600 text-3xl">
              <FaQrcode />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Details */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Flight Details
              </h2>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                {status.toUpperCase()}
              </span>
            </div>

            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <FaPlane className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{flight.airline}</h3>
                    <p className="text-white/90">{flight.flightNumber}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold">${total.toFixed(2)}</div>
                  <p className="text-white/80">Total Paid</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center mb-4 md:mb-0">
                  <div className="text-2xl font-bold mb-1">
                    {formatTime(flight.departureTime)}
                  </div>
                  <div className="font-semibold">{flight.origin}</div>
                  <div className="text-sm text-white/80">
                    {flight.originCity || "New York"}
                  </div>
                </div>

                <div className="my-4 md:my-0">
                  <div className="flex items-center">
                    <div className="w-16 h-0.5 bg-white/30"></div>
                    <div className="mx-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                        <FaClock className="text-primary-600" />
                      </div>
                    </div>
                    <div className="w-16 h-0.5 bg-white/30"></div>
                  </div>
                  <div className="text-center mt-2">
                    <div className="font-semibold">
                      {(flight.duration / 60).toFixed(1)} hours
                    </div>
                    <div className="text-sm">
                      {flight.stops === 0
                        ? "Direct"
                        : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    {formatTime(flight.arrivalTime)}
                  </div>
                  <div className="font-semibold">{flight.destination}</div>
                  <div className="text-sm text-white/80">
                    {flight.destinationCity || "Los Angeles"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaPlane className="text-primary-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Airline</div>
                  <div className="font-semibold">{flight.airline}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaPlane className="text-primary-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Flight Number</div>
                  <div className="font-semibold">{flight.flightNumber}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-primary-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Booking Date</div>
                  <div className="font-semibold">{formatDate(date)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Passenger Details
            </h2>
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Passenger {index + 1}
                      </h3>
                      <p className="text-gray-600">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{passenger.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{passenger.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Passport</div>
                      <div className="font-medium">
                        {passenger.passportNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Nationality</div>
                      <div className="font-medium">{passenger.nationality}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Important Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Check-in Requirements
                </h4>
                <p className="text-gray-600 text-sm">
                  Check-in opens 24 hours before departure and closes 60 minutes
                  before departure.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Baggage Allowance
                </h4>
                <p className="text-gray-600 text-sm">
                  1 cabin bag (max 7kg) and 1 checked bag (max 23kg) per
                  passenger.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">
                  COVID-19 Measures
                </h4>
                <p className="text-gray-600 text-sm">
                  Face masks are recommended. Please check destination
                  requirements before travel.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Contact Information
                </h4>
                <p className="text-gray-600 text-sm">
                  For assistance, contact customer service at +1 (800) 555-1234
                  or support@skysearch.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={handlePrint}
              >
                <FaPrint className="mr-3" /> Print Ticket
              </button>

              <button
                className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={handleEmail}
              >
                <FaEnvelope className="mr-3" />{" "}
                {emailSent ? "Sent!" : "Email Ticket"}
              </button>

              <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <FaDownload className="mr-3" /> Download PDF
              </button>

              <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <FaShareAlt className="mr-3" /> Share Booking
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Price Summary
            </h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Flight Fare</span>
                <span>${(flight.price * passengers.length).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees</span>
                <span>${(total * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance</span>
                <span>$15.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                <span>Total Paid</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Payment Method</div>
              <div className="font-semibold">Credit Card **** 1234</div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Check-in Online
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Available 24 hours before departure
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Review Baggage Policy
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Ensure your luggage meets requirements
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Prepare Documents
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Bring passport and printed ticket
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Arrive at Airport
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Be there 3 hours before international flights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-8 flex flex-col sm:flex-row gap-4">
        <button onClick={() => navigate("/")} className="btn-primary flex-1">
          Book Another Flight
        </button>
        <button onClick={() => window.print()} className="btn-secondary flex-1">
          Print Full Itinerary
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
