import ChatTile from "@/components/message/Chat-Tile";
import {IUser, IPosition, MouseFn, IChat, InputFn, InputType, DeleteMessageArgs, EditMessageArgs, IChatMessage, IChatContext } from "@/lib/types";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { MdDelete, MdEdit, MdVolumeUp } from "react-icons/md";
import useSWR from "swr";
import { fetcher, generate } from "@/lib/helpers";
import { Socket, io } from "socket.io-client";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { MessageActions } from "@/lib/message-actions";
import MessageInput from "@/components/message/Message-Input";
import ContextMenu from "@/components/menus/ContextMenu";
import InnerContent from "@/components/layouts/Inner-Content";
import axios from "axios";
import { REQ_CONFIG } from "@/lib/constants";
import UserModal from "@/components/Modal";

export const ChatContext = createContext({} as IChatContext);

export default function Discussion(){
     const {data: session, status} = useSession();
     const {data: currData} = useSWR<IUser>(session && session.user ? `/api?email=${session?.user?.email}` : null,fetcher);
     const [isOpen, setIsOpen] = useState(false);
     const [contextClicked, setContextClicked] = useState(false);
     const [points, setPoints] = useState<IPosition>({x:0,y:0});
     const [mode, setMode] = useState<InputType>('add')
     const [selected, setSelected] = useState({} as IChat);
     const [messages, setMessages] = useState<IChat[]>([]);
     const [typing, setTyping] = useState('');
     const [channel, setChannel] = useState('general');
     const [selectedUser, setSelectedUser] = useState({} as IUser)
     const handleContextMenu: MouseFn<HTMLDivElement,MouseEvent> = e => {
          e.preventDefault();
          const elem = e.target as HTMLDivElement
          setPoints({x: e.pageX, y: e.pageY});
          setContextClicked(true);
          const selectedMessage = messages.find(val=>val.id===elem.closest('[id]')?.id);
          if(selectedMessage) setSelected(selectedMessage)
     }
     const socketRef = useRef<Socket>();
     useEffect(()=>{
          window.scrollTo(0,document.body.scrollHeight);
     },[messages])
     useEffect(()=>{
          socketRef.current = io('http://localhost:4000');
          const currSocket = socketRef.current;
          currSocket.on('display messages',(msgs: IChatMessage[])=>MessageActions.showMessages(msgs,arr=>setMessages(arr)))
          currSocket.on('delete message',({id}:DeleteMessageArgs)=>setMessages(messages=>MessageActions.deleteMessage(messages,id)))
          currSocket.on('edit message',({newMsg,id}:EditMessageArgs)=>setMessages(messages=>MessageActions.editMessage(messages,id,newMsg)))
          currSocket.on('new message',(payload:IChat)=>setMessages(messages => MessageActions.addMessage(messages,payload)));
          currSocket.on('typing',(name: string)=>setTyping(name))
          currSocket.on('stop typing',(name: string)=>{if(typing!==name) setTyping('')});
          const handleClick = () => setContextClicked(false);
          document.addEventListener('click',handleClick);
          window.scrollTo(0,document.body.scrollHeight);
          return () => {
               currSocket.off('display messages')
               currSocket.off('delete message')
               currSocket.off('edit message')
               currSocket.off('new message');
               currSocket.off('typing')
               currSocket.off('stop typing')
               currSocket.disconnect();
               document.removeEventListener('click',handleClick);
          }
          // eslint-disable-next-line
     },[]);
     const handleTyping: InputFn = input => socketRef.current?.emit(input==='' ? 'stop typing' : 'typing',currData?.username);
     const handleAddMessage = (input: string, currId?: string, hasAttachments: boolean = false) => {
          setMode('add');
          const id = currId || generate('id',10);
          const payload = {
               message: input,
               from: currData?.name,
               to: channel,
               email: currData?.email,
               image: currData?.image, id,
               hasAttachments
          }
          socketRef.current?.emit('stop typing',currData?.username)
          socketRef.current?.emit('send message',payload);
     }
     const joinRoom = (roomName: string) => {
          socketRef.current?.emit('join room',roomName);
          setChannel(roomName)
     }
     const deleteMessage = () => {
          if(confirm('Are You Sure To Delete This Message?')){
               socketRef.current?.emit('delete message',{id: selected.id})
          }
     }
     const editMessage: InputFn = input => {
          if(input!=='' && input.trim()!==''){
               socketRef.current?.emit('edit message',{newMsg: input,id: selected.id})
               socketRef.current?.emit('stop typing',currData?.username)
               setMode('add');
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
     const cancelEdit = (setInput: React.Dispatch<React.SetStateAction<string>>) => {
          socketRef.current?.emit('stop typing',currData?.username)
          setInput('');
          setMode('add');
     }
     const openDM = (id: string)=> {
          joinRoom(id);
          setIsOpen(false)
     }
     const handleClickOnPfp = async(data: IChat) => {
          const res = await axios.get<IUser>(`/api?email=${data.email}`,REQ_CONFIG);
          if(res.status===200){
               setSelectedUser(res.data)
               console.log(res.data)
          }
     }
     return <ChatContext.Provider value={{isOpen, setIsOpen, openDM, handleContextMenu, handleAddMessage, handleTyping, editMessage, cancelEdit, typing, mode, selected, status}}>
          {(selectedUser && JSON.stringify(selectedUser)!=='{}') && <UserModal data={selectedUser} onClose={()=>setSelectedUser({} as IUser)}/>}
          <InnerContent session={session}>
          <div className="chatbox">
               {messages.map((val,i)=>val && <ChatTile key={i} data={val} currEmail={currData?.email || ""} onPfpClick={handleClickOnPfp}>{val.message}</ChatTile>)}
          </div>
          {contextClicked && <ContextMenu top={points.y} left={!isOpen ? points.x : points.x - 135}>
               <ul>
                    {!selected.hasAttachments && <>
                         <li onClick={copyMessage}><FaCopy/> Copy</li>
                         {currData?.tts.enabled && <li onClick={ttsMessage}><MdVolumeUp/> Listen</li>}
                    </>}
                    {selected.email===session?.user?.email && <>
                         <li onClick={()=>setMode('edit')}><MdEdit/> Edit</li>
                         <li onClick={deleteMessage} className="red"><MdDelete/> Delete</li>
                    </>}
               </ul>
          </ContextMenu>}
          <MessageInput/>
     </InnerContent>
     </ChatContext.Provider>
}