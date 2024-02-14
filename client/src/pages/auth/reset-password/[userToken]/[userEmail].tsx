import React, { useState } from "react";
import { INITIAL_FORM_MSG, INITIAL_PASS_RESET_DATA, REQ_CONFIG } from "@/lib/constants";
import { FormFN } from "@/lib/types";
import { validatePassReset } from "@/lib/helpers";
import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import connectDB from "@/lib/providers-tools/connectDB";
import Token from "@/models/token";
import Head from "next/head";

interface PassResetProps{
     isLinkInvalid: boolean
}

export default function PassResetForm({isLinkInvalid}: PassResetProps){
     const [formData, setFormData] = useState(INITIAL_PASS_RESET_DATA)
     const [msg, setMsg] = useState(INITIAL_FORM_MSG);
     const [loading, setLoading] = useState(false);
     const router = useRouter();
     const {userToken, userEmail} = router.query;
     const handleChange: FormFN = e => {
          const elem = e.target as HTMLInputElement;
          setFormData({...formData, [elem.name]: elem.value})
     }
     const handleSubmit: FormFN = async e => {
          e.preventDefault();
          try{
               const msg = validatePassReset(formData)
               if(msg===''){
                    try{
                         setLoading(true);
                         const res = await axios.post('/api/reset-pass',{token: userToken as string,email: userEmail as string,newPass: formData.newPass},REQ_CONFIG)
                         if(res.status===200){
                              setLoading(false);
                              setFormData({newPass:'',confNewPass:''})
                              setMsg({type: 'success',message: res.data.msg})
                              setTimeout(()=>router.push('/'),2000)
                         } 
                    } catch(err: any){
                         setMsg({type: 'error', message: err.response.msg})
                    }
               } else{
                    setMsg({type: 'error',message: msg})
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
          setFormData(INITIAL_PASS_RESET_DATA)
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
          <h1>Reset Password</h1>
          {!isLinkInvalid ? <>
               <input type="password" name="newPass" className="input" placeholder="New Password" value={formData.newPass} onChange={handleChange}/>
               <input type="password" name="confNewPass" className="input" placeholder="Confirm New Password" value={formData.confNewPass} onChange={handleChange}/>
               <div className="buttons">
                    <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Change'}</button>
                    <button type="reset">Reset</button>
               </div>
          </>: <p>The page you&apos;re trying to get to isn&apos;t available</p>}
     </form>
     </div>
     </>
}
export const getServerSideProps: GetServerSideProps = async({query})=>{
     await connectDB();
     const claimedToken = await Token.findOne({token: query.userToken})
     if(!claimedToken) return {props: {isLinkInvalid: true}};
     else return {props: {isLinkInvalid: false}};
}