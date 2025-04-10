import { Link,useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    
    logout();
    toast.success("Logged out Successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        StockMate 📈
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span className="font-medium">Hi, {user.name}</span>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/watchlist" className="hover:underline">
              Watchlist
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-3 py-1 rounded font-medium hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;