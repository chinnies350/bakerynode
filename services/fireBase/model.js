const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: String },
    title: { type: String },
    message: { type: String },
    messageId: { type: String },
    multicastId:{type:String}  
},
{ timestamps: true },
    { minimize: false });
  
  const Chat = mongoose.model("Notification", NotificationSchema);
  module.exports = Chat;