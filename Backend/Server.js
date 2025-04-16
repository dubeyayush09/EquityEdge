const express=require('express');
const mongoose=require('mongoose');
// const http=require('http');
// const {Server}=require('socket.io');
const cors=require('cors')
require('dotenv').config();
const authRoutes=require('./routes/auth')
const watchlistRoutes=require('./routes/watchlist')
const quote =require('./routes/quote')
const stocksRoutes=require('./routes/stocks')

const app=express();
app.use(express.json());
app.use(cors());

// const WebSocket = require("ws");
// const axios = require("axios");

// const TWELVE_API_KEY = process.env.TWELVE_API_KEY;
// const symbolClients = new Map(); // Tracks subscriptions per client



//Web sockets
// const server=http.createServer(app);
// const io= new Server(server,{
//   cors:{
//     origin:"http://localhost:5173",
//     methods:["GET","POST"]
//   }
// });
// io.on("connection", (socket) => {
//   console.log("🟢 New client connected:", socket.id);

//   let ws;

//   socket.on("subscribeToStock", (symbols) => {
//     console.log(`📩 ${socket.id} subscribed to:`, symbols);

//     ws = new WebSocket("wss://ws.twelvedata.com/v1/price");

//     ws.on("open", () => {
//       ws.send(
//         JSON.stringify({
//           action: "subscribe",
//           params: {
//             apikey: TWELVE_API_KEY,
//             symbols: symbols.join(","), // join symbols like "AAPL,TSLA,NVDA"
//           },
//         })
//       );
//     });

//     ws.on("message", (data) => {
//       try {
//         const parsed = JSON.parse(data);
//         if (parsed.symbol && parsed.price) {
//           const priceUpdate = [
//             {
//               symbol: parsed.symbol,
//               price: parseFloat(parsed.price).toFixed(2),
//               change: (Math.random() * 10 - 5).toFixed(2), // Simulated
//               percent_change: (Math.random() * 2 - 1).toFixed(2),
//             },
//           ];
//           socket.emit("priceUpdate", priceUpdate);
//         }
//       } catch (err) {
//         console.error("🔴 Error parsing WebSocket data:", err);
//       }
//     });

//     ws.on("error", (err) => {
//       console.error("WebSocket Error:", err.message);
//     });

//     ws.on("close", () => {
//       console.log(`🔌 WebSocket closed for ${socket.id}`);
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected:", socket.id);
//     if (ws) ws.close();
//   });
// });



//MongoDB connection

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


//Sample routes
app.get('/',(req,res)=>{
    res.send('Stock tracker API running');
})
app.use('/api/auth',authRoutes);
app.use('/api/watchlist',watchlistRoutes)
app.use('/api/stocks',stocksRoutes)
app.use('/api',quote)

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on PORT ${PORT}`));