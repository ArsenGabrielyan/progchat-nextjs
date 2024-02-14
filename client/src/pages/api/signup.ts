import connectDB from "@/lib/providers-tools/connectDB";
import { NextApiHandler } from "next";
import bcrypt from "bcrypt"
import { FormSubmitData, IUser } from "@/lib/types";
import User from "@/models/user";
import { generate } from "@/lib/helpers";

const handler: NextApiHandler = async (req,res) => {
     if(req.method==='POST') {
          try{
               await connectDB();
               const {signupData}: {signupData: FormSubmitData.SignUpData} = req.body;
               const hashed = await bcrypt.hash(signupData?.password,12);
               const user = await User.findOne({email: signupData.email});
               const takenUsername = await User.findOne({username: signupData.username});
               const newUsername = `${signupData.username.toLowerCase().replace(/[0-9]/g,'')}-${generate('username',8)}`;
               if(user) res.status(401).json({message: 'This User Already Exists'});
               else {
                    const {name,email,username} = signupData
                    const userDetails = {
                         name,
                         username: !username ? `user-${generate('username',8)}` : takenUsername ? newUsername : username,
                         email: email.toLowerCase(),
                         password: hashed,
                         user_id: generate('id',8),
                         isAccNew: true
                    }
                    const newUser = new User(userDetails);
                    await newUser.save();
                    res.status(200).json(newUser)
               }
          } catch (err){
               if(typeof err === 'string'){
                    res.status(500).json({message: err.toLowerCase()})
                    console.error(err.toLowerCase())
               } else if(err instanceof Error) {
                    res.status(500).json({message: err.message})
                    console.error(err.message)
               }
          }
     } else if(req.method==='PUT'){
          connectDB();
          const {data}: {data: IUser} = req.body;
          const newData = await User.findOneAndUpdate({email: data.email},{
               image: `/pfp/${data.image}.webp`,
               isAccNew: false
          })
          res.status(200).json(newData)
     }
}
export default handler;