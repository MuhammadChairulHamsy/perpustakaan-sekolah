import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, {message: "Email wajib diisi"})
    .email("Format email tidak valid"),
  password: z.string().min(1, {message: "Password wajib diisi"})
});
