import { signUpSchema } from "@/schemas/signUpSchema";
import { usernamevalidation } from "@/schemas/signUpSchema";
import * as z from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

export async function GET(request: Request) {
  try {
    await dbConnect();
    //localhost://3000/api?username="abc"?phone="android"
    //muzhe api url  me ? lagajker query milgi usme se me username nikallunga
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("result = ", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []; //error ki array milegi
      return Response.json(
        {
          success: false,
          //agar usernmaeerrors ka array mila hai to comma lagaker sare error dikhado nhi to "inavlid query paramters dikha do"
          //dono se hi pata chal zaegi ki query parameters me error aa rakhi hai
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(",")
              : "Invalid query Parameteres in check-username-uniqueness file",
        },
        { status: 400 }
      );
      //   console.log(result.error.issues);
    }
    const { username } = result.data;
    console.log(username, "username");
    const user = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (user) {
      return Response.json(
        {
          success: false,
          message: "Username has already taken",
        },
        { status: 400 }
      );
    }
    if (!user) {
      return Response.json(
        {
          success: true,
          message: "Usernamee is available",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("error in checking username ", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking username",
      },
      { status: 400 }
    );
  }
}
