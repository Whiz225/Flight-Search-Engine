import React from "react";
import {
  FaClock,
  FaPlane,
  FaCheckCircle,
  FaArrowRight,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FlightCard = ({ flight, formatTime, formatDuration, onViewDetails }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(flight);
    }
  };

  const handleBookClick = () => {
    navigate("/checkout", {
      state: {
        flight,
        passengerCount: 1,
        totalPrice: flight.price,
      },
    });
  };

  const renderStops = (stopsCount) => {
    if (stopsCount === 0) {
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-6 h-6 xs:w-8 xs:h-8 bg-green-100 rounded-full">
            <FaCheckCircle className="text-green-600 text-xs xs:text-sm" />
          </div>
          <span className="text-xxs xs:text-xs font-semibold text-green-700 mt-1">
            Direct
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-primary-500 rounded-full"></div>
          <div className="w-3 xs:w-4 h-0.5 bg-gray-300"></div>
          <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 bg-red-500 rounded-full"></div>
          <div className="w-3 xs:w-4 h-0.5 bg-gray-300"></div>
          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-primary-500 rounded-full"></div>
        </div>
        <span className="text-xxs xs:text-xs font-semibold text-gray-700 mt-1">
          {stopsCount} stop{stopsCount > 1 ? "s" : ""}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:border-primary-200">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg xs:rounded-xl mr-2 xs:mr-3">
            <FaPlane className="text-sm xs:text-lg text-white" />
          </div>
          <div>
            <h3 className="text-sm xs:text-base font-bold text-gray-800 truncate max-w-[100px] xs:max-w-none">
              {flight.airline}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="px-1.5 py-0.5 xs:px-2 xs:py-1 bg-gray-100 text-gray-700 rounded-full text-xxs xs:text-xs font-medium">
                {flight.flightNumber}
              </span>
              <span className="px-1.5 py-0.5 xs:px-2 xs:py-1 bg-primary-50 text-primary-700 rounded-full text-xxs xs:text-xs font-medium">
                {flight.travelClass || "Econ"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg xs:text-xl font-bold text-gray-800">
            ${flight.price}
          </div>
          <div className="text-xxs xs:text-xs text-gray-600">per person</div>
        </div>
      </div>

      {/* Compact Flight Route */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="text-center">
            <div className="text-base xs:text-lg font-bold text-gray-800">
              {formatTime(flight.departureTime)}
            </div>
            <div className="text-xs xs:text-sm font-semibold text-gray-700">
              {flight.origin}
            </div>
          </div>

          {/* Middle Section with Arrow and Duration */}
          <div className="flex flex-col items-center mx-2">
            <div className="flex items-center w-16 xs:w-20 mb-1">
              <div className="flex-grow h-0.5 bg-gray-300"></div>
              <FaArrowRight className="mx-1 xs:mx-2 text-primary-500 text-xs xs:text-sm" />
              <div className="flex-grow h-0.5 bg-gray-300"></div>
            </div>

            {/* Stops */}
            {renderStops(flight.stops)}

            {/* Duration */}
            <div className="flex items-center mt-1">
              <FaClock className="mr-1 text-primary-500 text-xs xs:text-sm" />
              <span className="text-xxs xs:text-xs font-semibold text-gray-700">
                {formatDuration(flight.duration)}h
              </span>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-base xs:text-lg font-bold text-gray-800">
              {formatTime(flight.arrivalTime)}
            </div>
            <div className="text-xs xs:text-sm font-semibold text-gray-700">
              {flight.destination}
            </div>
          </div>
        </div>

        {/* Layover Info */}
        {flight.stops > 0 && flight.layovers && flight.layovers.length > 0 && (
          <div className="mt-2 p-1.5 xs:p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <FaInfoCircle className="mr-1.5 text-xxs xs:text-xs" />
              <span className="text-xxs xs:text-xs font-medium">
                {flight.layovers[0].airport} ({flight.layovers[0].duration})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Compact Actions Row */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-primary-500 mr-1.5 text-xs xs:text-sm" />
          <div>
            <div className="text-xxs xs:text-xs text-gray-600">Airport</div>
            <div className="text-xs xs:text-sm font-medium">
              {flight.origin} → {flight.destination}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDetailsClick}
            className="px-3 py-1.5 xs:px-4 xs:py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-xs xs:text-sm"
          >
            Details
          </button>
          <button
            onClick={handleBookClick}
            className="px-3 py-1.5 xs:px-4 xs:py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 text-xs xs:text-sm"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;

// import React from "react";
// import {
//   FaClock,
//   FaPlane,
//   FaCheckCircle,
//   FaRegStar,
//   FaStar,
//   FaArrowRight,
//   FaMapMarkerAlt,
//   FaInfoCircle,
//   FaSuitcase,
//   FaWifi,
//   FaUtensils,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const FlightCard = ({ flight, formatTime, formatDuration, onViewDetails }) => {
//   const navigate = useNavigate();

//   const {
//     airline,
//     flightNumber,
//     departureTime,
//     arrivalTime,
//     duration,
//     stops,
//     price,
//     currency = "USD",
//     aircraft,
//     origin,
//     destination,
//     originCity,
//     destinationCity,
//     amenities = ["Wi-Fi", "Meal", "Entertainment"],
//     seatsAvailable,
//     travelClass,
//     layovers = [],
//   } = flight;

//   // Format duration to 1 decimal place
//   const formattedDuration = (duration / 60).toFixed(1);

//   const handleDetailsClick = () => {
//     if (onViewDetails) {
//       onViewDetails(flight);
//     }
//   };

//   const handleBookClick = () => {
//     navigate("/checkout", {
//       state: {
//         flight,
//         passengerCount: 1,
//         totalPrice: price,
//       },
//     });
//   };

//   const renderStops = (stopsCount) => {
//     if (stopsCount === 0) {
//       return (
//         <div className="flex flex-col items-center">
//           <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
//             <FaCheckCircle className="text-green-600 text-xl" />
//           </div>
//           <span className="text-sm font-semibold text-green-700">Direct</span>
//         </div>
//       );
//     }

//     return (
//       <div className="flex flex-col items-center">
//         <div className="flex items-center mb-2">
//           <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
//           <div className="w-12 h-0.5 bg-gray-300"></div>
//           <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//           <div className="w-12 h-0.5 bg-gray-300"></div>
//           <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
//         </div>
//         <span className="text-sm font-semibold text-gray-700">
//           {stopsCount} stop{stopsCount > 1 ? "s" : ""}
//         </span>
//       </div>
//     );
//   };

//   const getAmenityIcon = (amenity) => {
//     switch (amenity.toLowerCase()) {
//       case "wi-fi":
//         return <FaWifi className="text-blue-500" />;
//       case "meal":
//         return <FaUtensils className="text-green-500" />;
//       case "entertainment":
//         return <FaInfoCircle className="text-purple-500" />;
//       case "checked bag":
//         return <FaSuitcase className="text-yellow-500" />;
//       default:
//         return <FaInfoCircle className="text-gray-500" />;
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:border-primary-200">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-200">
//         <div className="flex items-center mb-4 md:mb-0">
//           <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl mr-4">
//             <FaPlane className="text-2xl text-white" />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-gray-800">{airline}</h3>
//             <div className="flex flex-wrap items-center gap-2 mt-1">
//               <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
//                 {flightNumber}
//               </span>
//               <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
//                 {travelClass || "Economy"}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <span key={star} className="text-yellow-400">
//               {star <= 4 ? <FaStar /> : <FaRegStar />}
//             </span>
//           ))}
//           <span className="ml-2 font-semibold text-gray-700">4.0</span>
//         </div>
//       </div>

//       {/* Flight Timeline */}
//       <div className="mb-6">
//         <div className="flex flex-col md:flex-row items-center justify-between">
//           {/* Departure */}
//           <div className="text-center mb-6 md:mb-0 md:text-left md:w-1/3">
//             <div className="text-3xl font-bold text-gray-800 mb-2">
//               {formatTime(departureTime)}
//             </div>
//             <div className="flex items-center justify-center md:justify-start">
//               <FaMapMarkerAlt className="text-primary-500 mr-2" />
//               <div>
//                 <div className="text-2xl font-bold text-gray-800">{origin}</div>
//                 <div className="text-gray-600">{originCity || "New York"}</div>
//               </div>
//             </div>
//           </div>

//           {/* Duration & Stops */}
//           <div className="flex flex-col items-center mb-6 md:mb-0 md:w-1/3">
//             <div className="flex items-center w-full mb-4">
//               <div className="flex-grow h-0.5 bg-gray-300"></div>
//               <FaArrowRight className="mx-4 text-primary-500 text-xl" />
//               <div className="flex-grow h-0.5 bg-gray-300"></div>
//             </div>

//             {renderStops(stops)}

//             <div className="flex items-center mt-4 text-gray-700">
//               <FaClock className="mr-2 text-primary-500" />
//               <span className="font-semibold">{formattedDuration} hours</span>
//             </div>
//           </div>

//           {/* Arrival */}
//           <div className="text-center md:text-right md:w-1/3">
//             <div className="text-3xl font-bold text-gray-800 mb-2">
//               {formatTime(arrivalTime)}
//             </div>
//             <div className="flex items-center justify-center md:justify-end">
//               <FaMapMarkerAlt className="text-primary-500 mr-2" />
//               <div>
//                 <div className="text-2xl font-bold text-gray-800">
//                   {destination}
//                 </div>
//                 <div className="text-gray-600">
//                   {destinationCity || "Los Angeles"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Layover Info */}
//         {stops > 0 && layovers.length > 0 && (
//           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
//             <div className="flex items-center text-yellow-800">
//               <FaInfoCircle className="mr-2" />
//               <span className="text-sm font-medium">
//                 Layover in {layovers[0].airport} ({layovers[0].duration})
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Amenities & Aircraft */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
//         <div className="mb-3 sm:mb-0">
//           <span className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
//             {aircraft}
//           </span>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {amenities.slice(0, 3).map((amenity, index) => (
//             <div
//               key={index}
//               className="flex items-center px-3 py-1.5 bg-white rounded-lg border border-gray-200"
//             >
//               {getAmenityIcon(amenity)}
//               <span className="ml-2 text-sm text-gray-700">{amenity}</span>
//             </div>
//           ))}
//           {amenities.length > 3 && (
//             <div className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">
//               +{amenities.length - 3} more
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer - Price & Actions */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 border-t border-gray-200">
//         <div className="mb-4 md:mb-0">
//           <div className="flex items-baseline mb-2">
//             <span className="text-gray-600 mr-1">{currency}</span>
//             <span className="text-4xl font-bold text-gray-800">{price}</span>
//           </div>
//           <div className="space-y-1">
//             <div className="text-sm text-gray-600">per person</div>
//             {seatsAvailable && (
//               <div className="text-sm font-medium text-red-600">
//                 Only {seatsAvailable} seats left
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3">
//           <button
//             onClick={handleDetailsClick}
//             className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
//           >
//             View Details
//           </button>
//           <button
//             onClick={handleBookClick}
//             className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
//           >
//             Book Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlightCard;
