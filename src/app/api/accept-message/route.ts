import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions); //current logged in user chhiye jo seesion me humne store kiya tha option.ts file me
  //to getserversession se current Seesion me se hum current logged in user nikal lenge
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

  const { acceptMessage } = await request.json();
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );
    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "Message accpetance Status failed",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message accpetance Status Success",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
        message:
          "Failed to update status of user to accept message in api/accept-message",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
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
    const FoundedUser = await UserModel.findById(user._id);
    // const Messagestatus = user?.isAcceptingMessage;
    if (!FoundedUser) {
      return Response.json(
        {
          success: false,
          message: "User Acceptance Status not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Acceptance Status",
        isAcceptingMessage: FoundedUser?.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "//Failed !! Error in User Acceptance Status//  ",
      },
      { status: 500 }
    );
  }
}
