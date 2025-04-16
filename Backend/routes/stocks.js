const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const Stock=require('../models/Stocks')
const axios = require("axios");


require("dotenv").config();


router.get("/portfolio-history", async (req, res) => {
  try {
    const range = req.query.range || "1month"; // default
    let outputsize = 30;
    if(range==="1Day") outputsize=1;
    if (range === "1week") outputsize = 7;
    if (range === "3months") outputsize = 90;

    const portfolio = await Stock.find();

    const timeSeriesData = await Promise.all(
      portfolio.map(async (stock) => {
        const response = await axios.get(
          "https://api.twelvedata.com/time_series",
          {
            params: {
              symbol: stock.symbol,
              interval: "1day",
              outputsize,
              apikey: process.env.API_KEY,
            },
          }
        );

        return {
          symbol: stock.symbol,
          quantity: stock.quantity,
          prices: response.data.values.map((v) => ({
            date: v.datetime,
            close: parseFloat(v.close),
          })),
        };
      })
    );

    const mergedData = {};
    timeSeriesData.forEach((stock) => {
      stock.prices.forEach((p) => {
        if (!mergedData[p.date]) mergedData[p.date] = 0;
        mergedData[p.date] += stock.quantity * p.close;
      });
    });

    const formattedData = Object.entries(mergedData)
      .map(([date, totalValue]) => ({ date, totalValue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(formattedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch portfolio history" });
  }
});





router.get("/stock-live-price/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const response = await axios.get(`https://api.twelvedata.com/price`, {
      params: {
        function: "GLOBAL_QUOTE",
        symbol,
        apikey: process.env.API_KEY, // <-- Put this in your .env
      },
    });
    console.log(response)

    const price = response.data["Global Quote"]["05. price"];
    if (!price) throw new Error("No price found");

    res.json({ symbol, price: parseFloat(price) });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching live price", message: err.message });
  }
});


router.post("/",async (req, res) => {
  const newStock = new Stock(req.body);
  try {
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


  router.get("/", async (req, res) => {
    try {
      const stocks = await Stock.find();
      res.json(stocks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

    router.put("/:id", async (req, res) => {
      try {
        const updatedStock = await Stock.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        res.json(updatedStock);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });



      router.delete("/:id", async (req, res) => {
        try {
          await Stock.findByIdAndDelete(req.params.id);
          res.json({ message: "Stock deleted" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
      module.exports=router

