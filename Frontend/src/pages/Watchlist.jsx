import { useContext,useEffect ,useState} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import axios from "axios";


const Watchlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (!user) navigate("/login");
    else fetchWatchlist();
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
    //   console.log("token sent from fetchWatchList ",token);
      const res = await axios.get("http://localhost:5000/api/watchlist/get", {
        headers: { Authorization:`Bearer ${token}`},
      });
      setWatchlist(res.data);
    } catch (err) {
      console.error("Error fetching list", err);
    }
  };

  const addToWatchlist = async (stock) => {
    try {
      console.log("stock at watchlist",stock);
      const token = localStorage.getItem('token');
      await axios.post(
        "http://localhost:5000/api/watchlist/add",
        stock ,
        { headers: { Authorization: `Bearer ${token}` } }
      );
     
      fetchWatchlist();
      console.log(watchlist)
    } catch (err) {
      console.error("Error found in add to watchlist file", err);
    }
  };
const toNumber = (val) => {
  if (typeof val === "string") {
    const cleaned = val.replace(/[,%]/g, "").trim(); // removes commas, % signs
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
              {stock.name} ({stock.symbol})
            </h3>
            <p>Price: ${toNumber(stock.close).toFixed(2)}</p>

            <p
              className={`${
                parseFloat(stock.change) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Change: ${toNumber(stock.change).toFixed(2)} (
              {toNumber(stock.percent_change).toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;