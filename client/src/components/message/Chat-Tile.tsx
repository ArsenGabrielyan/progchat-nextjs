import Image from "next/image"
import {ReactNode, useContext } from "react"
import type { IChat, IUser } from "@/lib/types";
import { MarkdownView } from "../MarkdownViewer";
import moment from "moment"
import { ChatContext } from "@/pages/chat";

interface ChatTileProps{
     children: ReactNode,
     data: IChat,
     currEmail: string,
     onPfpClick: (data: IChat) => void
}

export default function ChatTile({children, data, currEmail, onPfpClick}: ChatTileProps){
     const sentDate = moment(data.dateSent).fromNow();
     const strToTest = data.message.replace(/ /g,'');
     const emojiRegex = /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
     const hasOnlyEmojis = emojiRegex.test(strToTest) && Number.isNaN(Number(strToTest));
     const {handleContextMenu} = useContext(ChatContext)
     return <>
     <div className={`chat-tile ${data.email===currEmail ? 'left' : ''}`} onContextMenu={handleContextMenu} id={data?.id}>
          <Image title={data?.from} src={data?.image} alt="pfp" width={48} height={48} onClick={()=>onPfpClick(data)}/>
          {hasOnlyEmojis ? <div className="emojiView">
               <MarkdownView>{children}</MarkdownView>
          </div> : <div className="chat-content">
               <p className="name">{data?.from} | {sentDate}{data.isEdited ? ' (edited)' : ''}</p>
               <MarkdownView>{children}</MarkdownView>
          </div>}
     </div>
     </>
}