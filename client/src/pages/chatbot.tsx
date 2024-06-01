import {IUser, IPosition, MouseFn, IChat } from "@/lib/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { MdVolumeUp } from "react-icons/md";
import useSWR from "swr";
import { fetcher, generate } from "@/lib/helpers";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import ContextMenu from "@/components/menus/ContextMenu";
import InnerContent from "@/components/layouts/Inner-Content";
import axios from "axios";
import ChatbotInput from "@/components/message/Chatbot-Input";
import { ChatContext } from "./chat";
import ChatBotTile from "@/components/message/ChatBot-Tile";

export default function ChatBot(){
     const {data: session, status} = useSession();
     const {data: currData} = useSWR<IUser>(session && session.user ? `/api?email=${session?.user?.email}` : null,fetcher);
     const [isOpen, setIsOpen] = useState(false);
     const [contextClicked, setContextClicked] = useState(false);
     const [points, setPoints] = useState<IPosition>({x:0,y:0});
     const [selected, setSelected] = useState({} as IChat);
     const [messages, setMessages] = useState<IChat[]>([]);
     const [typing, setTyping] = useState("");
     const handleContextMenu: MouseFn<HTMLDivElement,MouseEvent> = e => {
          e.preventDefault();
          const elem = e.target as HTMLDivElement
          setPoints({x: e.pageX, y: e.pageY});
          setContextClicked(true);
          const selectedMessage = messages.find(val=>val.id===elem.closest('[id]')?.id);
          if(selectedMessage) setSelected(selectedMessage)
     }
     useEffect(()=>{
          window.scrollTo(0,document.body.scrollHeight);
     },[messages])
     const handleAddMessage = async (input: string, currId?: string, hasAttachments: boolean = false) => {
          const msgCopy = [...messages];
          const id = currId || generate('id',10);
          const payload: IChat = {
               message: input,
               from: currData?.name as string,
               to: "Mr. ChatBot",
               email: currData?.email as string,
               image: currData?.image as string, id,
               hasAttachments,
               isEdited: false,
               dateSent: new Date()
          }
          msgCopy.push(payload);
          setMessages(msgCopy)
          setTyping('Mr. ChatBot')
          const res = await axios.post("/api/chatbot",{payload, chats: msgCopy});
          if(res.status===200){
               setTyping('');
               console.log(res.data.message)
               setMessages(prev=>[...prev, res.data])
          }
     }
     const copyMessage = () => {
          navigator.clipboard.writeText(selected.message);
          toast.success('Message Copied')
     }
     const ttsMessage = () => {
          if(currData){
               const utterance = new SpeechSynthesisUtterance(selected.message);
               const voices = speechSynthesis.getVoices();
               utterance.rate = currData.tts.rate;
               utterance.voice = voices[currData.tts.voiceIndex];
               speechSynthesis.speak(utterance)
          }
     }
     return <ChatContext.Provider value={{handleContextMenu, handleAddMessage, selected, status, typing, isOpen, setIsOpen}}>
          <InnerContent session={session}>
               <div className="chatbox">
                    {messages.map((val,i)=>val && <ChatBotTile key={i} data={val} currEmail={currData?.email || ""}>{val.message}</ChatBotTile>)}
               </div>
               {contextClicked && <ContextMenu top={points.y} left={!isOpen ? points.x : points.x - 135}>
                    <ul>
                         <li onClick={copyMessage}><FaCopy/> Copy</li>
                         {currData?.tts.enabled && <li onClick={ttsMessage}><MdVolumeUp/> Listen</li>}
                    </ul>
               </ContextMenu>}
               <ChatbotInput/>
          </InnerContent>
     </ChatContext.Provider>
}