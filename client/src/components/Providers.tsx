import { ReactNode } from "react";
import Layout from "@/components/layouts/Layout";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

interface ProviderProps{
     children: ReactNode
}

export default function Providers({children}: ProviderProps){
     return <SessionProvider>
          <Layout>{children}</Layout>
          <ToastContainer/>
     </SessionProvider>
}