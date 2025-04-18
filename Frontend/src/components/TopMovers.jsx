import React, { useState, useEffect } from "react";
import axios from "axios";

const TopMovers = () =>
   {
    const [filterType, setFilterType] = useState("gainers");
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStockData = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would fetch from an actual API
        // For demo purposes, we're simulating API data
        const gainers = [
          {
            name: "Royale Manor Hotels",
            symbol: "RAYALEMA",
            price: 56.11,
            change: 20.64,
            logo: "red",
          },
          {
            name: "SecMark Consultancy",
            symbol: "SECMARK",
            price: 124.29,
            change: 19.99,
            logo: "blue",
          },
          {
            name: "Integrated Thermistor",
            symbol: "IIL",
            price: 23.95,
            change: 19.99,
            logo: "indigo",
          },
          {
            name: "Amrapali Industries",
            symbol: "AMRAPLIN",
            price: 18.7,
            change: 19.99,
            logo: "red",
          },
          {
            name: "Garment Mantra",
            symbol: "GARMNTMNTR",
            price: 1.76,
            change: 19.71,
            logo: "orange",
          },
        ];

        const losers = [
          {
            name: "Adani Power",
            symbol: "ADANIPOWER",
            price: 529.75,
            change: -4.82,
            logo: "green",
          },
          {
            name: "Tata Teleservices",
            symbol: "TTML",
            price: 89.2,
            change: -4.65,
            logo: "blue",
          },
          {
            name: "Vodafone Idea",
            symbol: "IDEA",
            price: 12.85,
            change: -3.96,
            logo: "purple",
          },
          {
            name: "Dixon Technologies",
            symbol: "DIXON",
            price: 9578.15,
            change: -3.86,
            logo: "yellow",
          },
          {
            name: "Zomato",
            symbol: "ZOMATO",
            price: 174.9,
            change: -3.75,
            logo: "red",
          },
        ];

        // Wait for simulated API response
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStockData(filterType === "gainers" ? gainers : losers);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchStockData();

      // Poll for updates every 30 seconds
      const intervalId = setInterval(fetchStockData, 30000);
      return () => clearInterval(intervalId);
    }, [filterType]);

    const getLogoColor = (color) => {
      const colors = {
        red: "bg-red-100 text-red-500",
        blue: "bg-blue-100 text-blue-500",
        indigo: "bg-indigo-100 text-indigo-500",
        orange: "bg-orange-100 text-orange-500",
        green: "bg-green-100 text-green-500",
        purple: "bg-purple-100 text-purple-500",
        yellow: "bg-yellow-100 text-yellow-500",
      };

      return colors[color] || "bg-gray-100 text-gray-500";
    };

    const getLogo = (logo) => {
      const logos = {
        red: <path d="M12,2L4,7v10l8,5l8-5V7L12,2z" />,
        blue: <path d="M4,4h16v16H4V4z M6,6v12h12V6H6z" />,
        indigo: <path d="M12,2L2,12h5v10h10V12h5L12,2z" />,
        orange: <path d="M12,2L4,12h4v10h8V12h4L12,2z" />,
        green: (
          <path d="M12,2c5.5,0,10,4.5,10,10s-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2z" />
        ),
        purple: (
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        ),
        yellow: <path d="M3,3H21V21H3V3M5,5V19H19V5H5Z" />,
      };

      return logos[logo] || <path d="M12,2L4,7v10l8,5l8-5V7L12,2z" />;
    };

    return (
      <div className="font-sans text-gray-800 p-4 bg-gray-50 rounded-lg shadow w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            Top {filterType === "gainers" ? "gainers" : "losers"}
          </h2>
          <div className="flex items-center">
            <div className="relative">
              <button
                className="text-blue-500 font-medium flex items-center gap-1 border border-blue-200 rounded-lg px-3 py-1 hover:bg-blue-50 transition-colors"
                onClick={() =>
                  setFilterType(filterType === "gainers" ? "losers" : "gainers")
                }
              >
                {filterType === "gainers" ? "Show Losers" : "Show Gainers"}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {stockData.map((stock, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getLogoColor(
                      stock.logo
                    )}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      {getLogo(stock.logo)}
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{stock.name}</p>
                    <p className="text-gray-500 text-sm">{stock.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{stock.price}</div>
                  <div
                    className={
                      stock.change >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change)}%
                  </div>
                </div>
                <div className="ml-2 text-blue-500 cursor-pointer hover:bg-blue-50 rounded-full p-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 8v8M8 12h8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default TopMovers;
