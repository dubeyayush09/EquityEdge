import { useEffect, useState } from "react";
import axios from "axios";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Dummy owned stocks
  const ownedStocks = [
    { symbol: "AAPL", quantity: 10, buyPrice: 120 },
    { symbol: "GOOGL", quantity: 5, buyPrice: 100 },
    { symbol: "TSLA", quantity: 8, buyPrice: 220 },
  ];

  const API_KEY = import.meta.env.VITE_TWELVE_API_KEY;

  const fetchCurrentPrices = async () => {
    const updatedPortfolio = [];

    for (let stock of ownedStocks) {
      try {
        const res = await axios.get(
          `https://api.twelvedata.com/price?symbol=${stock.symbol}&apikey=${API_KEY}`
        );

        const currentPrice = parseFloat(res.data.price);
        const investment = stock.quantity * stock.buyPrice;
        const value = stock.quantity * currentPrice;
        const profitLoss = value - investment;

        updatedPortfolio.push({
          ...stock,
          currentPrice,
          investment,
          value,
          profitLoss,
        });
      } catch (error) {
        console.error(`Error fetching price for ${stock.symbol}`, error);
      }
    }

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
  };

  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📊 My Portfolio</h1>

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
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, idx) => (
              <tr key={idx} className="border-b">
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
                  {stock.profitLoss >= 0 ? "+" : "-"}$
                  {Math.abs(stock.profitLoss).toFixed(2)}
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
    </div>
  );
};

export default Portfolio;
