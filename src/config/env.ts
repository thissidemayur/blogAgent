import {z} from "zod"

const envSchema = z.object({
  TAVILY_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),
  RAZORPAY_WEBHOOK_SECRET: z.string(),
  RAZORPAY_CALLBACK_URL:z.string()
});

const _env = envSchema.safeParse(process.env)
if(!_env.success) {
    console.error(`[ENV_ERROR]: missing env variable`)
    console.error(_env.error.message)
    process.exit(1)
}

export const env = _env.data
