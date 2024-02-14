import { IUser, StatusType } from "@/lib/types";

interface StatusBarProps{
     data: IUser | undefined,
     switchStatus: (status: StatusType) => void;
}

export default function StatusBar({data,switchStatus}: StatusBarProps){
     return <div className="statusBar">
          <button onClick={()=>switchStatus('active')} className={data?.status==='active' ? 'active' : ''}>Online</button>
          <button onClick={()=>switchStatus('away')} className={data?.status==='away' ? 'active' : ''}>Away</button>
          <button onClick={()=>switchStatus('')} className={!data?.status ? 'active' : ''}>Offline</button>
     </div>
}