import {z} from "zod"

const envSchema = z.object({
  TAVILY_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env)
if(!_env.success) {
    console.error(`[ENV_ERROR]: missing env variable`)
    console.error(_env.error.message)
    process.exit(1)
}

export const env = _env.data
