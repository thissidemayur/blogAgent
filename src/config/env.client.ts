import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
});

const _env = clientEnvSchema.safeParse({
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});


if (!_env.success) {
  console.error(" Invalid client environment variables:");
  console.error(_env.error.message);
  throw new Error("Invalid client env");
}

export const clientEnv = _env.data;
