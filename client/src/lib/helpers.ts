import { FORM_REGEXP, REQ_CONFIG } from "./constants";
import axios from "axios";
import { FormSubmitData, IUser } from "./types";
import { StorageReference } from "firebase/storage";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { KeyedMutator } from "swr";
import { signOut } from "next-auth/react";

export function generate(type: 'id' | 'username', length: number): string{
     const hash = type==='id' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' : 'abcdefghijklmnopqrstuvwxyz0123456789';
     let result = '';
     for (let i=0; i<length; i++){
          const rand = Math.floor(Math.random()*hash.length);
          result += hash[rand]
     }
     return result
}
export function validateSignup(formData: FormSubmitData.SignUpData): string{
     let resultTxt = '';
     if(formData.name && formData.name.length<2) resultTxt = 'Account Name Should Be Less Than 2 Characters'
     else if(formData.email && !FORM_REGEXP.email.test(formData.email)) resultTxt = "Please Enter a Valid Email"
     else if(formData.password && !FORM_REGEXP.password.test(formData.password)) resultTxt = "Password Must Be at Least 8 Characters Long and include at Least 1 Uppercase letter, 1 lowercase Letter and 1 number";
     else if(formData.confirmPass && formData.password!==formData.confirmPass) resultTxt = "These Passwords Doesn't Match";
     else resultTxt = ''
     return resultTxt
}
export function validateLogin(formData: FormSubmitData.LogInData): string{
     let resultTxt = '';
     if(formData.email && !FORM_REGEXP.email.test(formData.email)) resultTxt = "Please Enter a Valid Email"
     else if(formData.password && !FORM_REGEXP.password.test(formData.password)) resultTxt = "Password Must Be at Least 8 Characters Long and include at Least 1 Uppercase letter, 1 lowercase Letter and 1 number";
     else resultTxt = ''
     return resultTxt
}
export function validatePassReset(formData: FormSubmitData.ResetPassData): string{
     let resultTxt = '';
     if(!formData.newPass) resultTxt = 'It Is Required';
     else if(!FORM_REGEXP.password.test(formData.newPass)) resultTxt = 'Password is Too Weak';
     else if(!formData.confNewPass || formData.newPass!==formData.confNewPass) resultTxt = "These Passwords Doesn't Match";
     else resultTxt = '';
     return resultTxt
}
export function validateEmail(email:string){
     return !(!email && !FORM_REGEXP.email.test(email))
}
export const fetcher = async (url: string) => {
     const res = await axios.get(url,REQ_CONFIG);
     return res.data
}
export function formatBytes(t:number,B=2): string{
     if(!+t) return "0 Bytes";
     const unit = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"]
     const o=B<0?0:B;
     const a=Math.floor(Math.log(t)/Math.log(1024));
     return`${parseFloat((t/Math.pow(1024,a)).toFixed(o))} ${unit[a]}`;
}
export function uploadAttachment(fileRef: StorageReference, file: File, callback: (type: string, size: string, url: string) => void){
     uploadBytes(fileRef,file).then(result=>{
          getDownloadURL(result.ref).then(url=>{
               const type = result.metadata.contentType || '';
               const size = formatBytes(result.metadata.size);
               callback(type,size,url);
          });
          window.scrollTo(0,document.body.scrollHeight)
     }).catch(err=>console.error(err))
}
export const logOut = async(email: string | undefined, update: KeyedMutator<IUser>)=>{
     if(email){
          const res = await axios.patch('/api',{email, status: ''})
          if(res.status===200) {
               await update();
               await signOut();
          }
     }
}