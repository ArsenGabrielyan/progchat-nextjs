import { StatusType } from "@/lib/types";
import axios from "axios";
import { useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link"
import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import { KeyedMutator } from "swr";
import type { IUser } from "@/lib/types";
import { logOut } from "@/lib/helpers";
import StatusBar from "../header-parts/Status-Bar";
import AccountInfo from "../header-parts/AccountInfo";

interface SettingsHeaderProps{
     data: IUser | undefined,
     update: KeyedMutator<IUser>,
     open: boolean,
     setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function SettingsHeader({data, update, open, setOpen}: SettingsHeaderProps){
     const {status} = useSession();
     const [showMenu, setShowMenu] = useState(false);
     useEffect(()=>{
          const clickDetect = (e: MouseEvent) => {
               const elem = e.target as HTMLElement;
               if(!elem.classList.contains('pfp')) setShowMenu(false);
          }
          document.addEventListener('click',clickDetect);
          return () => document.removeEventListener('click',clickDetect);
     },[]);
     const switchStatus = async(status: StatusType) => {
          await axios.patch('/api',{email: data?.email, status});
          await update()
     }
     return <div className="navbar">
          <div className="app-title">
               <button onClick={()=>setOpen(!open)}>{open ? <MdClose/> : <MdMenu/>}</button>
               <h1 className="logo">ProgChat Settings</h1>
          </div>
          {status==='unauthenticated' ? <Link href="/auth/signin" className="authbtn">Sign In</Link> : <>
          {data?.image && <div className="pfpbox" onClick={()=>setShowMenu(true)}>
               <Image className="pfp" src={data?.image} alt="pfp" width={60} height={60}/>
               <div className={`status${" "+data?.status}`}/>
          </div>}
          {showMenu && <div className="options">
               <AccountInfo data={data}/>
               <StatusBar data={data} switchStatus={switchStatus}/>
               <ul className="links">
                    <li><Link href="/">Homepage</Link></li>
                    <li><Link href="#" onClick={()=>logOut(data?.email,update)}>Sign Out</Link></li>
               </ul>
          </div>}
          </>}
     </div>
}