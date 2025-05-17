import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    surname: z.string().min(1, { message: "Surname is required" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Must be 6 or more characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Must be 6 or more characters long" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Must be 6 or more characters long" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
