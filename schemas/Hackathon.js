const mongoose = require("mongoose");
const User=require('./User');
const Schema = mongoose.Schema;

const hackathonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    conductedBy: {
        type: String,
        required: true
    },
    prizeMoney: {
        type: String,
        required: true
    },
    teamSize: {
        type: Number,
        required: true
    },
    lastDate: {
        type: Date,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    conductedByRef: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    registeredPeople: [{
        type: String,
        required:false
    }],
    type: {
        type: String,
        required: true
    }


});

module.exports = mongoose.model('Hackathon', hackathonSchema);
