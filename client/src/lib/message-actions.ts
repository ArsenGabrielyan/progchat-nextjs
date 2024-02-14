import { IChat, IChatMessage } from "./types";
import { produce } from "immer"

export namespace MessageActions{
     export function editMessage(messages: IChat[], id: string, newMsg: string){
          const newMessages = produce(messages,draft=>{
               const msg = draft.find(val=>val.id===id)!;
               const msgIdx = draft.findIndex(val=>val.id===id)!;
               draft[msgIdx] = {...msg,message: newMsg, isEdited: true};
          });
          return newMessages
     }
     export function deleteMessage(messages: IChat[], id: string){
          const newMessages = produce(messages,draft=>{
               const msgIdx = draft.findIndex(val=>val.id===id)!;
               draft.splice(msgIdx,1);
          });
          return newMessages
     }
     export function addMessage(messages: IChat[], payload:IChat){
          const {message,from,to,email,image,id,hasAttachments,dateSent} = payload;
          const newMessages = produce(messages,draft=>{
               if(draft) draft.push({from,to, email, message, image, id, isEdited: false, hasAttachments, dateSent})
               else draft = [{from,to, email, message, image, id, isEdited: false, hasAttachments, dateSent}]
          });
          return newMessages;
     }
     export function showMessages(msgs: IChatMessage[], callback: (arr: IChat[])=>void){
          if(msgs.length){
               const arr = msgs.map(val=>{
                    const {_id,__v,...rest} = val;
                    return rest
               })
               callback(arr)
          }
     }
}