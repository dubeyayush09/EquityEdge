import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { Link } from "react-router-dom";



const API_KEY = import.meta.env.VITE_TWELVE_API_KEY; 
console.log(API_KEY)// replace with actual

const Watchlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchWatchlist();
  }, [user]);

  useEffect(() => {
    if (watchlist.length ===0 || !API_KEY) console.log("api nhi hai");

    const validSymbols = watchlist.map((item) => item.symbol).join(",");
    if (!validSymbols) return;

    const ws = new WebSocket(
      `wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`
    );

    ws.onopen = () => {
      console.log("🟢 Connected to Twelve Data WebSocket");

      ws.send(
        JSON.stringify({
          action: "subscribe",
          params: {
            symbols: validSymbols,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📈 Live update:", data);

      if (data.event === "subscribe-status" && data.status === "error") {
    console.error("🚨 Subscription failed:", JSON.stringify(data.fails, null, 2));
    return;
  } // to check subscripiton status


      if (data.symbol) {
        setWatchlist((prev) =>
          prev.map((stock) =>
            stock.symbol === data.symbol
              ? {
                  ...stock,
                  price: data.price,
                  change: data.change,
                  percent_change: data.percent_change,
                }
              : stock
          )
        );
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    ws.onclose = () => {
      console.warn("🔌 WebSocket closed");
    };

    setSocket(ws);

    return () => ws.close();
  }, [watchlist]);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/watchlist/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(res.data);
    } catch (err) {
      console.error("Error fetching list", err);
    }
  };

  const addToWatchlist = async (stock) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/watchlist/add", stock, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWatchlist();
    } catch (err) {
      console.error("Error adding to watchlist", err);
    }
  };

  const handleDelete = async (symbol) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/watchlist/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWatchlist();
    } catch (err) {
      console.error("Error deleting from watchlist", err);
    }
  };

  const toNumber = (val) => {
    if (typeof val === "string") {
      const cleaned = val.replace(/[,%]/g, "").trim();
      return parseFloat(cleaned) || 0;
    } else if (typeof val === "number") {
      return val;
    }
    return 0;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Your Watchlist</h2>
      <SearchBar onAdd={addToWatchlist} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {watchlist.map((stock, idx) => (
          <div key={idx} className="border rounded p-4 shadow bg-white">
            <h3 className="font-bold text-lg">
              {stock.name} (
              <Link to={`/stocks/${stock.symbol}`}>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {stock.symbol}
                </span>
              </Link>
              )
            </h3>

            <p>Price: ${toNumber(stock.price || stock.close).toFixed(2)}</p>
            <p
              className={`${
                toNumber(stock.change) >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Change: ${toNumber(stock.change).toFixed(2)} (
              {toNumber(stock.percent_change).toFixed(2)}%)
            </p>
            <button
              onClick={() => handleDelete(stock.symbol)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
   
    </div>
  );
};

export default Watchlist;
