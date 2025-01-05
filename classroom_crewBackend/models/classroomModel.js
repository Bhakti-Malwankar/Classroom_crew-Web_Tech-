const mongoose=require('mongoose');

const ClassroomSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',   //reference to the user model
        required:true,
    },
    description:{
        type:String,
        trim:true,
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',//Reference to the post model
    }]

},{timestamps:true});


const Classroom=mongoose.model('Classroom',ClassroomSchema);

module.exports=Classroom;