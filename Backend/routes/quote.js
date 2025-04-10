const axios=require('axios')
const express=require('express')
const router=express.Router();
require('dotenv').config()

const API_KEY=process.env.API_KEY;

router.get("/quote", async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) return res.status(400).json({ msg: "Symbol does not found" });
  try {
    const response = await axios.get(`https://api.twelvedata.com/quote`, {
      params: {
        symbol,
        apikey: API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching quote:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

module.exports = router;
