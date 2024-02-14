import { FormSubmitData, IChat, IFormMessage, IFormRegExp, ITheme } from "./types";

export const INITIAL_SIGNUP_DATA: FormSubmitData.SignUpData = {name: '',email: '',username:'',password: '',confirmPass: ''}
export const INITIAL_LOGIN_DATA: FormSubmitData.LogInData = {email: '', password: ''}
export const INITIAL_FORM_MSG: IFormMessage = {type: '', message: ''}
export const INITIAL_PASS_RESET_DATA: FormSubmitData.ResetPassData = {newPass: '', confNewPass: ''}
export const REQ_CONFIG = { headers: {"Content-Type": "application/json"} }
export const FORM_REGEXP: IFormRegExp = {
     email: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
     password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+#^-])?[A-Za-z\d@$!%*?&+#^-]{8,}$/i
};
export const URL_REGEX = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
export const GET_CHAT_PREVIEW: (email: string) => IChat[] = (email)=> [
     {
          from: 'Gorgeous Green',
          to: "Beautiful Blue",
          email,
          message: "Hello!",
          image: "/pfp/green.webp",
          id: "1",
          isEdited: false,
          hasAttachments: false,
          dateSent: new Date()
     },
     {
          from: 'Beautiful Blue',
          to: "Gorgeous Green",
          email: "aa@example.aa",
          message: "Hi There! How Are You?",
          image: "/pfp/blue.webp",
          id: "2",
          isEdited: false,
          hasAttachments: false,
          dateSent: new Date()
     },
     {
          from: 'Gorgeous Green',
          to: "Beautiful Blue",
          email,
          message: "I'm Fine. How abt you?",
          image: "/pfp/green.webp",
          id: "3",
          isEdited: false,
          hasAttachments: false,
          dateSent: new Date()
     },
     {
          from: 'Beautiful Blue',
          to: "Gorgeous Green",
          email: "aa@example.aa",
          message: "Good. Thanks!",
          image: "/pfp/blue.webp",
          id: "4",
          isEdited: false,
          hasAttachments: false,
          dateSent: new Date()
     },
     {
          from: 'Gorgeous Green',
          to: "Beautiful Blue",
          email,
          message: "No Problem. Have a Great Time!",
          image: "/pfp/green.webp",
          id: "3",
          isEdited: false,
          hasAttachments: false,
          dateSent: new Date()
     },
];
export const THEME_LIST: ITheme[] = [
     {theme: 'aero-theme', name: 'Aero', className: 'aero'},
     {theme: 'modern-light', name: 'Modern Light', className: 'modern'},
     {theme: 'modern-dark', name: 'Modern Dark', className: 'modern dark'}
]
export const FUNKY_SEASONS: ITheme[] = [
     {theme: 'funky-seasons-lime', name: "Electric Lime", className: "modern electric-lime"},
     {theme: 'funky-seasons-pink', name: "Hot Pink", className: "modern hot-pink"},
     {theme: 'funky-seasons-blue', name: "Sky Blue", className: "modern sky-blue"},
     {theme: 'funky-seasons-orange', name: "Neon Orange", className: "modern neon-orange"},
]