const mongoose = require('mongoose');

const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        require:true,
        maxLength:32,
        trim:true
    },photo:{
        type:String,
        require:true,

    },

},{timestamps:true});

module.exports=mongoose.model('Category',categorySchema);