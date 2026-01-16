import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlightSearch from "./components/FlightSearch";
import FlightResults from "./components/FlightResults";
import PriceGraph from "./components/PriceGraph";
import Filters from "./components/Filters";
import FlightDetailsModal from "./components/FlightDetailsModal";
import CheckoutPage from "./components/CheckoutPage";
import ConfirmationPage from "./components/ConfirmationPage";
import LegalPages from "./components/LegalPages";
import { useFlightData } from "./hooks/useFlightData";

function App() {
  const [searchParams, setSearchParams] = useState({
    origin: "JFK",
    destination: "LAX",
    departureDate: new Date().toISOString().split("T")[0],
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    passengers: 1,
    travelClass: "ECONOMY",
  });

  const [filters, setFilters] = useState({
    maxPrice: 1000,
    stops: "any",
    airlines: [],
    sortBy: "price",
  });

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { flights, priceData, loading, error } = useFlightData(
    searchParams,
    filters
  );

  const handleSearch = (newParams) => {
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortType) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortType,
    }));
  };

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setShowDetails(true);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes) => {
    return (minutes / 60).toFixed(1);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-600">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            ✈️ SkySearch
          </h1>
          <p className="text-xl text-white/90">
            Find the best flight deals with real-time pricing
          </p>
        </header>

        <main className="max-w-7xl mx-auto px-4 pb-12">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* Search Section */}
                  <div className="mb-8">
                    <FlightSearch
                      onSearch={handleSearch}
                      initialParams={searchParams}
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                      <div className="sticky top-6">
                        <Filters
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          flights={flights}
                        />
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                      {/* Price Graph */}
                      <div className="mb-6">
                        <PriceGraph priceData={priceData} filters={filters} />
                      </div>

                      {/* Flight Results */}
                      <div>
                        {loading && (
                          <div className="card text-center py-12">
                            <div className="animate-pulse">
                              <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
                            </div>
                          </div>
                        )}

                        {error && (
                          <div className="card bg-red-50 border border-red-200 p-6">
                            <div className="text-red-700 font-medium">
                              Error: {error}
                            </div>
                            <p className="text-red-600 text-sm mt-2">
                              Please try again or check your connection.
                            </p>
                          </div>
                        )}

                        {!loading && !error && (
                          <FlightResults
                            flights={flights}
                            filters={filters}
                            formatTime={formatTime}
                            formatDuration={formatDuration}
                            onViewDetails={handleViewDetails}
                            onSortChange={handleSortChange}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              }
            />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/confirmation/:bookingId"
              element={<ConfirmationPage />}
            />
            <Route
              path="/privacy-policy"
              element={<LegalPages page="privacy" />}
            />
            <Route
              path="/terms-of-service"
              element={<LegalPages page="terms" />}
            />
            <Route path="/contact-us" element={<LegalPages page="contact" />} />
            <Route path="/help-center" element={<LegalPages page="help" />} />
          </Routes>
        </main>

        {/* Flight Details Modal */}
        {showDetails && selectedFlight && (
          <FlightDetailsModal
            flight={selectedFlight}
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
          />
        )}

        {/* Footer */}
        <footer className="bg-white/10 backdrop-blur-sm py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-white/80">
              © {new Date().getFullYear()} SkySearch Flight Engine. Made with ❤️
              for Spotter
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={() => (window.location.hash = "/privacy-policy")}
                // onClick={() => (window.location.href = "/privacy-policy")}
                className="text-white/60 hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => (window.location.hash = "/terms-of-service")}
                // onClick={() => (window.location.href = "/terms-of-service")}
                className="text-white/60 hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => (window.location.hash = "/contact-us")}
                // onClick={() => (window.location.href = "/contact-us")}
                className="text-white/60 hover:text-white transition-colors"
              >
                Contact Us
              </button>
              <button
                onClick={() => (window.location.hash = "/help-center")}
                // onClick={() => (window.location.href = "/help-center")}
                className="text-white/60 hover:text-white transition-colors"
              >
                Help Center
              </button>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
