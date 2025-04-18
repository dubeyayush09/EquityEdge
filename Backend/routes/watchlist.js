const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const User=require('../models/User');

router.get('/get',auth,async(req,res)=>{
    console.log("Fetching watchlist for:", req.user);

    try{
         const user=await User.findById(req.user.id);
    res.status(200).json(user.watchlist || [])

    }
    catch(err)
    {
        console.log("Error found in fetching watchlist in watchlist.js file inside routes")
        res.status(500).json({msg:'Server Error'})
        
    }
   


})

//ADD stock to watchlist
router.post('/add',auth,async(req,res)=>{
    console.log("decoded user from server:",req.user);
    const {symbol,name,close,change,percent_change}=req.body;
    console.log(symbol);
    console.log(name);
    
    
    

    try{
        if(!symbol || !name)
        {
            return res.status(400).json({msg:'Symbol and Name required'})
        }
        const user=await User.findById(req.user.id);
        //console.log(user)


        if(!Array.isArray(user.watchlist))
        {
            user.watchlist=[];
        }
        // console.log("user watchlist is ",user.watchlist)

        const alreadyExist=user.watchlist.find(stock=>stock.symbol===symbol);
        // console.log(alreadyExist)
        if(alreadyExist) {
            return res.status(400).json({msg:'Stock already exist in Watchlist'})
        }

        user.watchlist.push({symbol,name,close,change,percent_change});
        await user.save();
        res.json(user.watchlist);
    }catch(error)
    {
        console.log("Error in adding watchlist in watchlist inside routes");
        res.status(500).json({msg:'Server Error'})
        
    }
});


//Delete stock from watchlist
router.delete('/:symbol',auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);
        user.watchlist=user.watchlist.filter(stock=>stock.symbol!=req.params.symbol);
        await user.save();
        res.json(user.watchlist);
    }
    catch(error)
    {
        res.status(500).json({msg:'Server Error'})
        console.log("Error in deleting stock in watchlist file in routes folder")
    }
})

module.exports=router