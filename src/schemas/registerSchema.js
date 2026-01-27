import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(3, { message: "Minimal 3 karakter" }),
    email: z.string().email({
      pattern: z.regexes.email,
      message: "Format email tidak valid",
    }),
    password: z
      .string()
      .min(8, { message: "Miniamal 8 karakter" })
      .regex(/[A-Z]/, {
        message: "Harus ada 1 huruf besar",
      })
      .regex(/[0-9]/, "Harus ada 1 angka"),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password tidak cocok",
        path: ["confirmPassword"],
      });
    }
  });
