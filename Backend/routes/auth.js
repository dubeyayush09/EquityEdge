const express=require('express');
const router=express.Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/User');


router.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;

    try{
        if(!name || !email || !password)
        {
            res.status(400).json({msg:'Every Field required'});
            console.log("Every field Required")
        }
        const existingUser=await User.findOne({email});

        //checking whether user already exist or not
        if(existingUser) return res.status(400).json({msg:'User alreasy exists'});

        //hashing 
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //Save user to db
        const user=new User({name,email,password:hashedPassword});
        console.log(user);

        await user.save();


        //generating token
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        console.log(token);

        res.status(201).json({token,user:{id:user._id,name,email}})
    }
    catch(err)
    {

        res.status(500).json({msg:'Server Error'})
        console.log("Hey I found error in register in routes folder")
    }
});



//Login
router.post('/Login',async(req,res)=>{
    const{email,password}=req.body;


    try{
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({msg:'Invalid credentials'})

            //check password
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:'Invalid Credentials'});


        //generate token
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});

        res.status(200).json({token,user:{id:user._id,name:user.name,email}})
        console.log("logged in")

    }
    catch(err)
    {
        res.status(500).json({msg:'Server Error'})
        console.log("Error found during Login in routes folder")
    }
})

module.exports=router;