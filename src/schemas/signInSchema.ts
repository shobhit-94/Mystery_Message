import { z } from "zod";

export const signInSchema = z.object({
  // signin kerne ke liye hum username or password hi le re hai
  identifier: z.string(), //username ya email  ko identifier bhi bol sakte hai
  password: z.string(),
});
