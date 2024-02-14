import Header from "@/components/menus/Bar";
import { IUser } from "@/lib/types";
import React, { ReactNode, useContext, useEffect } from "react";
import useSWR from "swr"; import { fetcher } from "@/lib/helpers";
import PfpForm from "@/components/profile-pic/Pfp-Form";
import ChatMenu from "@/components/menus/ChatMenu";
import { Session } from "next-auth";
import axios from "axios";
import { ChatContext } from "@/pages/chat";

interface InnerContentProps{
     session: Session | null,
     children: ReactNode,
}

export default function InnerContent({session, children}: InnerContentProps){
     const {data: currData, isLoading, mutate: updateCurrUser} = useSWR<IUser>(session && session.user ? `/api?email=${session?.user?.email}` : null,fetcher);
     const {openDM, isOpen} = useContext(ChatContext)
     useEffect(()=>{
          const blurFn = async() => {
               const res = await axios.patch('/api',{email: currData?.email, status: 'away'})
               if(res.status===200) await updateCurrUser();
          }
          const focusFn = async() => {
               const res = await axios.patch('/api',{email: currData?.email, status: 'active'})
               if(res.status===200) await updateCurrUser();
          }
          window.addEventListener('blur',blurFn);
          window.addEventListener('focus',focusFn)
          return () => {
               window.removeEventListener('blur',blurFn);
               window.removeEventListener('focus',focusFn);
          }
          //eslint-disable-next-line
     },[])
     return <>
          {!isLoading && <>
          {currData?.isAccNew ? <PfpForm currData={currData}/> : <Header data={currData} update={updateCurrUser}/>}</>}
          <div className="main-container">
               {isOpen && <ChatMenu onOpenDM={(id)=>{if(openDM) openDM(id)}}/>}
               <div className={`inner-content${!isOpen ? ' sidebar-closed' : ''}`}>{children}</div>
          </div>
     </>
}