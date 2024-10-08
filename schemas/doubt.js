const mongoose = require("mongoose");

// Define User Schema
const doubtSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    codechefId:{
        type:String,
        required:true,
    },
    leetcodeId:{
        type:String,
        required:true,
    }
    


});

// Create and export User model
module.exports = mongoose.model('doubt',doubtSchema);
