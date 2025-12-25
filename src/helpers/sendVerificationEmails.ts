import { Resend } from "resend";
import VerificationEmail from "../../emals/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const resend = new Resend("re_123456789");
    await resend.emails.send({
      from: "you@example.com",
      to: email,
      subject: "Mystery message | Verification Code",
      react: VerificationEmail({username:username,otp:verifyCode}),
      
    });
    return { success: true, message: "verification email send successfully" };
  } catch (emailError) {
    console.error("Error in sending verification email " + emailError);
    return { success: false, message: "Error in sending verification email " };
  }
}
