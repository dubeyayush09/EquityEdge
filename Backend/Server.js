const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors')
require('dotenv').config();
const authRoutes=require('./routes/auth')
const watchlistRoutes=require('./routes/watchlist')

const app=express();
app.use(express.json());
app.use(cors());


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

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on PORT ${PORT}`));