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
import { Input } from "@/components/ui/input";
import { Link, Loader2 } from "lucide-react";

const page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //usehook.ts ko install kro site se or docs pado
  // const [debouncedValue, setValue] = useDebounceValue(username, 500)
  //Toast is depreacted install sooner
  const debounced = useDebounceCallback(setUsername, 500);
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

  const form = useForm<z.infer<typeof signUpSchema>>({
    //is form me bas signupschmea type ki values hi aa sakti hai humne set kerdiya z.infer se type
    //sari filed signup schea me hi hai or vaise hi same ype ki value hume sign-in me bhi chhiye to isliye
    //signUpSchema  import kro new value zod se mat bana yaha nahi to zayada kaam lagega aha bhi wahi username,password,emal redine kerna padega same signup schema  zaise
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: { password: "", confirmPassword: "" },
    },
  });
  useEffect(() => {
    const isCheckingUsername = async () => {
      if (!username) {
        setUsernameMessage("");
        return;
      }

      try {
        const res = await axios.get(
          `api/check-username-uniqueness?username=${username}`
        );
        if (res.status == 200) {
          setUsernameMessage(res.data.message);
          toast.success("username is avilable");
        }
      } catch (error) {
        console.log("Error in checking unique-username", error);
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message || "Error in checking username"
        );
        toast.error("Error in Checking username-uniqueness");
      } finally {
        setIsCheckingUsername(false);
      }
    };
    isCheckingUsername();
  }, [username]);
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password.password, // ✅ extract real password
      };
      await axios.post<ApiResponse>(`/api/sign-up`, payload);
      toast.success(`response.data.message`);
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("Error in signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message || "Error in Sign-up"
      );
      toast.error("Error in sign-up");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to star your anonyms adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field} //hum konsa field use ker re hai for ex yaha per username hai to "username" uper likho name="username"
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${usernameMessage === "Usernamee is available" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
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
              name="password.password"
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

            <FormField
              control={form.control}
              name="password.confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>confirmPassword</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Retype password"
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
                "SignUp"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{``}
            <a href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
