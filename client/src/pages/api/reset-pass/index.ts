import connectDB from "@/lib/providers-tools/connectDB";
import Token from "@/models/token";
import User from "@/models/user";
import bcrypt from "bcrypt"
import { NextApiHandler } from "next";

const handler: NextApiHandler = async(req,res)=>{
     const {token,email,newPass} = req.body;
     if(req.method==='POST') try{
          await connectDB()
          const user = await User.findOne({email});
          if(!user) res.status(400).json({msg: 'Invalid Link or Expired'});
          const claimedToken = await Token.findOne({userId: user.user_id,token});
          if(!claimedToken) res.status(400).json({msg: 'Invalid Link or Expired'});
          user.password = await bcrypt.hash(newPass,12);
          await user.save();
          await Token.findOneAndDelete({userId: user.user_id,token})
          res.status(200).json({msg: 'Password Reset Successfully'})
     } catch(err){
          if(typeof err === 'string'){
               res.status(400).json({message: err.toLowerCase()})
               console.error(err.toLowerCase())
          } else if(err instanceof Error) {
               res.status(400).json({message: err.message})
               console.error(err.message)
          }
     }
}
export default handler