import { IUser } from "@/lib/types";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import { MarkdownView } from "./MarkdownViewer";
import Image from "next/image";

interface UserModalProps{
     data: IUser,
     onClose: () => void
}

export default function UserModal({data, onClose}: UserModalProps){
     return <div className="userInfoModal">
     <div className="userInfo">
          <button className="closeBtn" onClick={onClose}><MdClose/></button>
          {data.image && <div className="pfpbox">
               <Image src={data.image} alt="pfp" width={64} height={64}/>
               <div className={`status ${data.status}`}/>
          </div>}
          <h2>{data.name}</h2>
          <p className="username">@{data.username}</p>
          {!!data.bio && <>
               <p className="title">About {data.username}</p>
               <MarkdownView>{data.bio}</MarkdownView>
          </>}
          {!!data.links.length && <>
               <p className="title">External Links</p>
               {data.links.map((val,i)=><Link rel="noreferrer" target="_blank" href={!/^https?:\/\//i.test(val) ? `https://${val}` : val} key={i}>{val}</Link>)}
          </>}
     </div>
</div>
}