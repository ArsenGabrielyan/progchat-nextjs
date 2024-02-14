import { FormFN } from "@/lib/types"

interface SettingFormControlProps{
     labelName: string,
     controlId: string,
     controlType: string
     changeValue: FormFN,
     value: any,
     controlName: string
}

export default function SettingFormControl({labelName, controlId, controlType, controlName, value, changeValue}: SettingFormControlProps){
     return <div className="frmGroup">
          <label htmlFor={controlId}>{labelName}</label>
          <input type={controlType} name={controlName} id={controlId} value={value} onChange={changeValue}/>
     </div>
}