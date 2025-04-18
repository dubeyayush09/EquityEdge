// routes/stocksRoute.js
const express = require("express");
const router = express.Router();
const yahooFinance = require("yahoo-finance2").default;

// Sample Nifty 50 stocks (you can expand this)
const stocks = [
 'RELIANCE.NS', 
'TCS.NS' , 
'INFY.NS' , 
'HDFCBANK.NS ', 
'ICICIBANK.NS' , 
'SBIN.NS' , 
'LT.NS',  
'ITC.NS' , 
'AXISBANK.NS'  ,
'MARUTI.NS' , 
'SUNPHARMA.NS' , 
'HINDUNILVR.NS' , 
'ADANIENT.NS' , 
'BAJFINANCE.NS', 
'WIPRO.NS' , 
'NTPC.NS',  
'BHARTIARTL.NS',  
'ONGC.NS' ,
'POWERGRID.NS ', 
'NESTLEIND.NS',

];

router.get("/top-stocks", async (req, res) => {
  try {
    const results = await Promise.all(
      stocks.map(async (symbol) => {
        const data = await yahooFinance.quote(symbol);
        return {
          name: data.shortName,
          symbol: symbol,
          price: data.regularMarketPrice,
          change: data.regularMarketChangePercent,
        };
      })
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

module.exports = router;
