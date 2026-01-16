// src/hooks/useFlightData.js
import { useState, useEffect, useCallback } from "react";
import {
  fetchFlights,
  fetchPriceData,
  getAirportSuggestions,
} from "../services/flightApi";

export const useFlightData = (searchParams, filters) => {
  const [flights, setFlights] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filterFlights = useCallback((allFlights, filters) => {
    if (!allFlights || !Array.isArray(allFlights)) return [];

    return allFlights.filter((flight) => {
      // Filter by price
      if (flight.price > filters.maxPrice) return false;

      // Filter by stops
      if (filters.stops !== "any") {
        if (filters.stops === "nonstop" && flight.stops !== 0) return false;
        if (filters.stops === "1" && flight.stops > 1) return false;
        if (filters.stops === "2" && flight.stops > 2) return false;
      }

      // Filter by airlines
      if (filters.airlines.length > 0) {
        console.log(!filters.airlines.includes(flight.airlineCode));
        if (!filters.airlines.includes(flight.airlineCode)) return false;
      }

      return true;
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch flights from API
        const apiFlights = await fetchFlights(searchParams);
        const filteredFlights = filterFlights(apiFlights, filters);
        setFlights(filteredFlights);

        // Fetch price data
        const priceHistory = await fetchPriceData(searchParams);
        setPriceData(priceHistory);
      } catch (err) {
        setError(err.message || "Failed to load flight data");
        console.error("Error loading flight data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(loadData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchParams, filters, filterFlights]);

  const searchAirports = async (query) => {
    if (query.length < 2) {
      setAirportSuggestions([]);
      return;
    }

    try {
      const suggestions = await getAirportSuggestions(query);
      setAirportSuggestions(suggestions);
    } catch (err) {
      console.error("Error searching airports:", err);
      setAirportSuggestions([]);
    }
  };

  return {
    flights,
    priceData,
    airportSuggestions,
    loading,
    error,
    searchAirports,
  };
};
