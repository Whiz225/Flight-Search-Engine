import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { FaChartLine, FaInfoCircle } from "react-icons/fa";

const PriceGraph = ({ priceData, filters }) => {
  // Format data with 1 decimal place
  const formattedData = (
    priceData.length > 0
      ? priceData
      : [
          { date: "Mon", price: 450.5, average: 420.3, min: 380.2 },
          { date: "Tue", price: 520.8, average: 480.6, min: 410.1 },
          { date: "Wed", price: 380.9, average: 420.7, min: 350.4 },
          { date: "Thu", price: 420.2, average: 430.1, min: 390.6 },
          { date: "Fri", price: 580.3, average: 510.9, min: 450.7 },
          { date: "Sat", price: 620.1, average: 550.4, min: 480.2 },
          { date: "Sun", price: 480.7, average: 460.3, min: 420.5 },
        ]
  ).map((item) => ({
    ...item,
    price: parseFloat(item.price.toFixed(1)),
    average: parseFloat(item.average.toFixed(1)),
    min: parseFloat(item.min.toFixed(1)),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{`${label}`}</p>
          <div className="space-y-1">
            <p className="flex items-center">
              <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
              <span className="text-gray-600">Current: </span>
              <span className="font-bold text-primary-600 ml-1">
                ${payload[0].value.toFixed(1)}
              </span>
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-600">Average: </span>
              <span className="font-bold text-green-600 ml-1">
                ${payload[1]?.value?.toFixed(1) || "0.0"}
              </span>
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-gray-600">Minimum: </span>
              <span className="font-bold text-red-600 ml-1">
                ${payload[2]?.value?.toFixed(1) || "0.0"}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const averagePrice =
    formattedData.reduce((sum, item) => sum + item.price, 0) /
    formattedData.length;
  const minPrice = Math.min(...formattedData.map((item) => item.price));

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="p-3 bg-primary-100 rounded-xl mr-4">
            <FaChartLine className="text-2xl text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Price Trends</h3>
            <p className="text-gray-600 text-sm">Real-time price analysis</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Current Filter</div>
            <div className="text-2xl font-bold text-primary-600">
              ${filters.maxPrice}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">7-Day Average</div>
            <div className="text-2xl font-bold text-green-600">
              ${averagePrice.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Lowest Price</div>
            <div className="text-2xl font-bold text-red-600">
              ${minPrice.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 sm:h-72 md:h-80 lg:h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value) => `$${value.toFixed(1)}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={10}
            />
            <Area
              type="monotone"
              dataKey="min"
              stroke="#ef4444"
              fill="#fecaca"
              fillOpacity={0.6}
              strokeWidth={2}
              name="Minimum Price"
              dot={{ stroke: "#ef4444", strokeWidth: 2, r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="average"
              stroke="#10b981"
              fill="#a7f3d0"
              fillOpacity={0.6}
              strokeWidth={2}
              name="Average Price"
              dot={{ stroke: "#10b981", strokeWidth: 2, r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.1}
              strokeWidth={3}
              name="Current Price"
              dot={{ stroke: "#6366f1", strokeWidth: 3, r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-500 rounded mr-2"></div>
          <span className="text-sm font-medium text-gray-700">
            Current Price (Real-time)
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm font-medium text-gray-700">
            7-Day Average
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm font-medium text-gray-700">
            Historical Minimum
          </span>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start">
          <FaInfoCircle className="text-primary-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Price Insights</h4>
            <p className="text-gray-600 text-sm">
              Prices typically drop on Wednesdays and Thursdays. Booking 3-4
              weeks in advance can save up to 20% compared to last-minute
              bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceGraph;
