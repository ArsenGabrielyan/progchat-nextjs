import Link from "next/link";
import React, { useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { INITIAL_FORM_MSG, REQ_CONFIG } from "@/lib/constants";
import type { FormFN } from "@/lib/types";
import { validateEmail } from "@/lib/helpers";
import axios from "axios";
import Head from "next/head";

export default function ResetPassEmail(){
     const [email, setEmail] = useState('')
     const [msg, setMsg] = useState(INITIAL_FORM_MSG);
     const [loading, setLoading] = useState(false);
     const handleSubmit: FormFN = async e => {
          e.preventDefault();
          try{
               const isValid = validateEmail(email)
               if(isValid){
                    try{
                         setLoading(true);
                         const res = await axios.post('/api/reset-pass/recover',{email},REQ_CONFIG)
                         if(res.status===200){
                              setLoading(false);
                              setEmail('')
                              setMsg({type: 'success',message: res.data.msg})
                         } 
                    } catch(err: any){
                         setMsg({type: 'error', message: err.response.msg})
                    }
               } else{
                    setMsg({type: 'error',message: 'Email is Not Valid'})
               }
          } catch (err){
               setLoading(false);
               if(typeof err === 'string'){
                    setMsg({type: 'error',message: err.toLowerCase()})
                    console.error(err.toLowerCase())
               } else if(err instanceof Error) {
                    setMsg({type: 'error',message: err.message})
                    console.error(err.message)
               }
          }
     }
     const handleReset = () => {
          setEmail('')
          setMsg(INITIAL_FORM_MSG)
          setLoading(false)
     }
     return <>
     <Head>
          <title>Reset Password | ProgChat</title>
     </Head>
     <div className="auth-container">
          {(msg.message && msg.type!== '') && <div className={`msg${' '+msg.type}`}>{msg.message}</div>}
          <form className="auth-form" onSubmit={handleSubmit} onReset={handleReset}>
               <div className="header">
                    <h1>Reset Password</h1>
                    <Link className="back" href="/auth/signin"><MdChevronLeft/></Link>
               </div>
               <input type="email" name="email" className="input" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)}/>
               <div className="buttons">
                    <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Send Email'}</button>
                    <button type="reset">Reset</button>
               </div>
          </form>
     </div>
     </>
}