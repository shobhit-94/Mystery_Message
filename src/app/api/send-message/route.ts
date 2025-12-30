import { Message } from "@/app/model/User.model";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        {
          success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
          message: "User Not found",
        },
        { status: 404 }
      );
    }
    //IS user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
          message: "User is not accepting the messages",
        },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error occoured in sending message", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
