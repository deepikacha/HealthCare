const mongoose=require('mongoose');

const mappingSchema=mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
    }
})

module.exports=mongoose.model('Mapping',mappingSchema);