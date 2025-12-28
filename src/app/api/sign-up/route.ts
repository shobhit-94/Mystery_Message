import dbConnect from "@/lib/dbConnect";
import UserModel from "../../model/User.model";
import bcrypt from "bcryptjs";
import { success } from "zod";
import { sendVerification } from "@/helpers/sendVerificationEmails";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUSerVerifiedByUSer = await UserModel.findOne({
      username,
      isVerified: true,
    });
    //if useralready verified then return no regitration
    if (existingUSerVerifiedByUSer) {
      return Response.json(
        {
          success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
          message: "USer already present or already taken",
        },
        { status: 400 }
      );
    }
    //if user not verified then futher check

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    //user not verified but it's data present in databse
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
            message: "USer already exists and verified with the email",
          },
          { status: 400 }
        );
      } else {
        //user not verifed and also not presnet it data in databse then save data in
        //databse and send verifiation email
        const hashedpassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedpassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
        await existingUserByEmail.save();
      }
    } else {
      //fresh enew user visited the website so save it data into databse first then send veririfiacation email
      const hashedpassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);

      const newUser = new UserModel({
        username,
        email,
        password: hashedpassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerification(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 200,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully,Please verify your Email",
      },
      {
        status: 200,
      }
    );

    // else{}
  } catch (error) {
    console.error("Error in Regestering user" + error);
    return Response.json(
      {
        success: false,
        message: "Error regestering user",
      },
      {
        status: 400,
      }
    );
  }
}
