import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {MongoDBAdapter} from "@auth/mongodb-adapter"
import clientPromise from "./mongodb";
import connectDB from "./connectDB";
import User from "@/models/user";
import bcrypt from "bcrypt"
import { Adapter } from "next-auth/adapters";
import { generate } from "../helpers";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authOptions: AuthOptions = {
     pages: {signIn: '/auth/signin'},
     providers: [
          Credentials({
               name: "Arsen's ProgChat",
               id: 'credentials',
               credentials: {
                    email: {type: 'email'},
                    password: {type: 'password'}
               },
               async authorize(credentials) {
                    await connectDB();
                    const user = await User.findOne({email: credentials?.email});
                    if(!user) throw new Error('This User Does Not Exist. You Can Create It, If You Want')
                    const isValid = await bcrypt.compare(credentials?.password as string | Buffer, user.password);
                    if(!isValid) throw new Error('Incorrect Password. Please Try Again Later');
                    return user
               }
          }),
          Github({
               clientId: process.env.GITHUB_ID as string,
               clientSecret: process.env.GITHUB_SECRET as string
          }),
          Google({
               clientId: process.env.GOOGLE_ID as string,
               clientSecret: process.env.GOOGLE_SECRET as string
          })
     ],
     adapter: MongoDBAdapter(clientPromise) as Adapter,
     session: {strategy: 'jwt'},
     secret: process.env.JWT_TOKEN,
     callbacks: {
          async signIn({ user, account }){
               let result = false, errTxt;
               if(account?.provider!=='credentials'){
                    try{
                         await connectDB();
                         const userExists = await User.findOne({email: user.email});
                         const isTakenUsername = await User.findOne({username: user.name?.split(' ')[0].toLowerCase()});
                         if(!userExists) {
                              const userId = generate('id',8);
                              const {email,name,image} = user
                              const userDetails = {
                                   email,name,image,
                                   username: isTakenUsername ? `${user.name?.split(' ')[0].toLowerCase()}-${generate('username',8)}` : user.name?.split(' ')[0].toLowerCase(),
                                   user_id: userId,
                                   isAccNew: false,
                              }
                              const newUser = new User(userDetails);
                              await newUser.save();
                         }
                         result = true;
                         await User.findOneAndUpdate({email: user.email},{$set: {status: 'active'}});
                    } catch(err){
                         console.error(err);
                         errTxt = err;
                         result = false;
                    }
               } else {
                    await connectDB();
                    await User.findOneAndUpdate({email: user.email},{$set: {status: 'active'}});
               }
               result=!errTxt;
               console.info("The Result of Sign In Is " + result)
               return result
          },
          async jwt({token, user}){
               if(user){
                    const profile = await User.findOne({email: user.email});
                    token.user = {email: user.email, id: profile.user_id} 
               } 
               return token
          },
          async session({token, session}){
               session.user = token?.user as any;
               return session;
          },
     }
}