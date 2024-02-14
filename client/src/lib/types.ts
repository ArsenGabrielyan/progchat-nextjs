import React, { Dispatch, SetStateAction } from "react";

export interface IMessage{
     name: string,
     email: string,
     message: string,
     image: string,
     id: string
}
export interface IFormMessage{
     type: 'error' | 'success' | '',
     message: string
}
export interface IFormRegExp{
     email: RegExp,
     password: RegExp
}
export namespace FormSubmitData{
     export interface LogInData{
          email: string,
          password: string
     }
     export interface SignUpData{
          name: string,
          email: string,
          username: string,
          password: string,
          confirmPass: string
     }
     export interface ResetPassData{
          newPass: string,
          confNewPass: string
     }
}
export type StatusType = 'active' | 'away' | '';
export type InputType = 'edit' | 'add' | ''
export interface ITheme{
     theme: 'aero-theme' | '' | 'modern-dark' | 'modern-light' | 'funky-seasons-lime' | 'funky-seasons-pink' | 'funky-seasons-blue' | 'funky-seasons-orange',
     name: string,
     className: string
}
export interface IChat{
     from: string,
     to: string
     email: string,
     message: string,
     image: string,
     id: string,
     isEdited: boolean,
     hasAttachments: boolean,
     dateSent: Date
}
export interface IChatMessage extends IChat{
     __v: number,
     _id: string
}
export interface IUser{
     email: string,
     image: string,
     isAccNew: boolean,
     name: string,
     username: string
     password: string,
     status: StatusType,
     user_id: string,
     bio: string,
     links: string[],
     tts: {
          rate: number,
          voiceIndex: number,
          enabled: boolean
     },
     _id: string,
     _userKey: number
}
export interface EditMessageArgs{
     newMsg: string,
     id: string
}
export interface DeleteMessageArgs{
     id: string
}
export type FormFN = (e: React.FormEvent) => void;
export type KeyEvent<T> = (e: React.KeyboardEvent<T>) => void;
export type MouseFn<T,E> = (e: React.MouseEvent<T,E>) => void;
export type InputFn = (input: string) => void;
export type SettingType = '' | 'settings' | 'themes';
export interface IPosition{ x:number, y:number }
export interface ICurrState{
     username: string | undefined,
     name: string | undefined,
     bio: string | undefined,
     showAboutPage: true,
     links: string[] | undefined,
     image: string | undefined,
     status: StatusType | undefined,
     ttsRate: number | undefined,
     ttsVoiceIndex: number | undefined,
     textToSpeech: boolean | undefined
}
export interface ISettingChildren{
     currData: IUser | undefined
     changeFn: FormFN,
     isCurrent: boolean,
     cancelFn: () => void,
     applySetting: ()=>void,
     processing: boolean,
     currState: ICurrState,
     linkFn: (type: 'add' | 'edit' | 'delete', input?: string, callback?: () => void) => void,
     uploading: boolean,
     changePfp: FormFN,
     checkFn: FormFN
}
export interface IChatContext{
     isOpen?: boolean,
     setIsOpen?: Dispatch<SetStateAction<boolean>>,
     openDM?: (id: string) => void,
     handleContextMenu?: MouseFn<HTMLDivElement,MouseEvent>,
     handleAddMessage?: (input: string, currId?: string, hasAttachments?: boolean) => void,
     handleTyping?: InputFn,
     editMessage?: InputFn,
     cancelEdit?: (setInput: Dispatch<SetStateAction<string>>) => void,
     typing?: string,
     mode?: InputType,
     selected?: IChat,
     status?: "authenticated" | "loading" | "unauthenticated"
}