import { useSession } from "next-auth/react";
import React, { useState } from "react";
import InnerContent from "@/components/layouts/Inner-Content";
import Link from "next/link";
import { ChatContext } from "./chat";

export default function Homepage(){
     const {data: session, status} = useSession();
     const [isOpen, setIsOpen] = useState(false);
     return <ChatContext.Provider value={{isOpen,setIsOpen}}>
          <InnerContent session={session}>
          <div className="welcome">
               <h1>Welcome to ProgChat</h1>
               <p>ProgChat is a discussion app, where you can communicate and discuss with Programmers and Programming Masters</p>
               <Link href={status==='unauthenticated' ? '/auth/signin' : '/chat'}>Let&apos;s Get Started</Link>
          </div>
          </InnerContent>
     </ChatContext.Provider>
}