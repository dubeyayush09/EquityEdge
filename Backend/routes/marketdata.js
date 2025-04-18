const express = require("express");
const yahooFinance = require("yahoo-finance2").default;
const router = express.Router();

router.get("/market-data", async (req, res) => {
  try {
    const quotes = await yahooFinance.quote(["^NSEI", 
      "^BSESN",        
      "^CNX100",       
      "^CRSLDX",       
      "^CNXMDPT",      
      "^CNXSMCP",      
      "^NSMIDCAP50",
      "^NSEBANK",]);
    res.json({ result: quotes });

  } catch (error) {
    console.error("Yahoo Finance Error:", error);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

module.exports = router;
