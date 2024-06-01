import AllSettings from "@/components/settings/pages/allSettings";
import Themes from "@/components/settings/pages/themes";
import SettingContent from "@/components/settings/settings-content";
import { ISettingChildren, SettingType } from "@/lib/types";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { createContext, useEffect, useState } from "react";

export const SettingContext = createContext({} as ISettingChildren)
interface SettingsProps{
     session: Session
}

export default function Settings({session}: SettingsProps){
     const [isOpen, setIsOpen] = useState(false);
     const [settingType, setSettingType] = useState<SettingType>('')
     useEffect(()=>{
          setSettingType(localStorage.getItem('setting-type') as SettingType || 'settings')
     },[])
     return <>
     <Head>
          <title>Settings | ProgChat</title>
     </Head>
     <SettingContent session={session} isOpen={isOpen} setIsOpen={setIsOpen} setSettingType={setSettingType}>
          {props=><SettingContext.Provider value={props}>
               {settingType==='settings' ? <AllSettings/> : <Themes email={props.currData?.email}/>}
          </SettingContext.Provider>}
     </SettingContent>
     </>
}
export const getServerSideProps: GetServerSideProps = async(ctx)=>{
     const session = await getSession(ctx);
     return session ? {props: {session}} : {redirect: {
          permanent: true,
          destination: "/auth/signin"
     }}
}