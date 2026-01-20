"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/schemas/signInSchema";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //usehook.ts ko install kro site se or docs pado
  // const [debouncedValue, setValue] = useDebounceValue(username, 500)
  //Toast is depreacted install sooner
  // OR
  // const [debouncedUsername] = useDebounceValue(username, 300);
  /*It returns a tuple:

[value, setValue] */
  //  const usernamevalidation = z
  //   .string()
  //   .min(2, "username must be atleast 2 characters")
  //   .max(20, "uername must be atmost 20 characters")
  //   .regex(
  //     /^[a-zA-Z0-9_]+$/,
  //     "please write only alphabets ,not alphabets in username"
  //   );
  // //ato z or A-Z or 0-9 or _ insab se milker hi bana hona chahye username

  // const signUpSchema = z.object({
  //   username: usernamevalidation, //usernamevalidation ko reuse ker liya yaha per
  //   email: z.string().email({ message: "Invalid email address" }),
  //   password: z.object({
  //     password: z.string().min(6),
  //     confirmPassword: z.string().min(6),
  //   }),
  // });
  // const usernamevalidation = z
  //   .string()
  //   .min(2, "username must be atleast 2 characters")
  //   .max(20, "uername must be atmost 20 characters")
  //   .regex(
  //     /^[a-zA-Z0-9_]+$/,
  //     "please write only alphabets ,not alphabets in username"
  //   );
  // //ato z or A-Z or 0-9 or _ insab se milker hi bana hona chahye username

  // const signUpSchema = z.object({
  //   username: usernamevalidation, //usernamevalidation ko reuse ker liya yaha per
  //   email: z.string().email({ message: "Invalid email address" }),
  //   password: z.object({
  //     password: z.string().min(6),
  //     confirmPassword: z.string().min(6),
  //   }),
  // });

  const form = useForm<z.infer<typeof signInSchema>>({
    //is form me bas signupschmea type ki values hi aa sakti hai humne set kerdiya z.infer se type
    //sari filed signup schea me hi hai or vaise hi same ype ki value hume sign-in me bhi chhiye to isliye
    //signUpSchema  import kro new value zod se mat bana yaha nahi to zayada kaam lagega aha bhi wahi username,password,emal redine kerna padega same signup schema  zaise
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  // useEffect(() => {
  //   const isCheckingUsername = async () => {
  //     if (!username) {
  //       setUsernameMessage("");
  //       return;
  //     }

  //     try {
  //       const res = await axios.get(
  //         `api/check-username-uniqueness?username=${username}`
  //       );
  //       if (res.status == 200) {
  //         setUsernameMessage(res.data.message);
  //         toast.success("username is avilable");
  //       }
  //     } catch (error) {
  //       console.log("Error in checking unique-username", error);
  //       const axiosError = error as AxiosError<ApiResponse>;
  //       setUsernameMessage(
  //         axiosError.response?.data.message || "Error in checking username"
  //       );
  //       toast.error("Error in Checking username-uniqueness");
  //     } finally {
  //       setIsCheckingUsername(false);
  //     }
  //   };
  //   isCheckingUsername();
  // }, [username]);
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log("data = ",data)
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log("result = ", result);
    if (result?.error) {
      toast.error("Incorrent email password");
    } else {
      toast.success("Successfull login", {
        icon: <CircleCheckIcon className="size-4" />,
      });
      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000);
    }
  };
  return (
    <div className="flex justify-center  items-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-1 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to star your anonyms adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email or Username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Signin"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member?{` `}
            <a href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </a>
            {/* <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              SignUp
            </Link> */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
