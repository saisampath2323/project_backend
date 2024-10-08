const mongoose = require("mongoose");

function Dbconnect() {
    mongoose.connect('mongodb+srv://saisampath23:saisampath123@cluster0.decs7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}

module.exports = Dbconnect;
