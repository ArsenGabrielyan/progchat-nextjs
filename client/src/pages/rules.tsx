import { useSession } from "next-auth/react";
import React, { useState } from "react";
import InnerContent from "@/components/layouts/Inner-Content";
import { MarkdownView } from "@/components/MarkdownViewer";
import { rules } from "@/lib/rules";
import { ChatContext } from "./chat";
import Head from "next/head";

export default function RulesPage(){
     const {data: session} = useSession();
     const [isOpen, setIsOpen] = useState(false);
     const year = new Date().getFullYear()
     return <>
     <Head>
          <title>Rules | ProgChat</title>
     </Head>
     <ChatContext.Provider value={{isOpen,setIsOpen}}>
          <InnerContent session={session}>
          <div className="rules-container">
               <div className="rule-main">
                    <h2 className="main">Rules</h2>
                    <p>Before Chatting, Make Sure to Follow These Rules</p>
               </div>
               <MarkdownView>{rules}</MarkdownView>
          </div>
          <div className="footer">
               <p>&copy; {year} ProgChat | All Rights Reserved</p>
          </div>
          </InnerContent>
     </ChatContext.Provider>
     </>
}