import { useState, useEffect } from "react";

// Market Sectors Component
function MarketSectors() {
  const [selectedTab, setSelectedTab] = useState("Broad based");
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would fetch from an actual API
        // For demo purposes, we're simulating API data
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: [
                { name: "NIFTY 50", value: 23840.1, change: 1.72 },
                { name: "NIFTY 100 Largecap", value: 24406.65, change: 1.54 },
                { name: "NIFTY 500", value: 21669.95, change: 1.24 },
                {
                  name: "NIFTY Largemidcap 250",
                  value: 15045.55,
                  change: 1.03,
                },
                { name: "NIFTY Next 50", value: 64225.75, change: 0.67 },
              ],
            });
          }, 1000);
        });
        setMarketData(response.data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Poll for updates every 30 seconds
    const intervalId = setInterval(fetchMarketData, 30000);
    return () => clearInterval(intervalId);
  }, [selectedTab]);

  return (
    <div className="font-sans text-gray-800 p-4 bg-white rounded-lg shadow w-full mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Market and sectors</h2>
        <div className="flex items-center">
          <span className="text-blue-500 font-medium">High</span>
          <span className="text-blue-500 ml-1">:</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
            selectedTab === "Broad based"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTab("Broad based")}
        >
          Broad based
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
            selectedTab === "Sectoral"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTab("Sectoral")}
        >
          Sectoral
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
            selectedTab === "Gold & Forex"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTab("Gold & Forex")}
        >
          Gold & Forex
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {marketData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {item.value.toLocaleString("en-IN")}
                  </div>
                  <div
                    className={`flex items-center justify-end ${
                      item.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    <span className="text-xs mr-1">
                      {item.change >= 0 ? "▲" : "▼"}
                    </span>{" "}
                    {Math.abs(item.change)}%
                  </div>
                </div>
              </div>
              {index < marketData.length - 1 && (
                <div className="border-t border-gray-100 mt-6"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default MarketSectors;