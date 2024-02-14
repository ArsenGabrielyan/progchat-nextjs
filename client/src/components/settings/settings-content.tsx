import { FormFN, ICurrState, ISettingChildren, IUser, SettingType } from "@/lib/types";
import React, { ReactNode, useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/helpers";
import PfpForm from "@/components/profile-pic/Pfp-Form";
import { Session } from "next-auth";
import SettingsHeader from "./Settings-bar";
import axios from "axios";
import { REQ_CONFIG, URL_REGEX } from "@/lib/constants";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/providers-tools/firebase";

interface SettingContentProps{
     session: Session | null,
     children: (props: ISettingChildren) => ReactNode,
     isOpen: boolean,
     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
     setSettingType: React.Dispatch<React.SetStateAction<SettingType>>
}

export default function SettingContent({session, children, isOpen, setIsOpen, setSettingType}: SettingContentProps){
     const {data: currData, isLoading, mutate: updateCurrUser} = useSWR<IUser>(session && session.user ? `/api?email=${session?.user?.email}` : null,fetcher);
     const [currState, setCurrState] = useState({} as ICurrState);
     const [processing, setProcessing] = useState(false);
     const [uploading, setUploading] = useState(false)
     useEffect(()=>{
          if(!isLoading) setCurrState({
               username: currData?.username,
               name: currData?.name,
               bio: currData?.bio,
               showAboutPage: true,
               links: currData?.links,
               image: currData?.image,
               status: currData?.status,
               ttsRate: currData?.tts.rate,
               ttsVoiceIndex: currData?.tts.voiceIndex,
               textToSpeech: currData?.tts.enabled
          })
     },[isLoading, currData])
     const handleChange: FormFN = e => {
          const elem = e.target as HTMLInputElement & HTMLTextAreaElement
          if(currState) setCurrState({...currState, [elem.name]: elem.value})
     }
     const handleCheck: FormFN = e => {
          const elem = e.target as HTMLInputElement & HTMLTextAreaElement
          if(currState) setCurrState({...currState, [elem.name]: elem.checked})
     }
     const currSetting: ICurrState = {
          username: currData?.username,
          name: currData?.name,
          bio: currData?.bio,
          showAboutPage: true,
          links: currData?.links,
          image: currData?.image,
          status: currData?.status,
          ttsRate: currData?.tts.rate,
          ttsVoiceIndex: currData?.tts.voiceIndex,
          textToSpeech: currData?.tts.enabled
     }
     const cancelSetting = () => setCurrState(currSetting);
     const isCurrent = JSON.stringify(currSetting)===JSON.stringify(currState)
     const handleApplySetting = async() => {
          setProcessing(true)
          const res = await axios.put('/api',{currState, email: session?.user?.email || ''},REQ_CONFIG);
          if(res.status===200){
               setProcessing(false);
               toast.success('Settings Saved')
               await updateCurrUser();
          }
     }
     const linkFn = (type: 'add' | 'edit' | 'delete', input: string='', callback?: () => void)=>{
          if(!input || input.trim()==='') return;
          const links: string[] = [...currState.links as string[]]
          switch(type){
               case 'add':
                    if(URL_REGEX.test(input)) links.push(input);
                    else toast.error('The URL Address You Provided is Invalid');
                    break;
               case 'edit':
                    const newVal = prompt('New Link',input)!
                    if(URL_REGEX.test(newVal)){
                         const selectedIndex = links.findIndex(val=>val===input)!
                         links[selectedIndex] = newVal
                    } else toast.error('The URL Address You Provided is Invalid')
                    break;
               case "delete":
                    const idxToDelete = links.findIndex(val=>val===input)!
                    links.splice(idxToDelete,1);
                    break;
               default:
                    alert('Invalid Action')
          }
          setCurrState({...currState, links})
          if(callback) callback()
     }
     const changeSetting = (setting: SettingType) => {
          setSettingType(setting)
          setIsOpen(false);
          localStorage.setItem('setting-type',setting)
     }
     const changePfp: FormFN = e => {
          const elem = e.target as HTMLInputElement;
          if(elem.files){
               const file = elem.files[0];
               const fileRef = ref(storage,`/profile-pics/${currData?.user_id}`);
               setUploading(true)
               uploadBytes(fileRef,file).then(val=>getDownloadURL(val.ref).then(url=>{
                    setUploading(false)
                    setCurrState({...currState, image: url})
               }))
          }
     }
     return <>
          {!isLoading && <>
          {currData?.isAccNew ? <PfpForm currData={currData}/> : <>
          <SettingsHeader data={currData} update={updateCurrUser} open={isOpen} setOpen={setIsOpen}/>
          </>}</>}
          <div className="main-container">
               {isOpen && <div className="rooms settings">
                    <ul>
                         <li onClick={()=>changeSetting('settings')}>App Settings</li>
                         <li onClick={()=>changeSetting('themes')}>Themes</li>
                    </ul>
               </div>}
               <div className={`inner-content${!isOpen ? ' sidebar-closed' : ''}`}>
                    {children({currData,changeFn: handleChange,isCurrent,cancelFn: cancelSetting, applySetting: handleApplySetting, processing, currState, linkFn, uploading, changePfp, checkFn: handleCheck})}
               </div>
          </div>
     </>
}