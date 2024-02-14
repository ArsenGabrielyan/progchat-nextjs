import { IUser } from "@/lib/types";
import Image from "next/image";

interface AccountInfoProps{
     data: IUser | undefined
}

export default function AccountInfo({data}: AccountInfoProps){
     return <div className="account-info">
          <div className="pfpbox">
               {data?.image && <Image src={data?.image} alt="pfp" width={60} height={60}/>}
               <div className={`status${" "+data?.status}`}/>
          </div>
          <div className="infobox">
               <h2>{data?.name}</h2>
               <p>{data?.username}</p>
          </div>
     </div>
}