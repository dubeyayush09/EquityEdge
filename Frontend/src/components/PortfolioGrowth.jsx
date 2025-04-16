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

const PortfolioGrowth=()=>{

 const [range, setRange] = useState("1month");
 const [historyData, setHistoryData] = useState([]);


 useEffect(() => {
     const fetchPortfolioHistory = async () => {
       try {
         const res = await axios.get(`http://localhost:5000/api/stocks/portfolio-history?range=${range}`);
         setHistoryData(res.data);
       } catch (err) {
         console.error("Error fetching portfolio history", err);
       }
     };
 
     fetchPortfolioHistory();
   }, [range]);

   return(
    

    <div className="space-x-2 my-4">
        {["1Day", "1week", "1month", "3months"].map((label) => (
        <button
         key={label}
         onClick={() => setRange(label)}
         className={`px-3 py-1 rounded-full border ${
         range === label ? "bg-blue-600 text-white" : "bg-white text-blue-600"
         }`}
         >
        {label === "1week" ? "1W" : label==="1Day" ? "1D" : label === "1month" ? "1M" : "3M"}
        </button>
        ))}
    

  {historyData.length > 0 && (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
      <p>
        <strong>Start:</strong> ₹{historyData[0].totalValue.toFixed(2)} &nbsp;
        <strong>Now:</strong> ₹
        {historyData[historyData.length - 1].totalValue.toFixed(2)}
      </p>
      <p
        className={
          historyData[0].totalValue <=
          historyData[historyData.length - 1].totalValue
            ? "text-green-600"
            : "text-red-600"
        }
      >
        <strong>
          Change:{" "}
          {(
            ((historyData[historyData.length - 1].totalValue -
              historyData[0].totalValue) /
              historyData[0].totalValue) *
            100
          ).toFixed(2)}
          %
        </strong>
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historyData}>
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalValue"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )};
  </div>
  );
}
export default PortfolioGrowth
   
