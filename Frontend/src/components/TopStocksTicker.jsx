import React, { useEffect, useState } from "react";
import axios from "axios";

const TopStocksTicker = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/stocksAttop/top-stocks"
        );
        setStocks(res.data);
      } catch (err) {
        console.error("Failed to fetch stocks", err);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className="w-full bg-black text-white overflow-hidden whitespace-nowrap py-2 relative group">
      <div className="inline-block whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
        {[...stocks, ...stocks].map((stock, index) => (
          <span key={index} className="mx-6 inline-block">
            {stock.symbol}: ₹{stock.price}
            <span
              className={`ml-2 ${
                stock.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ({stock.change.toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>

      {/* Inline style for keyframes */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }

          .animate-marquee {
            animation: marquee 60s linear infinite;
          }

          .group:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  );
};

export default TopStocksTicker;