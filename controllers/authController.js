const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

const signup = async (req,res)=>{
    
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const nameRegex=/^[A-Za-z\s]+$/;
        if(!nameRegex.test(name.trim())|| name.trim().length===0){
              return res.status(400).json({message:"Name must contain only letters and spaces"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters long"});
        }
        try{
        
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
        })
      return res.status(201).json({message:"User Registered successfully",userId:user._id})

    }
    catch(error){
        console.log("registration error",error.message);
        res.status(500).json({message:"Registration failed"});
    }

}

const login = async (req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"email and password are required"});
        }
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters long"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"passwords doesnot match"});
        }

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY);
        return res.json({token});

    }
    catch(error){
        console.log("Login error:",error.message);
        return res.status(500).json({message:"Login failed"});
        
    }
}

module.exports={signup,login};