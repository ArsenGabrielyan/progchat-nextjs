import { MdSend, MdEmojiEmotions, MdClose } from "react-icons/md";
import {FormFN, KeyEvent } from "@/lib/types";
import React, { useContext, useState } from "react";
import dynamic from 'next/dynamic';
import { ChatContext } from "@/pages/chat";

const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
);

export default function ChatbotInput(){
     const [input, setInput] = useState('');
     const [showEmojis, setShowEmojis] = useState(false)
     const {handleAddMessage: onAdd, typing, status} = useContext(ChatContext)
     const handleKeyDown: KeyEvent<HTMLTextAreaElement> = e => {
          if((e.altKey && e.key==='Enter') && !e.repeat){
               e.preventDefault()
               setInput(input+"\n")
          } else if(e.key==='Enter' && !e.repeat){
               e.preventDefault();
               sendMessage(e);
          }
     }
     const sendMessage: FormFN = e => {
          e.preventDefault();
          onAdd?.(input)
          setInput('');
     }
     return <>
     {showEmojis && <div className="emoji-picker">
     <EmojiPicker onEmojiClick={(e)=>setInput(prev=>prev+e.emoji)}/>
     </div>}
     {status==='authenticated' ? <form action="post" onSubmit={sendMessage} className="chat-form">
          <button type="button" className="btn-1" onClick={()=>setShowEmojis(!showEmojis)}>{showEmojis ? <MdClose/> : <MdEmojiEmotions/>}</button>
          <textarea wrap="soft" rows={3} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={!typing ? '' : `${typing} is typing...`}/>
          <button type="submit"><MdSend/></button>
     </form> : <h2 className="chat-info">You Need to Sign in To Start Chatting (or Discussion)</h2>}
     </>
}