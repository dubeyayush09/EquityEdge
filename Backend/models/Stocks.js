const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Stock", stockSchema);
