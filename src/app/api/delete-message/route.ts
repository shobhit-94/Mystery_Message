import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";
export async function DELETE(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user || session.user) {
    return Response.json(
      {
        success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
        message: "not authenticated |not logged in",
      },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(request.url);
  const queryParam = { messageId: searchParams.get("messageId") };
  const delete_Message = await UserModel.updateOne(
    { id: user._id },
    { $pull: { messags: { _id: queryParam } } }
  );
  if (!delete_Message || delete_Message.modifiedCount === 0) {
    return Response.json(
      {
        success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
        message: "message not deleted",
      },
      { status: 401 }
    );
  }
  return Response.json(
    {
      success: true, //kyuki user mil gya hai to regestration nhi ho sakta hai
      messages: "message deleted successfully",
    },
    { status: 200 }
  );
}
