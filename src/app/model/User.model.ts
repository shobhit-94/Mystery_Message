import mongoose, { Schema, Document } from "mongoose";
import { required } from "yargs";
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: [];
  createdAt: Date;
}
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, "Please use a valid email address"],
    password: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is reuired"],
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: {
    type: [MessageSchema],
  },
});
/*
kyuki plain backend monoogse me ek barr code run hoga or model create ho zaega server pe
or bar ba co existing model use hoga lekin next js me alag hai
Nextjs me ise pata ni hota ki modle first time Ban ra hai ya isse pehle ban chuka hai

1condtion:agar existing hai model to  vahi model <User> wala de fo
2nd condtion:Agar exiting nahi hai to first time hai create kro User model same
as plain javascipt backend 
*/
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) || //agar usermodel bana hua hai
  mongoose.model<User>("User", UserSchema); //backend series jasie agar User model nhi bana hua hai
// <USer> ye TypeScript hai j bata rah ahai ki Model User Type ka hai
export default UserModel;
