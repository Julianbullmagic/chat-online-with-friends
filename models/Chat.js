mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema({
    message: {
        type: String
        },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    group:{
      type:Schema.Types.ObjectId,
      ref:'Group'
    },
    type: {
        type: String
    },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = { Chat }
