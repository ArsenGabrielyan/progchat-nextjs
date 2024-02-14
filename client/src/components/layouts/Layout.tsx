import { ReactNode, useEffect, useState } from "react"

interface LayoutProps{
     children: ReactNode
}

export default function Layout({children}: LayoutProps){
     const [theme, setTheme] = useState('');
     useEffect(()=>{
          setTheme(localStorage.getItem('theme') || "aero")
     },[theme])
     return <main className={`outer-width ${theme}`}>{children}</main>
}