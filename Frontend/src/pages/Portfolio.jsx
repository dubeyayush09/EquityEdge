import { useEffect, useState } from "react";
import axios from "axios";
import PortfolioGraph from "../components/PortfolioGraph";
import PortfolioGrowth from "../components/PortfolioGrowth";


const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [newStock, setNewStock] = useState({
    symbol: "",
    quantity: 0,
    buyPrice: 0,
  });



 

  


  const API_KEY = import.meta.env.VITE_TWELVE_API_KEY;
  const BACKEND_URL = "http://localhost:5000/api/stocks"; 

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(BACKEND_URL);
      const ownedStocks = response.data;

      const updatedPortfolio = await Promise.all(
        ownedStocks.map(async (stock) => {
          try {
            const res = await axios.get(
              `https://api.twelvedata.com/price?symbol=${stock.symbol}&apikey=${API_KEY}`
            );
            const currentPrice = parseFloat(res.data.price);
            const investment = stock.quantity * stock.buyPrice;
            const value = stock.quantity * currentPrice;
            const profitLoss = value - investment;

            return { ...stock, currentPrice, investment, value, profitLoss };
          } catch (error) {
            console.error(`Error fetching price for ${stock.symbol}`, error);
            return {
              ...stock,
              currentPrice: 0,
              investment: 0,
              value: 0,
              profitLoss: 0,
            };
          }
        })
      );

      const totalInvested = updatedPortfolio.reduce(
        (acc, stock) => acc + stock.investment,
        0
      );
      const totalCurrentValue = updatedPortfolio.reduce(
        (acc, stock) => acc + stock.value,
        0
      );

      setPortfolio(updatedPortfolio);
      setTotalInvestment(totalInvested);
      setTotalValue(totalCurrentValue);
    } catch (error) {
      console.error("Error fetching portfolio", error);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BACKEND_URL, newStock);
      setNewStock({ symbol: "", quantity: 0, buyPrice: 0 });
      fetchPortfolio();
    } catch (error) {
      console.error("Error adding stock", error);
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      fetchPortfolio();
    } catch (error) {
      console.error("Error deleting stock", error);
    }
  };

  const handleUpdateStock = async (id, updatedStock) => {
    try {
      await axios.put(`${BACKEND_URL}/${id}`, updatedStock);
      fetchPortfolio();
    } catch (error) {
      console.error("Error updating stock", error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);


//   useEffect(() => {
//     const fetchLivePrices = async () => {
//       try {
//         console.log("live prices called")
//         const updatedStocks = await Promise.all(
//           portfolio.map(async (stock) => {
//             const res = await axios.get(
//               `http://localhost:5000/api/stocks/stock-live-price/${stock.symbol}`
//             );
//             return {
//               ...stock,
//               livePrice: parseFloat(res.data.price),
//               currentValue: stock.quantity * parseFloat(res.data.price),
//             };
//           })
//         );
//         setPortfolio(updatedStocks);
//       } catch (err) {
//         console.error("Error fetching live prices", err);
//       }
//     };

//     fetchLivePrices();
//     const interval = setInterval(fetchLivePrices, 10000); 

//     return () => clearInterval(interval);
//   }, [portfolio.length]);


 

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📊 My Portfolio</h1>
      <form onSubmit={handleAddStock} className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Symbol"
          value={newStock.symbol}
          onChange={(e) =>
            setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newStock.quantity}
          onChange={(e) =>
            setNewStock({ ...newStock, quantity: parseInt(e.target.value) })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Buy Price"
          value={newStock.buyPrice}
          onChange={(e) =>
            setNewStock({ ...newStock, buyPrice: parseFloat(e.target.value) })
          }
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Stock
        </button>
      </form>
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Symbol</th>
              <th className="py-2 px-4">Qty</th>
              <th className="py-2 px-4">Buy Price</th>
              <th className="py-2 px-4">Current Price</th>
              <th className="py-2 px-4">Investment</th>
              <th className="py-2 px-4">Value</th>
              <th className="py-2 px-4">P&L</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock) => (
              <tr key={stock._id} className="border-b">
                <td className="py-2 px-4 font-semibold">{stock.symbol}</td>
                <td className="py-2 px-4">{stock.quantity}</td>
                <td className="py-2 px-4">${stock.buyPrice.toFixed(2)}</td>
                <td className="py-2 px-4">${stock.currentPrice.toFixed(2)}</td>
                <td className="py-2 px-4">${stock.investment.toFixed(2)}</td>
                <td className="py-2 px-4">${stock.value.toFixed(2)}</td>
                <td
                  className={`py-2 px-4 font-bold ${
                    stock.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {(stock.profitLoss >= 0 ? "+" : "-") +
                    "$" +
                    Math.abs(stock.profitLoss).toFixed(2)}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="text-red-600 font-bold mr-2"
                    onClick={() => handleDeleteStock(stock._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-blue-600 font-bold"
                    onClick={() =>
                      handleUpdateStock(stock._id, {
                        ...stock,
                        quantity: prompt("New quantity", stock.quantity),
                        buyPrice: prompt("New buy price", stock.buyPrice),
                      })
                    }
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-lg font-medium">
        💸 Total Investment:{" "}
        <span className="font-bold">${totalInvestment.toFixed(2)}</span> <br />
        📈 Current Value:{" "}
        <span className="font-bold">${totalValue.toFixed(2)}</span> <br />
        📊 Net P&L:{" "}
        <span
          className={`font-bold ${
            totalValue - totalInvestment >= 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {(totalValue - totalInvestment >= 0 ? "+" : "-") +
            "$" +
            Math.abs(totalValue - totalInvestment).toFixed(2)}
        </span>
      </div>

      <PortfolioGrowth/>

      <PortfolioGraph />
    </div>
  );
};

export default Portfolio;
