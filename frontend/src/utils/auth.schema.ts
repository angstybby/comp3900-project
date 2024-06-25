import { z } from "zod";
import { validateName, validateZid, validatePassword } from "./auth.check";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required").refine(validateName, {
      message: "Invalid name",
    }),
    zId: z.string().min(1, "zID is required").refine(validateZid, {
      message: "Invalid zID format",
    }),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(validatePassword, {
        message:
          "Password must contain at least one number and one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, "Password confirmation must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Invalid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    verificationCode: z.string().min(6),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(validatePassword, {
        message:
          "Password must contain at least one number and one special character",
      }),
    confirmPassword: z
      .string()
      .min(8, "Password confirmation must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
