import "next-auth";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    // ye  jwt me user details me access ker sakte hai
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
  interface Session {
    // ye seesion me user details me access ker sakte hai
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"]; //har ek session me ek key aagi zisse muzhe further query kerne me easy hoga direct target ker sakta hu
  }
}

//asa bhi ker sakte hai hum properties ko add ker sakte hai
//yaha niche dekh lo details me
//https://next-auth.js.org/getting-started/typescript#adapters

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}
