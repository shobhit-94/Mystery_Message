import * as z from "zod";
export const usernamevalidation = z
  .string()
  .min(2, "usernmae must be atleast 2 characters");
z.string().max(20, "usernmae must be atmost 20 characters");
z.string()
  .min(2)
  .max(20)
  .regex(/^[A-Za-z0-9_-]+$/);
/*
Allows: lowercase/uppercase letters, digits, underscore, hyphen.
Length: 2–20 characters.
Error messages: clear and corrected
*/

export const signUpSchema = z.object({
  usernamme: usernamevalidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .object({
      password: z
        .string()
        .min(6, "password must be at least 6 chatracters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"], // path of error
    }),
});
