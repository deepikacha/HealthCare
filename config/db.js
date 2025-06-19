const mongoose=require('mongoose');

const dbConnect=async (req,res)=>{
    const url=process.env.MONGO_URI;
    try{
        if(!url){
            throw new error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(url);
        console.log("Mongodb connected successfully");
    }
    catch(error){
        console.log("Mongodb connection error",error.message);
    }
}

module.exports=dbConnect;