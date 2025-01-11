const mongoose = require("mongoose");

function Dbconnect() {
    mongoose.connect('mongodb+srv://saisampath23:saisampath123@cluster0.decs7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        
  
  serverSelectionTimeoutMS: 5000, // Time to wait before giving up initial connection (5 seconds)
  socketTimeoutMS: 45000, // Time before giving up on a request (45 seconds)
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}

module.exports = Dbconnect;
