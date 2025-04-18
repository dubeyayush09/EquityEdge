import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Watchlist from './pages/Watchlist';
import StockDetail from "./pages/StockDetail";
import Portfolio from './pages/portfolio';
import TopStocksTicker from './components/TopStocksTicker';
import HeroSection from './pages/HeroSection';

function App() {
  

  return (
    <Router>
      <TopStocksTicker />
      <Navbar />

      <Routes>
        <Route path="/" element={<HeroSection/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/stocks/:symbol" element={<StockDetail />} />
        <Route path="/portfolio" element={<Portfolio/>}/>
      </Routes>
    </Router>
  );
}

export default App
