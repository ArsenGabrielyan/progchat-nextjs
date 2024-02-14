import { useContext, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { REQ_CONFIG } from "@/lib/constants";
import { toast } from "react-toastify";
import SettingFormControl from "@/components/settings/FrmControl";
import { SettingContext } from "@/pages/settings";

export default function AllSettings(){
     const [linkInput, setLinkInput] = useState('');
     const [sending, setSending] = useState(false);
     const pfpRef = useRef<HTMLInputElement>(null);
     const speech = new SpeechSynthesisUtterance("This is a Test From a Programming Chat Application");
     const voices = speechSynthesis.getVoices();
     const [speaking, setSpeaking] = useState(false);
     const {currData,changeFn,isCurrent,cancelFn,applySetting,processing, currState, linkFn,uploading,changePfp, checkFn} = useContext(SettingContext);
     const testTts = () => {
          if(!speaking){
               speech.rate = currState?.ttsRate as number;
               speech.voice = voices[currState?.ttsVoiceIndex as number];
               speechSynthesis.speak(speech);
               speech.onstart = () => setSpeaking(true);
               speech.onend = () => setSpeaking(false);
          } else {
               speechSynthesis.pause();
               speechSynthesis.cancel();
               setSpeaking(false);
          }
     }
     const sendTokenLink = async() => {
          setSending(true);
          const res = await axios.post('/api/reset-pass/recover',{email: currData?.email},REQ_CONFIG)
          if(res.status===200){
               setSending(false);
               toast.success(res.data.msg)
          }
     }
     return <div className="setting">
          <h2>Account Settings</h2>
          <div className="profileSection">
               <div className="profile">
                    <div className="img">
                         {currState?.image && <Image src={currState?.image} alt="pfp" width={70} height={70}/>}
                         <div className={`status ${currData?.status}`}/>
                    </div>
                    <h3>{currData?.name}</h3>
               </div>
               <input type="file" name="image" onChange={changePfp} ref={pfpRef}/>
               <button className="btn" onClick={()=>pfpRef.current?.click()} disabled={uploading}>{uploading ? "Uploading..." : "Change Profile Picture"}</button>
          </div>
          {currState?.name && <SettingFormControl labelName="Name" controlId="name" controlName="name" controlType="text" value={currState?.name} changeValue={changeFn}/>}
          {currState?.username && <SettingFormControl labelName="Username" controlId="username" controlName="username" controlType="text" value={currState?.username} changeValue={changeFn}/>}
          <div className="frmGroup">
               <label htmlFor="password">Password</label>
               <button className="btn" type="button" id="password" onClick={sendTokenLink} disabled={sending}>{sending ? "Sending..." : "Change Password"}</button>
          </div>
          {currState?.showAboutPage && <div className="frmGroup">
               <label htmlFor="about">About</label>
               <textarea name="bio" id="about" rows={5} value={currState?.bio} onChange={changeFn}/>
           </div>}
          {currState?.links && <div className="frmGroup">
               <label htmlFor="password">Additional Links</label>
               <div className="split">
                    <input type="text" name="linkName" value={linkInput} onChange={e=>setLinkInput(e.target.value)} onKeyUp={e=>{
                         if(!e.repeat && e.key==='Enter'){
                              e.preventDefault();
                              linkFn('add',linkInput,()=>setLinkInput(''))
                         }
                    }}/>
                    <button className="btn" type="button" onClick={()=>linkFn('add',linkInput,()=>setLinkInput(''))}>Add Link</button>
                </div>
               {!!currState?.links?.length && <ul className="linkList">
                    {currState?.links.map((link: string,i: number)=><li key={i}>
                         <p>{link}</p>
                         <div className="buttons">
                              <button className="btn" onClick={()=>linkFn('edit',link)}>Edit</button>
                              <button className="btn-red" onClick={()=>linkFn('delete',link)}>Delete</button>
                         </div>
                    </li>)}
               </ul>}
          </div>}
          <h2>Text To Speech Settings</h2>
          <div className={currState?.textToSpeech ? "" : "disabled"}>
               <div className="frmGroup">
                    <label htmlFor="rate">Rate ({currState?.ttsRate}x)</label>
                    <input type="range" name="ttsRate" id="rate" min={0.25} max={2} value={currState?.ttsRate} onChange={changeFn} step={0.25}/>
               </div>
               <div className="frmGroup">
                    <label htmlFor="voice">Voice</label>
                    <div className="split">
                         <select name="ttsVoiceIndex" id="voice" value={currState?.ttsVoiceIndex} onChange={changeFn}>
                              {voices.map((voice,i)=><option value={i} key={i}>{voice.name}</option>)}
                         </select>
                         <button className="btn" onClick={testTts}>{speaking ? 'Stop' : "Test TTS"}</button>
                    </div>
               </div>
          </div>
          <label htmlFor="tts" className="checkbox">
               <span>Enable Text to Speech</span>
               <input type="checkbox" name="textToSpeech" id="tts" checked={currState?.textToSpeech} onChange={checkFn}/>
               <div className="toggle-container">
                    <span className="toggle"></span>
                    <span className="toggle-c"></span>
               </div>
          </label>
          <h3>Danger Zone</h3>
          <div className="buttons">
               <button className="btn-red">Delete All Messages</button>
               <button className="btn-red">Delete the Account</button>
          </div>
          <div className="buttons left">
               <button type="button" className="btn-green" disabled={processing || isCurrent} onClick={applySetting}>{processing ? 'Processing...' : 'Save'}</button>
               <button onClick={cancelFn} type="button" disabled={processing || isCurrent} className="btn-gray">Cancel</button>
          </div>
     </div>
}