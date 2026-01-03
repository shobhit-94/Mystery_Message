"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as z from "zod";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";

// import { Form } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Button } from "@react-email/components";
import { useForm } from "react-hook-form";
const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    //is form me bas signupschmea type ki values hi aa sakti hai humne set kerdiya z.infer se type
    //sari filed signup schea me hi hai or vaise hi same ype ki value hume sign-in me bhi chhiye to isliye
    //signUpSchema  import kro new value zod se mat bana yaha nahi to zayada kaam lagega aha bhi wahi username,password,emal redine kerna padega same signup schema  zaise
    resolver: zodResolver(verifySchema),
    // defaultValues: {
    //   username: "",
    //   email: "",
    //   password: { password: "", confirmPassword: "" },
    // },
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      //   const { searchParams } = new URL(request.url);
      //   const queryParam = { username: searchParams.get("username") };
      const body = {
        username: param.username, // ✅ from route param
        code: data.code,
      };
      console.log("data ,queryParam ,body", data, param.username, body);

      const response = await axios.post("/api/verify-code", body);
      toast.success(`${response.data.message}`);
    } catch (error) {
      console.log("Error in Verifing User", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error in verifying user");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification code</FormLabel>
                      <FormControl>
                        <Input placeholder="code" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please Enter a valid code for Verification.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="bg-black text-white" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
