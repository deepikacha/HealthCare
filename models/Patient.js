const mongoose=require('mongoose');

const patientSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    age:{
      type:Number,
      required:true,
    },
    disease:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

})

module.exports=mongoose.model('Patient',patientSchema);
