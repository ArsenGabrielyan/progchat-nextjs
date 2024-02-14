import { INITIAL_FORM_MSG, INITIAL_SIGNUP_DATA, REQ_CONFIG } from "@/lib/constants";
import { validateSignup } from "@/lib/helpers";
import type { FormFN } from "@/lib/types";
import axios from "axios";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

export default function SignUp(){
     const [formData, setFormData] = useState(INITIAL_SIGNUP_DATA);
     const [msg, setMsg] = useState(INITIAL_FORM_MSG);
     const [loading, setLoading] = useState(false);
     const handleChange: FormFN = e => {
          const elem = e.target as HTMLInputElement;
          setFormData({...formData, [elem.name]: elem.value})
     }
     const handleSubmit: FormFN = async e => {
          e.preventDefault();
          try{
               const message = validateSignup(formData);
               if(message===''){
                    setLoading(true);
                    const res = await axios.post('/api/signup',{signupData: formData},REQ_CONFIG)
                    if(res.status===200){
                         setLoading(false);
                         setMsg({type: 'success',message: 'Account Creation Successful'})
                         setTimeout(async()=>{
                              handleReset();
                              await signIn(undefined,{callbackUrl: '/'});
                         },1000);
                    }
               } else{
                    setMsg({type: 'error',message})
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
          setFormData(INITIAL_SIGNUP_DATA)
          setMsg(INITIAL_FORM_MSG)
          setLoading(false)
     }
     return <>
     <Head>
          <title>Sign Up | Prog Chat</title>
     </Head>
     <div className="auth-container">
          {msg.message && <div className={`msg${' '+msg.type}`}>{msg.message}</div>}
          <form className="auth-form" onSubmit={handleSubmit} onReset={handleReset}>
               <h1 className="header-txt">Sign Up</h1>
               <p>Let&apos;s Get Started!</p>
               <input type="text" name="name" className="input" placeholder="Account Name" value={formData.name} onChange={handleChange}/>
               <input type="email" name="email" className="input" placeholder="Email Address" value={formData.email} onChange={handleChange}/>
               <input type="text" name="username" className="input" placeholder="Username" value={formData.username} onChange={handleChange}/>
               <input type="password" name="password" className="input" placeholder="Password" value={formData.password} onChange={handleChange}/>
               <input type="password" name="confirmPass" className="input" placeholder="Confirm Password" value={formData.confirmPass} onChange={handleChange}/>
               <div className="buttons">
                    <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
                    <button type="reset">Reset</button>
               </div>
               <p>Already a User? <Link href="/auth/signin">Sign in</Link></p>
          </form>
     </div>
     </>
}