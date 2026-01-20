import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessage: boolean;
}
// https://next-auth.js.org/providers/credentials
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: {
          label: "Email or username",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<string, string> | undefined, //Record<string, string>|undefined  default nextauth ka return type hai
      ): Promise<AuthUser | null> {
        //Promsie me ek userObject ya null return kernga humne AuthUser interface banake export ker diya idhar
        await dbConnect();
        try {
          if (!credentials) {
            //ye kro nhi to har jagah ? laganahoga creadital null ke case me runtimecreash se bachne ke liyeF
            throw new Error("Missing credentials");
          }
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email or username");
          }
          if (!user.isVerified) {
            throw new Error("please verify your acccount first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (isPasswordCorrect) {
            return {
              id: user._id.toString(),
              username: user.username,
              email: user.email,
              isVerified: user.isVerified,
              isAcceptingMessage: user.isAcceptingMessage,
            };
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    //configuration/callbacks
    async session({ session, user, token }) {
      //seesion me bhi ek user object ke ander sari details add ker di hai dekho yaha ypes/next-auth.d.ts  file me

      session.user._id = token._id;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessage = token.isAcceptingMessage;
      session.user.username = token.username;
      // console.log("session ", session);

      return session;
    },
    async jwt({ token, user }) {
      //jwt me bhi user ke sare fileds add ker diya hai dekho yaha ypes/next-auth.d.ts file me
      if (user) {
        //ye user jwt ka ise asa mat sochna ki jo humara user hai or sari value verifyCode ,isVerified, verifyCodeExpiry, isAcceptingMessage
        //isliye pehle types/next-auth.d.ts file me is user me ye sare types add kero phir yaha access kro
        //pehle zake 'next-auth' me sari values ko add kro usermodel se zo-zo chahhiye tumhe
        token._id = user.id?.toString(); //Obecjid se string me badal zaega
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
        // console.log("token", token);
      }
      return token;
    },
  },
  pages: {
    //configuration/pages
    signIn: "/sign-in",
    // signIn: "/auth/signin",
    // signOut: "/auth/signout",//ye to maincustom bananuuga baki niche to asas ho copy-paste ker diye site se
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
