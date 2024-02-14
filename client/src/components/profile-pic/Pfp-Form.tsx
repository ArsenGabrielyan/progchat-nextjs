import ImageSelector from "@/components/profile-pic/Selector-Image";
import type { IUser } from "@/lib/types";
import axios from "axios";
import React, { useState } from "react";
import { INITIAL_FORM_MSG } from "@/lib/constants";
import { useRouter } from "next/router";

interface PfpFormProps{
     currData: IUser
}

export default function PfpForm({currData}: PfpFormProps){
     const [pfp, setPfp] = useState('');
     const [msg,setMsg] = useState(INITIAL_FORM_MSG);
     const [loading, setLoading] = useState(false);
     const router = useRouter();
     const handleComplete = async () => {
          if(pfp==='') setMsg({
               type: 'error',
               message: 'Choose a Profile Picture'
          })
          else {
               setLoading(true);
               const res = await axios.put('/api/signup',{data: {image: pfp, email: currData.email}});
               if(res.status===200){
                    setLoading(false);
                    router.reload();
               }
          }
     }
     return <div className="auth-container">
     {(msg.message && msg.type!== '') && <div className={`msg${' '+msg.type}`}>{msg.message}</div>}
          <div className="auth-form">
               <h1>Hello {currData?.name.split(' ')[0]}!</h1>
               <p>Choose a Profile Picture</p>
               <ImageSelector value={pfp} setValue={val=>setPfp(val)}/>
               <div className="buttons">
                    <button onClick={handleComplete} disabled={loading}>{loading ? 'Loading...' : 'Complete'}</button>
               </div>
          </div>
     </div>
}