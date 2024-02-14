const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
     message: {
          type: String,
          required: [true,'Message Is Required']
     },
     from: {
          type: String,
          required: [true,'Sender Name Is Required']
     },
     to: {
          type: String,
          required: [true,'Room Name Is Required']
     },
     email: {
          type: String,
          required: [true,'Email Is Required']
     },
     image: {
          type: String,
          required: [true,'Image Is Required']
     },
     id: {
          type: String,
          required: [true,'Id Is Required']
     },
     isEdited: Boolean,
     hasAttachments: Boolean,
     dateSent: Date
})
const Message = mongoose.models.Message || mongoose.model('Message',msgSchema);
module.exports = Message