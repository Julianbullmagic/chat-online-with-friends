const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  chat: [{type:mongoose.Schema.Types.ObjectId,ref:"Chat"}],

  members: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],


})

module.exports =  mongoose.model('Group', groupSchema)
