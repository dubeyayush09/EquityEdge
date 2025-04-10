import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const SearchBar = ({ onAdd }) => {
  const [query, setQuery] = useState("");
  const [stock, setStock] = useState(null);

  const handleSearch = async () => {
    if (!query) return toast.error("Enter a Stock Symbol");

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/quote/?symbol=${query}
        `
      );
      
      if (data && data.name) {
        setStock(data);
        console.log("Price:", parseFloat(stock.close).toFixed(2));
        console.log("Change:", parseFloat(stock.change).toFixed(2));
        console.log(
          "Percent Change:",
          parseFloat(stock.percent_change).toFixed(2)
        );


      } else {
        toast.error("Invalid Symbol");
      }
    } catch (error) {
      toast.error("Error fetching stock");
    }
    
  };

  return (
    <div className="p-4 border rounded bg-white shadow mb-6">
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search By Symbol"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.toUpperCase());
          }}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded "
        >
          Search
        </button>
      </div>
      {stock && (
        <div className="p-4 border rounded shadow bg-gray-50">
          <h3 className="text-lg font-semibold">
            {stock.name} ({stock.symbol})
          </h3>
          <p>Price: ${stock.close}</p>
          <p>
            Change: {stock.change} ({stock.percent_change}%)
          </p>
        
          <button
            onClick={() => onAdd(stock)}
            className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
          >
            Add to Watchlist
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;