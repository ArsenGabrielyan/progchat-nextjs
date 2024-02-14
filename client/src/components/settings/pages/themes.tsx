import ChatTile from "@/components/message/Chat-Tile";
import { FUNKY_SEASONS, GET_CHAT_PREVIEW, THEME_LIST } from "@/lib/constants";

interface AppearanceSettingsProps{
     email?: string
}

export default function Themes({email}: AppearanceSettingsProps){
     const chatPreview = GET_CHAT_PREVIEW(email as string);
     const changeTheme = (i:number, type: 'original' | 'funky-seasons' = 'original') => {
          const arr = type==='original' ? THEME_LIST : FUNKY_SEASONS;
          const elem = arr[i]
          const outerWidth = document.querySelector('.outer-width') as HTMLDivElement
          outerWidth.className = `outer-width ${elem.className}`
          localStorage.setItem('theme',elem.className)
     }
     return <div className="setting">
          <h2>Themes</h2>
          <h3>Original Themes</h3>
          <div className="appearance-box">{THEME_LIST.map((val,i)=><div key={i} className={`appearance ${val.theme}`} title={val.name} onClick={()=>changeTheme(i)}/>)}</div>
          <h3>Funky Seasons</h3>
          <div className="appearance-box">{FUNKY_SEASONS.map((val,i)=><div key={i} className={`appearance ${val.theme}`} title={val.name} onClick={()=>changeTheme(i,'funky-seasons')}/>)}</div>
          <h3>Preview</h3>
          <div className="chatbox preview">
               {chatPreview.map(val=><ChatTile key={val.id} data={val} currEmail={email as string} onPfpClick={()=>{
                    return;
               }}>{val.message}</ChatTile>)}
          </div>
     </div>
}