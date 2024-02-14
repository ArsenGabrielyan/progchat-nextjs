import { useState } from "react";

interface ImageSelectorProps{
     value?: string,
     setValue: (val: string) => void;
}

export default function ImageSelector({value, setValue}: ImageSelectorProps){
     const data = ['red','orange','green','blue','purple','white'];
     const [selected, setSelected] = useState(value || '')
     const changeColor = (val: string)=>{
          setSelected(val)
          setValue(val)
     }
     return <div className="select-container">
          {data.map((val,i)=><div key={i} onClick={()=>changeColor(val)} className={`select-item${' '+val}${val===selected ? ' selected' : ''}`}/>)}
     </div>
}