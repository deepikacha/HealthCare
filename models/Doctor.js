const mongoose=require('mongoose');


const doctorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    specialization:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
})

module.exports=mongoose.model('Doctor',doctorSchema);