import connectDB from "@/lib/providers-tools/connectDB";
import { NextApiHandler } from "next";
import User from "@/models/user";

const handler: NextApiHandler = async (req,res) => {
     if(req.method==='GET'){
          await connectDB();
          const user = JSON.stringify(req.query)!=='{}' ? await User.findOne({email: req.query.email}) : await User.find();
          if(user){
               res.status(200).json(user)
          } else res.status(404).json({msg: 'User Not Found'})
     } else if(req.method==='PATCH'){
          const {email, status} = req.body;
          await User.updateOne({email},{status});
          res.status(200).json({msg: `status switched to ${status}`})
     } else if(req.method==='PUT'){
          await connectDB()
          const {currState, email} = req.body;
          await User.updateOne({email},{
               $set: {
                    username: currState?.username,
                    name: currState?.name,
                    bio: currState?.bio,
                    links: currState?.links,
                    image: currState?.image,
                    status: currState?.status,
                    tts: {
                         rate: currState?.ttsRate,
                         voiceIndex: currState?.ttsVoiceIndex,
                         enabled: currState?.textToSpeech
                    },
               }
          })
          res.status(200).json({...currState, email})
     }
}
export default handler