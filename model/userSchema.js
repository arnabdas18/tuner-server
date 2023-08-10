
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String,required : true,unique : true},
    phone : {type : Number,required : true},
    profession : { type : String,required : true},
    password : {type : String,required : true},
    myVideos: {type: [String],default: []}
})

const userModel = new mongoose.model('Users' ,userSchema)

module.exports = userModel