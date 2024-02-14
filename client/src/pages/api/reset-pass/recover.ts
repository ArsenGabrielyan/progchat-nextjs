import { generate } from "@/lib/helpers";
import connectDB from "@/lib/providers-tools/connectDB";
import { sendEmail } from "@/lib/providers-tools/nodemailer";
import Token from "@/models/token";
import User from "@/models/user";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async(req,res)=>{
     const {email} = req.body
     if(req.method==='POST') try{
          await connectDB()
          const user = await User.findOne({email});
          if(!user) res.status(400).json("This User Doesn't Exist");
          let token = await Token.findOne({userId: user.user_id});
          if(!token) token = await new Token({
               userId: user.user_id,
               token: generate('id',32)
          }).save();
          const link = `http://localhost:3000/auth/reset-password/${token.token}/${email}`;
          await sendEmail(user,email,'Reset Password',link);
          res.status(200).json({msg: 'Reset Link Sent Successfully'})
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