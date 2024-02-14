import Link from "next/link";
import React, { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { MdChevronLeft } from "react-icons/md";
import { INITIAL_FORM_MSG, INITIAL_LOGIN_DATA } from "@/lib/constants";
import type { FormFN } from "@/lib/types";
import { validateLogin } from "@/lib/helpers";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SignIn(){
     const [formData, setFormData] = useState(INITIAL_LOGIN_DATA);
     const [msg, setMsg] = useState(INITIAL_FORM_MSG);
     const [loading, setLoading] = useState(false);
     const router = useRouter();
     const callbackUrl = router.query.callbackUrl as string || "/"
     const handleChange: FormFN = e => {
          const elem = e.target as HTMLInputElement;
          setFormData({...formData, [elem.name]: elem.value})
     }
     const handleSubmit: FormFN = async e => {
          e.preventDefault();
          try{
               const message = validateLogin(formData);
               if(message===''){
                    setLoading(true);
                    const res = await signIn('credentials',{
                         redirect: false,
                         email: formData.email,
                         password: formData.password,
                         callbackUrl
                    })
                    setLoading(false);
                    if(!res?.error){
                         router.push(callbackUrl);
                         setMsg({type: 'success',message: 'Account Successfully Signed In'})
                    } else {
                         setMsg({type: 'error',message: res?.error})
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
          setFormData(INITIAL_LOGIN_DATA)
          setMsg(INITIAL_FORM_MSG)
          setLoading(false)
     }
     return <>
     <Head>
          <title>Sign In | ProgChat</title>
     </Head>
     <div className="auth-container">
          {(msg.message && msg.type!== '') && <div className={`msg${' '+msg.type}`}>{msg.message}</div>}
          <form className="auth-form" onSubmit={handleSubmit} onReset={handleReset}>
               <div className="header">
                    <h1>Sign In</h1>
                    <Link className="back" href="/"><MdChevronLeft/></Link>
               </div>
               <input type="email" name="email" className="input" placeholder="Email Address" value={formData.email} onChange={handleChange}/>
               <input type="password" name="password" className="input" placeholder="Password" value={formData.password} onChange={handleChange}/>
               <Link href="/auth/reset-password">Forgot Your Password?</Link>
               <div className="buttons">
                    <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>
                    <button type="reset">Reset</button>
               </div>
               <p>New Here? <Link href="/auth/signup">Create an Account</Link></p>
               <p className="bigTxt">Or</p>
               <div className="oauth">
                    <button type="button" onClick={async()=>await signIn('google',{callbackUrl: "/"})}><FaGoogle/> Continue With Google</button>
                    <button type="button" onClick={async()=>await signIn('github',{callbackUrl: "/"})}><FaGithub/> Continue With Github</button>
               </div>
          </form>
     </div>
     </>
}