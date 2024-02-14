import {Schema,model,models} from "mongoose";

const tokenSchema = new Schema({
     userId: {
          type: 'string',
          required: [true, 'It is Required'],
          ref: 'User'
     },
     token: {
          type: String,
          required: true
     },
     createdAt: {
          type: Date,
          default: Date.now,
          expires: 3600
     }
},{collection: 'user-tokens',versionKey:"_tokenKey"});

const Token = models.Token || model('Token', tokenSchema);
export default Token