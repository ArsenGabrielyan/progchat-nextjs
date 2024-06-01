import { IChat } from "@/lib/types";
import { NextApiHandler } from "next";
import {GoogleGenerativeAI} from "@google/generative-ai"
import { generate } from "@/lib/helpers";

const handler: NextApiHandler = async(req,res) => {
     const genAi = new GoogleGenerativeAI(process.env.GOOGLE_AI as string);
     if(req.method==='POST'){
          try{
               const {payload, chats}: {payload: IChat, chats: IChat[]} = req.body
               if (!payload || !chats) {
                    return res.status(400).json({ error: 'Invalid request data.' });
               }
               const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash"});
               const chat = model.startChat({history: chats.map(val=>({role: val.from==='Mr. ChatBot' ? 'model' : 'user', parts: [{text: val.message}]}))});
               const result = await chat.sendMessage(payload.message)
               const message: IChat = {
                    message: result.response.text(),
                    from: "Mr. ChatBot",
                    to: payload.from,
                    email: "",
                    image: "/apple-icon.png",
                    id: generate('id',10),
                    hasAttachments: false,
                    isEdited: false,
                    dateSent: new Date()
               }
               return res.status(200).json(message)
          } catch(err){
               console.error("Error Sending Message Because of This:",err)
               return res.status(500).json(err)
          }
     }
}
export default handler