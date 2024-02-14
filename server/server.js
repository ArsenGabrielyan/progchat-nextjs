const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const dbUrl = require('./db_url');
const mongoose = require('mongoose');
const Message = require("./models/Message");
const Filter = require('bad-words')
const io = require('socket.io')(server,{
     cors: {
          origin: ['http://localhost:3000','http://localhost:4000'],
          methods: ['GET','POST','PUT','DELETE']
     }
})
mongoose.connect(dbUrl).then(()=>{
     console.info('Server-Side Database Is Connected')
}).catch(err=>console.error(err));
const filter = new Filter({placeHolder: '[#]'})

io.on('connection',socket=>{
     Message.find({to:'general'}).then(val=>{
          socket.join('general')
          io.to('general').emit('display messages',val)
     })
     socket.on('join room',(roomName)=>{
          socket.join(roomName)
          console.info('Joined Room',roomName)
          Message.find({to: roomName}).then(val=>io.to(roomName).emit('display messages',val))
     })
     socket.on('send message',({message,from,to,email,image,id,hasAttachments})=>{
          const strToTest = message.replace(/ /g,'');
          const emojiRegex = /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
          const hasOnlyEmojis = emojiRegex.test(strToTest) && Number.isNaN(Number(strToTest));
          const payload = {message: hasOnlyEmojis ? message : filter.clean(message),from,to,email,image,id,hasAttachments,dateSent: new Date()};
          const newMsg = new Message({...payload,isEdited:false})
          newMsg.save().then(()=>io.to(to).emit('new message',payload))
     });
     socket.on('typing',name=>io.emit('typing',name))
     socket.on('stop typing',name=>io.emit('stop typing',name));
     socket.on('edit message',({newMsg,id})=>{
          Message.updateOne({id},{
               $set: {
                    message: newMsg,
                    isEdited: true
               }
          }).then(()=>io.emit('edit message',{newMsg,id}))
     });
     socket.on('delete message',({id})=>{
          Message.deleteOne({id}).then(()=>io.emit('delete message',{id}))
     })
})

server.listen(4000,()=>console.info('Server Is Running on Port 4000'))