const jwt=require('jsonwebtoken');
const User=require('../models/User');

const authenticate= async(req,res,next)=>{
    try{
 const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(400).json("authorization header is missing");
    }
    const token=authHeader.split(' ')[1];
    if(!token){
        return res.status(400).json("token is missing");
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user=await User.findById(decoded.userId);
    next();
    }
   catch(error){
    console.log(error.message);
    return res.status(401).json({message:"Invalid token"});
   }


}
module.exports={authenticate};