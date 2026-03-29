import { Agent,run } from "@openai/agents"
import {z} from "zod"


export const ThinkerOutputSchema = z.object({
  audience: z.string().describe("Who is the target reader?"),
  goal: z.string().describe("What should the blog achieve?"),
  key_questions: z.array(z.string()).describe("Questions the reader will have"),
  unique_angle: z.string().describe("What makes this blog different?"),
  tone: z.string().describe("Writing tone e.g. conversational, technical"),
  estimated_length: z.number().describe("e.g. 1500 words"),
  topics_to_avoid: z.array(z.string()).describe("Things to not cover"),
});

export type ThinkerOutput = z.infer<typeof ThinkerOutputSchema>


export const thinkerAgent = new Agent({
  name: "Thinker",
  model: "gpt-5.4-nano-2026-03-17",
  instructions:`You are a senior content strategist having 20+ years of experience.
  
  your job is to deeply analayse a blog topic BEFORE any writings begins.
  Think strategy about:
  - Who will read this and why
  - what unique angle make this blog stand out
  - what key questions must be answered
  - What tone and length is appripate 
  what to avoid 

  You dont  write any content. you only produce strategic brief
  Be specific and actionable
  
  `,
  outputType: ThinkerOutputSchema
});


export async function runThinkerAgent(topic:string) {
    const result = await run(thinkerAgent,topic);
    if(!result.finalOutput) {
        throw new Error("[Thinker Agent] returned no output. check your model or prompt. ")
    }

    return result.finalOutput;
}

await runThinkerAgent(`let make a blog on Docker Model Runner.`)


