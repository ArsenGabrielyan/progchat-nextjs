import { authOptions } from "@/lib/providers-tools/nextAuthOptions";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions)