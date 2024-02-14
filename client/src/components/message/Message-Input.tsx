import { MdSend, MdAttachFile, MdEdit, MdMic, MdStop, MdCancel, MdEmojiEmotions, MdClose } from "react-icons/md";
import {FormFN, KeyEvent } from "@/lib/types";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ref } from "firebase/storage";
import { storage } from "@/lib/providers-tools/firebase";
import { generate, uploadAttachment } from "@/lib/helpers";
import { Grid } from "react-loader-spinner"
import { Visualizer } from "react-sound-visualizer"
import dynamic from 'next/dynamic';
import { ChatContext } from "@/pages/chat";

const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
);

export default function MessageInput(){
     const [input, setInput] = useState('');
     const attachmentRef = useRef<HTMLInputElement>(null);
     const [recorderState, setRecorderState] = useState({isRecording: false,isBlocked: false,isLoading: false});
     const mp3RecorderRef = useRef<MediaRecorder>()
     const [chunks, setChunks] = useState<Blob[]>([]);
     const [stream, setStream] = useState<MediaStream|null>(null);
     const [isUploading, setIsUploading] = useState(false);
     const [showEmojis, setShowEmojis] = useState(false)
     const {handleAddMessage: onAdd, handleTyping: onKey, editMessage: onEdit, cancelEdit: onCancelEdit, typing, mode, selected, status} = useContext(ChatContext)
     const Loader = () => <Grid visible height="32" width="32" color="#fafafa" ariaLabel="sending-voice-message"/>
     const handleKeyDown: KeyEvent<HTMLTextAreaElement> = e => {
          onKey?.(input)
          if((e.altKey && e.key==='Enter') && !e.repeat){
               e.preventDefault()
               setInput(input+"\n")
          } else if(e.key==='Enter' && !e.repeat){
               e.preventDefault();
               sendMessage(e);
          }
     }
     const handleChangeFile: FormFN = e => {
          const elem = e.target as HTMLInputElement;
          if(!elem) return;
          if(elem.files){
               const file = elem.files[0];
               const currId = generate('id',10);
               const fileRef = ref(storage,`/attachments/${currId}`);
               setIsUploading(true)
               uploadAttachment(fileRef,file,(type,bytes,url)=>{
                    setIsUploading(false)
                    if(type.includes('image')) onAdd?.(`![attachment](${url})`,currId,true)
                    else if(type.includes('video')) onAdd?.(`<video width="500" height="300" controls><source src="${url}" type="${type}"/>Your browser does not support the video tag.</video>`,currId,true)
                    else if(type.includes('audio')) onAdd?.(`<audio controls><source src="${url}" type="${type}"/>Your browser does not support the video tag.</audio>`,currId,true)
                    else onAdd?.(`<a href="${url}" class="downloadable" download="${file.name.split('.')[0]}">${file.name} (${bytes})</a>`,currId,true)
               });
          }
     }
     const sendMessage: FormFN = e => {
          e.preventDefault();
          if(mode==='add') onAdd?.(input);
          else onEdit?.(input)
          setInput('');
     }
     const startRecording = () => {
          if(recorderState.isBlocked){
               alert('Permission Denied')
               return;
          }
          setRecorderState({...recorderState,isRecording: true,isLoading:false})
          const media = new MediaRecorder(stream!,{mimeType: 'audio/webm'});
          mp3RecorderRef.current = media;
          mp3RecorderRef.current.start();
          let localChunks: Blob[] = [];
          mp3RecorderRef.current.ondataavailable = e => {
               if(typeof e.data === 'undefined') return;
               if(e.data.size === 0) return;
               localChunks.push(e.data)
          }
          setChunks(localChunks)
     }
     const stopRecording = () => {
          setRecorderState({...recorderState,isRecording: false, isLoading: true});
          if(mp3RecorderRef.current){
               mp3RecorderRef.current.stop();
               mp3RecorderRef.current.onstop = () => {
                    const currId = generate('id',10);
                    const file = new File(chunks,currId,{type: 'audio/webm'})
                    const fileRef = ref(storage,`/attachments/${currId}`);
                    uploadAttachment(fileRef,file,(type,_,url)=>{
                         onAdd?.(`<audio controls><source src="${url}" type="${type}"/>Your browser does not support the video tag.</audio>`,currId,true)
                         setChunks([])
                         setRecorderState({...recorderState,isRecording: false,isLoading: false});
                    })
               }
          }
     }
     useEffect(()=>{
          if(mode==='edit') setInput(selected?.message as string)
          //eslint-disable-next-line
     },[mode]);
     useEffect(()=>{
          const perm = async()=>{
               if('MediaRecorder' in window){
                    try{
                         const streamData = await navigator.mediaDevices.getUserMedia({audio: true})
                         setStream(streamData)
                         setRecorderState({...recorderState, isBlocked: false, isLoading: false})
                    } catch(e){
                         console.error(e)
                         setRecorderState({...recorderState, isBlocked: true, isLoading: false})
                    }
               } else {
                    alert('MediaRecorder is Not Supported')
               }
          }
          perm()
          //eslint-disable-next-line
     },[])
     return <>
     {showEmojis && <div className="emoji-picker">
     <EmojiPicker onEmojiClick={(e)=>setInput(prev=>prev+e.emoji)}/>
     </div>}
     {status==='authenticated' ? <form action="post" onSubmit={sendMessage} className="chat-form">
          <button type="button" className="btn-1" onClick={()=>setShowEmojis(!showEmojis)}>{showEmojis ? <MdClose/> : <MdEmojiEmotions/>}</button>
          {recorderState.isRecording ? <Visualizer audio={stream} strokeColor="#fafafa" autoStart={recorderState.isRecording}>{({canvasRef})=><canvas ref={canvasRef}/>}</Visualizer> : <textarea wrap="soft" rows={3} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={!typing ? '' : `${typing} is typing...`}/>}
          <input type="file" ref={attachmentRef} onChange={handleChangeFile}/>
          {mode==='add' ? <>
               <button type="submit"><MdSend/></button>
               {recorderState.isRecording ? <button type="button" onClick={stopRecording}><MdStop/></button> : <button type="button" onClick={startRecording}>{recorderState.isLoading ? <Loader/> : <MdMic/>}</button>}
               <button type="button" onClick={()=>attachmentRef.current?.click()}>{isUploading ? <Loader /> : <MdAttachFile/>}</button>
          </> : <>
               <button type="submit"><MdEdit/></button>
               <button type="button" onClick={()=>onCancelEdit?.(setInput)}><MdCancel/></button>
          </>}
     </form> : <h2 className="chat-info">You Need to Sign in To Start Chatting (or Discussion)</h2>}
     </>
}