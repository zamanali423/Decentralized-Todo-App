const { z } = require("zod");

const registerSchema = z
  .object({
    body: z.object({
      fullName: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password atleast 6 characters long"),
      confirmPassword: z
        .string()
        .min(6, "Confirm Password atleast 6 characters long"),
    }),
  })
  .refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords do not match",
    path: ["body", "confirmPassword"],
  });

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
