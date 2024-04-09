import {Schema, model, models} from "mongoose";

const userSchema = new Schema({
     name: String,
     username: {
          type: String,
          required: [true, "It is Required"],
          unique: [true, "Username is Already Taken"]
     },
     email: {
          type: String,
          required: [true, "It is Required"],
          unique: [true, "Email Already Exists"]
     },
     image: String,
     password: Schema.Types.Mixed,
     user_id: {
          type: String,
          unique: true
     },
     isAccNew: Boolean,
     status: {
          type: String,
          default: 'active'
     },
     bio: String,
     links: {
          type: [String],
          default: []
     },
     tts: {
          rate:{
               type: Number,
               default: 1
          },
          voiceIndex: {
               type: Number,
               default: 0
          },
          enabled: {
               type: Boolean,
               default: true
          },
     },
},{collection: 'user-list',versionKey:"_userKey"});

const User = models.User || model('User',userSchema)
export default User;