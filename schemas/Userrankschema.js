const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User=require("./User");
const Hackathon=require("./Hackathon");
const userRankSchema = new mongoose.Schema({
    user: {
      type: String,
     
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon'
    },
    rank: {
      type: Number
    }
  });
  module.exports = mongoose.model('Userrank', userRankSchema);