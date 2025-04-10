const jwt=require('jsonwebtoken');
 
const auth=(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("token in auth",token)
    if(!token) return res.status(401).json({msg:'No token, authorization denied'})

        try{
            // console.log("we are in try block of auth")
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            // console.log("hey this decoding ");

            if (!decoded.id) {
              console.log("❌ Token payload doesn't contain 'id'");
              return res.status(400).json({ msg: "Invalid token payload" });
            }
            req.user=decoded;
            next();

        } catch(error)
        {
            res.status(400).json({msg:'Token not valid'})
        }
};

module.exports=auth;