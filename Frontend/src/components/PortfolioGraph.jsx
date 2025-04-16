import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFE",
  "#F95C5C",
];

const PortfolioGraph= () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stocks");
        setPortfolio(res.data);
      } catch (err) {
        console.error("Error fetching portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const chartData = portfolio.map((stock) => ({
    name: stock.symbol,
    value: stock.quantity * stock.buyPrice,
  }));

  const totalValue = chartData.reduce((sum, stock) => sum + stock.value, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📈 Portfolio Chart</h2>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            chartType === "pie" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setChartType("pie")}
        >
          Pie Chart
        </button>
        <button
          className={`px-4 py-2 rounded ${
            chartType === "bar" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setChartType("bar")}
        >
          Bar Chart
        </button>
        <button
          className={`px-4 py-2 rounded ${
            chartType === "line" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setChartType("line")}
        >
          Line Chart
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : portfolio.length === 0 ? (
        <p>No stocks in your portfolio yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "pie" && (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}

          {chartType === "bar" && (
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}

          {chartType === "line" && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}

      {!loading && portfolio.length > 0 && (
        <p className="mt-4 font-bold">
          Total Portfolio Value: ₹{totalValue.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default PortfolioGraph;
