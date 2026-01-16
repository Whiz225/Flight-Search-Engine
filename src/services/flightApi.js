// src/services/flightApi.js
import axios from "axios";

// ==================== AMADEUS API CONFIG ====================
const AMADEUS_API_BASE = "https://test.api.amadeus.com";
const AMADEUS_API_KEY = process.env.REACT_APP_AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.REACT_APP_AMADEUS_API_SECRET;

// ==================== SKYSCANNER API CONFIG ====================
const SKYSCANNER_API_BASE =
  "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com";
const SKYSCANNER_API_KEY = process.env.REACT_APP_SKYSCANNER_API_KEY;

// ==================== TOKEN MANAGEMENT ====================
let amadeusToken = null;
let tokenExpiry = null;

// Get Amadeus OAuth Token
const getAmadeusToken = async () => {
  // Check if token exists and is still valid
  if (amadeusToken && tokenExpiry && new Date() < tokenExpiry) {
    return amadeusToken;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", AMADEUS_API_KEY);
    params.append("client_secret", AMADEUS_API_SECRET);

    const response = await axios.post(
      `${AMADEUS_API_BASE}/v1/security/oauth2/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    amadeusToken = response.data.access_token;
    // Set expiry (token usually valid for 30 minutes)
    tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

    return amadeusToken;
  } catch (error) {
    console.error("Error getting Amadeus token:", error);
    throw error;
  }
};

// ==================== AMADEUS API FUNCTIONS ====================

export const searchFlightsAmadeus = async (searchParams) => {
  try {
    const token = await getAmadeusToken();

    const params = {
      originLocationCode: searchParams.origin,
      destinationLocationCode: searchParams.destination,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      adults: searchParams.passengers,
      travelClass: searchParams.travelClass,
      currencyCode: "USD",
      max: 20,
      nonStop: searchParams.nonStop || false,
    };

    const response = await axios.get(
      `${AMADEUS_API_BASE}/v2/shopping/flight-offers`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return formatAmadeusFlightData(response.data.data);
  } catch (error) {
    console.error("Error fetching flights from Amadeus:", error);

    // Fallback to mock data for development
    console.log("Using mock data as fallback");
    return generateMockFlightData(searchParams);
  }
};

export const getFlightPriceHistoryAmadeus = async (searchParams) => {
  try {
    const token = await getAmadeusToken();

    // Get price metrics for the itinerary
    const params = {
      originIataCode: searchParams.origin,
      destinationIataCode: searchParams.destination,
      departureDate: searchParams.departureDate,
      currencyCode: "USD",
      oneWay: false,
    };

    const response = await axios.get(
      `${AMADEUS_API_BASE}/v1/analytics/itinerary-price-metrics`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return formatAmadeusPriceData(response.data.data);
  } catch (error) {
    console.error("Error fetching price history:", error);
    return generateMockPriceData(searchParams);
  }
};

export const getAirportSuggestionsAmadeus = async (query) => {
  try {
    const token = await getAmadeusToken();

    const response = await axios.get(
      `${AMADEUS_API_BASE}/v1/reference-data/locations`,
      {
        params: {
          subType: "AIRPORT",
          keyword: query,
          "page[limit]": 10,
          "page[offset]": 0,
          sort: "analytics.travelers.score",
          view: "FULL",
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return response.data.data.map((airport) => ({
      code: airport.iataCode,
      name: airport.name,
      city: airport.address.cityName,
      country: airport.address.countryName,
    }));
  } catch (error) {
    console.error("Error fetching airport suggestions:", error);
    return [];
  }
};

// ==================== SKYSCANNER API FUNCTIONS ====================

export const searchFlightsSkyscanner = async (searchParams) => {
  try {
    // First, we need to create a session
    const sessionResponse = await axios.post(
      `${SKYSCANNER_API_BASE}/apiservices/pricing/v1.0`,
      {
        country: "US",
        currency: "USD",
        locale: "en-US",
        originplace: `${searchParams.origin}-sky`,
        destinationplace: `${searchParams.destination}-sky`,
        outbounddate: searchParams.departureDate,
        inbounddate: searchParams.returnDate,
        adults: searchParams.passengers,
        cabinclass: searchParams.travelClass.toLowerCase(),
      },
      {
        headers: {
          "x-rapidapi-key": SKYSCANNER_API_KEY,
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Extract session key from response headers
    const sessionKey = sessionResponse.headers.location.split("/").pop();

    // Poll for results (simplified - in production you'd implement proper polling)
    const resultsResponse = await axios.get(
      `${SKYSCANNER_API_BASE}/apiservices/pricing/uk2/v1.0/${sessionKey}`,
      {
        params: {
          pageIndex: 0,
          pageSize: 20,
        },
        headers: {
          "x-rapidapi-key": SKYSCANNER_API_KEY,
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      }
    );

    return formatSkyscannerFlightData(resultsResponse.data);
  } catch (error) {
    console.error("Error fetching flights from Skyscanner:", error);
    return generateMockFlightData(searchParams);
  }
};

// ==================== DATA FORMATTING FUNCTIONS ====================

const formatAmadeusFlightData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((offer) => {
    const itinerary = offer.itineraries[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    const price = offer.price;
    const airline = offer.validatingAirlineCodes?.[0] || "Unknown";

    return {
      id: offer.id,
      airline: getAirlineName(airline),
      airlineCode: airline,
      flightNumber: `${airline}${itinerary.segments[0].number || "0000"}`,
      departureTime: itinerary.segments[0].departure.at,
      arrivalTime: lastSegment.arrival.at,
      duration: convertDurationToMinutes(itinerary.duration),
      stops: itinerary.segments.length - 1,
      price: parseFloat(price.total),
      currency: price.currency,
      aircraft: itinerary.segments[0].aircraft?.code || "Unknown",
      origin: itinerary.segments[0].departure.iataCode,
      destination: lastSegment.arrival.iataCode,
      amenities: getDefaultAmenities(
        offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
      ),
      seatsAvailable: getRandomSeats(), // API doesn't provide this directly
      travelClass:
        offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ||
        "ECONOMY",
    };
  });
};

const formatAmadeusPriceData = (apiData) => {
  if (!apiData || !apiData.length) {
    return generateMockPriceData({});
  }

  const priceMetrics = apiData[0];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days.map((day, index) => {
    // Use real data if available, otherwise generate realistic data
    const price =
      priceMetrics.priceMetrics?.find((p) => p.quartileRanking === "MINIMUM")
        ?.amount || 350 + Math.random() * 300;

    const average =
      priceMetrics.priceMetrics?.find((p) => p.quartileRanking === "MEDIUM")
        ?.amount || price * 1.2;

    const min =
      priceMetrics.priceMetrics?.find((p) => p.quartileRanking === "FIRST")
        ?.amount || price * 0.8;

    return {
      date: day,
      price: Math.round(price + (Math.random() * 50 - 25)), // Add some variation
      average: Math.round(average),
      min: Math.round(min),
      prediction: priceMetrics.type === "FORECAST",
    };
  });
};

const formatSkyscannerFlightData = (apiData) => {
  // Skyscanner has complex response format - this is simplified
  const flights = apiData.Itineraries || [];

  return flights.map((itinerary, index) => {
    const pricingOption = itinerary.PricingOptions?.[0];
    const legs = apiData.Legs || [];
    const leg = legs.find((l) => l.Id === itinerary.OutboundLegId);

    return {
      id: `SKY-${index}`,
      airline: leg?.Carriers?.[0]?.Name || "Unknown",
      airlineCode: leg?.Carriers?.[0]?.Code || "??",
      flightNumber: `SKY${1000 + index}`,
      departureTime: leg?.Departure || new Date().toISOString(),
      arrivalTime: leg?.Arrival || new Date().toISOString(),
      duration: leg?.Duration || 180,
      stops: leg?.Stops?.length || 0,
      price: pricingOption?.Price || 299 + Math.random() * 300,
      currency: "USD",
      aircraft: "Unknown",
      amenities: ["Wi-Fi", "Meal"],
      seatsAvailable: Math.floor(Math.random() * 30) + 5,
    };
  });
};

// ==================== HELPER FUNCTIONS ====================

const convertDurationToMinutes = (duration) => {
  // Convert ISO 8601 duration to minutes
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  return hours * 60 + minutes;
};

const getAirlineName = (code) => {
  const airlines = {
    AA: "American Airlines",
    DL: "Delta Air Lines",
    UA: "United Airlines",
    WN: "Southwest Airlines",
    B6: "JetBlue Airways",
    AS: "Alaska Airlines",
    F9: "Frontier Airlines",
    NK: "Spirit Airlines",
    BA: "British Airways",
    LH: "Lufthansa",
    AF: "Air France",
    KL: "KLM",
    TK: "Turkish Airlines",
    SQ: "Singapore Airlines",
    EK: "Emirates",
    QR: "Qatar Airways",
  };
  return airlines[code] || code;
};

const getDefaultAmenities = (fareDetails) => {
  const amenities = ["Wi-Fi", "Entertainment"];

  if (fareDetails?.cabin === "BUSINESS" || fareDetails?.cabin === "FIRST") {
    amenities.push("Priority Boarding", "Lounge Access", "Premium Meal");
  } else if (fareDetails?.cabin === "PREMIUM_ECONOMY") {
    amenities.push("Extra Legroom", "Premium Meal");
  } else {
    amenities.push("Standard Meal", "USB Port");
  }

  return amenities;
};

const getRandomSeats = () => Math.floor(Math.random() * 40) + 10;

// ==================== MOCK DATA GENERATORS (Fallback) ====================

const generateMockFlightData = (searchParams) => {
  const airports = {
    JFK: {
      code: "JFK",
      name: "John F. Kennedy International Airport",
      city: "New York",
      country: "USA",
    },
    LAX: {
      code: "LAX",
      name: "Los Angeles International Airport",
      city: "Los Angeles",
      country: "USA",
    },
    ORD: {
      code: "ORD",
      name: "O'Hare International Airport",
      city: "Chicago",
      country: "USA",
    },
    DFW: {
      code: "DFW",
      name: "Dallas/Fort Worth International Airport",
      city: "Dallas",
      country: "USA",
    },
    MIA: {
      code: "MIA",
      name: "Miami International Airport",
      city: "Miami",
      country: "USA",
    },
    SFO: {
      code: "SFO",
      name: "San Francisco International Airport",
      city: "San Francisco",
      country: "USA",
    },
    SEA: {
      code: "SEA",
      name: "Seattle–Tacoma International Airport",
      city: "Seattle",
      country: "USA",
    },
    ATL: {
      code: "ATL",
      name: "Hartsfield–Jackson Atlanta International Airport",
      city: "Atlanta",
      country: "USA",
    },
    LHR: {
      code: "LHR",
      name: "Heathrow Airport",
      city: "London",
      country: "UK",
    },
    CDG: {
      code: "CDG",
      name: "Charles de Gaulle Airport",
      city: "Paris",
      country: "France",
    },
    DXB: {
      code: "DXB",
      name: "Dubai International Airport",
      city: "Dubai",
      country: "UAE",
    },
    HND: {
      code: "HND",
      name: "Haneda Airport",
      city: "Tokyo",
      country: "Japan",
    },
  };

  const airlines = [
    { code: "AA", name: "American Airlines" },
    { code: "DL", name: "Delta Air Lines" },
    { code: "UA", name: "United Airlines" },
    { code: "WN", name: "Southwest Airlines" },
    { code: "B6", name: "JetBlue Airways" },
  ];

  const flights = [];

  for (let i = 0; i < 12; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const stops = Math.floor(Math.random() * 3);
    const basePrice = 300 + Math.random() * 700;
    const price = Math.round(basePrice * (stops === 0 ? 1.2 : 1));

    const originAirport = airports[searchParams.origin] || airports.JFK;
    const destAirport = airports[searchParams.destination] || airports.LAX;

    flights.push({
      id: `FL${1000 + i}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${1000 + i}`,
      departureTime: new Date(
        Date.now() + (i * 2 + 6) * 60 * 60 * 1000
      ).toISOString(),
      arrivalTime: new Date(
        Date.now() + (i * 2 + 9) * 60 * 60 * 1000
      ).toISOString(),
      duration: 180 + Math.random() * 120,
      stops,
      price,
      currency: "USD",
      aircraft: "Boeing 737-800",
      origin: originAirport.code,
      originCity: originAirport.city,
      destination: destAirport.code,
      destinationCity: destAirport.city,
      amenities: ["Wi-Fi", "Meal", "Entertainment", "USB Port"].slice(
        0,
        2 + Math.floor(Math.random() * 2)
      ),
      seatsAvailable: Math.floor(Math.random() * 40) + 10,
      travelClass: searchParams.travelClass || "ECONOMY",
      layovers:
        stops > 0
          ? [
              { airport: "ORD", duration: "1h 30m" },
              { airport: "DFW", duration: "45m" },
            ].slice(0, stops)
          : [],
    });
  }

  return flights.sort((a, b) => a.price - b.price);
};

const generateMockPriceData = (searchParams) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const basePrice = 350 + Math.random() * 300;

  return days.map((day, index) => {
    const dayMultiplier = index > 4 ? 1.3 : 1;
    const price = Math.round(
      basePrice * dayMultiplier * (0.9 + Math.random() * 0.3)
    );
    const min = Math.round(price * (0.7 + Math.random() * 0.2));
    const average = Math.round(price * (1 + Math.random() * 0.1));

    return {
      date: day,
      price,
      average,
      min,
      dayOfWeek: index,
      prediction: false,
    };
  });
};

// ==================== MAIN EXPORT ====================

export const fetchFlights = async (searchParams) => {
  // Try Amadeus first, fallback to Skyscanner, then mock data
  try {
    // Uncomment based on which API you want to use
    // return await searchFlightsAmadeus(searchParams);
    // return await searchFlightsSkyscanner(searchParams);
    console.log("Using mock data for demonstration");
    return generateMockFlightData(searchParams);
  } catch (error) {
    console.error("All API attempts failed, using mock data:", error);
    return generateMockFlightData(searchParams);
  }
};

export const fetchPriceData = async (searchParams) => {
  try {
    // return await getFlightPriceHistoryAmadeus(searchParams);
    console.log("Using mock price data for demonstration");
    return generateMockPriceData(searchParams);
  } catch (error) {
    console.error("Failed to fetch price data:", error);
    return generateMockPriceData(searchParams);
  }
};

export const getAirportSuggestions = async (query) => {
  try {
    // return await getAirportSuggestionsAmadeus(query);
    // Return static list for mock
    return getMockAirportSuggestions(query);
  } catch (error) {
    console.error("Failed to fetch airport suggestions:", error);
    return getMockAirportSuggestions(query);
  }
};

const getMockAirportSuggestions = (query) => {
  const airports = [
    {
      code: "JFK",
      name: "John F. Kennedy International Airport",
      city: "New York",
      country: "USA",
    },
    {
      code: "LAX",
      name: "Los Angeles International Airport",
      city: "Los Angeles",
      country: "USA",
    },
    {
      code: "ORD",
      name: "O'Hare International Airport",
      city: "Chicago",
      country: "USA",
    },
    {
      code: "DFW",
      name: "Dallas/Fort Worth International Airport",
      city: "Dallas",
      country: "USA",
    },
    {
      code: "MIA",
      name: "Miami International Airport",
      city: "Miami",
      country: "USA",
    },
    {
      code: "SFO",
      name: "San Francisco International Airport",
      city: "San Francisco",
      country: "USA",
    },
    {
      code: "SEA",
      name: "Seattle–Tacoma International Airport",
      city: "Seattle",
      country: "USA",
    },
    {
      code: "ATL",
      name: "Hartsfield–Jackson Atlanta International Airport",
      city: "Atlanta",
      country: "USA",
    },
    { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
    {
      code: "CDG",
      name: "Charles de Gaulle Airport",
      city: "Paris",
      country: "France",
    },
    {
      code: "DXB",
      name: "Dubai International Airport",
      city: "Dubai",
      country: "UAE",
    },
    { code: "HND", name: "Haneda Airport", city: "Tokyo", country: "Japan" },
  ];

  if (!query) return airports.slice(0, 6);

  const lowerQuery = query.toLowerCase();
  return airports
    .filter(
      (airport) =>
        airport.code.toLowerCase().includes(lowerQuery) ||
        airport.name.toLowerCase().includes(lowerQuery) ||
        airport.city.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 6);
};
