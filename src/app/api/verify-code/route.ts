import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found in databse in Verify-code file",
        },
        { status: 400 }
      );
    }
    const IsCodeValid = user.verifyCode === code;
    const IsCodeValidExpiry = new Date(user.verifyCodeExpiry) > new Date();
    if (IsCodeValid && IsCodeValidExpiry) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "user Verified successfully",
        },
        { status: 200 }
      );
    } else if (!IsCodeValidExpiry) {
      return Response.json(
        {
          success: false,
          message: "Verification is Expiry Please Signup again for new code",
        },
        { status: 400 }
      );
    } else if (!IsCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verficatio code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("error in checking username ", error);
    return Response.json(
      {
        success: false,
        message: "Error in Verifying user",
      },
      { status: 400 }
    );
  }
}
