import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockInfo, setStockInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [interval, setInterval] = useState("1month");
  const [isLoading, setIsLoading] = useState(true);
  const [stockMeta, setStockMeta] = useState(null);


  const [timeframe, setTimeframe] = useState("1M"); // default

  const timeframes = [
    {label:"1D",value:"1D"},
    { label: "1M", value: "1M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    {label:"5Y",value:"5Y"}
  ];


  const API_KEY = import.meta.env.VITE_TWELVE_API_KEY; // 🔁 Replace with your Twelve Data key

  // Get live stock info
useEffect(() => {
  const fetchStockData = async () => {
    try {
      let interval;
      let outputsize;

      switch (timeframe) {
        case "1D":
          interval = "5min";
          outputsize = 78;
          break;
        case "1M":
          interval = "1day";
          outputsize = 30;
          break;
        case "6M":
          interval = "1week";
          outputsize = 26;
          break;
        case "1Y":
          interval = "1week";
          outputsize = 52;
          break;
        case "5Y":
          interval = "1month";
          outputsize = 60;
          break;
        default:
          interval = "1day";
          outputsize = 30;
      }

      const res = await axios.get(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`
      );

      const values = res.data?.values?.reverse() || [];
      setChartData(values);

      if (values.length > 0) {
        setStockInfo(values[values.length - 1]);
      }

      setStockMeta(res.data.meta);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  if (symbol) fetchStockData();
}, [symbol, timeframe]);



  // Get historical data for chart
  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=365&apikey=${API_KEY}`
      );
      setChartData(response.data.values.reverse()); // reverse to get oldest -> newest
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching chart data", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchStockInfo();
    fetchChartData();
  }, [symbol]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{symbol} Stock Details</h1>

      {/* --- Stock Info Section --- */}
      {stockInfo ? (
        <div className="bg-white shadow-md p-4 rounded-lg grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          <div>
            <strong>Price:</strong> ${stockInfo.close}
          </div>
          <div>
            <strong>Open:</strong> ${stockInfo.open}
          </div>
          <div>
            <strong>High:</strong> ${stockInfo.high}
          </div>
          <div>
            <strong>Low:</strong> ${stockInfo.low}
          </div>
          <div>
            <strong>Volume:</strong> {stockInfo.volume}
          </div>
          <div>
            <strong>Exchange:</strong> {stockMeta?.exchange}
          </div>
        </div>
      ) : (
        <p>Loading stock info...</p>
      )}

      {/* --- Chart Filters --- */}
      <div className="flex gap-4 mb-4">
        {timeframes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTimeframe(t.value)}
            className={`px-4 py-2 rounded ${
              timeframe === t.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* --- Chart --- */}
      <div className="bg-white p-4 rounded-lg shadow">
        {isLoading ? (
          <p>Loading chart...</p>
        ) : (
          <div
            style={{
              width:
                chartData.length > 60 ? `${chartData.length * 15}px` : "100%",
              height: "400px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="datetime"
                  minTickGap={20}
                  tickFormatter={(date) =>
                    timeframe === "5Y" ? date.slice(0, 4) : date.slice(5)
                  }
                />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
              
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetail;
