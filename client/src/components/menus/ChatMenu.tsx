import { fetcher } from "@/lib/helpers"
import { IUser } from "@/lib/types"
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr"

interface ChatMenuProps{
     onOpenDM: (id: string) => void;
}

export default function ChatMenu({onOpenDM}: ChatMenuProps){
     const {data: allUsers, isLoading} = useSWR<IUser[]>('/api',fetcher,{refreshInterval: 1000});
     return <div className="rooms">{(!isLoading && allUsers) && <>
          <h2>Pages</h2>
          <ul>
               <li><Link href="/">Welcome!</Link></li>
               <li><Link href="/chat" onClick={()=>onOpenDM('general')}>Main Chat</Link></li>
               <li><Link href="/rules">Rules</Link></li>
          </ul>
          <h2>Users</h2>
          <ul>
               {allUsers?.map(val=><li className="pfpbox" key={val.user_id} title={val.name} onClick={()=>onOpenDM(val.user_id)}>
                    <Image src={val.image} alt="pfp" width={60} height={60}/>
                    <div className={`status${" "+val.status}`}/>
               </li>)}
          </ul>
     </>}</div>
}