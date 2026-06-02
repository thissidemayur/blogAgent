import {Agent,run} from "@openai/agents"
import {z} from "zod"
import { ThinkerOutput } from "./thinker_agent";
import { PlannerOutput} from "./planner_agent";
import { EditorOutput } from "./editor_agent";

const criticsScoreSchema = z.object({
    relevance_to_breif: z.number().min(1).max(10),
    readability:z.number().min(1).max(10),
    accuracy:z.number().min(1).max(10),
    accurcy:z.number().min(1).max(10),
    uniquness:z.number().min(1).max(10),
    overall:z.number().min(1).max(10)
})
export const CriticOuputSchema = z.object({
  scores: criticsScoreSchema,
  passed: z.boolean().describe("True if overall score >=7"),
  feedback: z.string().describe("specific actionable feedback"),
  send_back_to: z
    .enum(["Planner", "Writer", "Editor"])
    .describe("Which agent to send back to if failed"),
  issues: z.array(z.string()),
});
export type CriticOutput = z.infer<typeof CriticOuputSchema>;



export const criticAgent = new Agent({
  name: "Critic",
  model: "gpt-5.4-nano-2026-03-17",
  instructions: `You are a harsh but fair content QA reviewer.

Score blog posts on 4 dimensions (1-10 each):
1. relevance_to_brief — Does it match the original goal and audience?
2. readability — Is it easy and engaging to read?
3. accuracy — Are facts used correctly?
4. uniqueness — Is there a fresh angle or is it generic?

overall = average of all 4.
passed = true if overall >= 7.0

If it fails, decide which agent to return to:
- "writer" — poor writing quality
- "editor" — needs light polish
- "planner" — wrong structure
- "none" — if passed

Dont return Makdown fences. No explanation.
    `,
  outputType: CriticOuputSchema,
});

export async function runCriticAgent(thinkerOutput:ThinkerOutput,plannerOutput:PlannerOutput,editorOutput:EditorOutput):Promise<CriticOutput>{

    const prompt = `Review this blog post against the original brief.
ORIGINAL BRIEF:
- Goal: ${thinkerOutput.goal}
- Audience: ${thinkerOutput.audience}
- Unique Angle: ${thinkerOutput.unique_angle}
- Tone: ${thinkerOutput.tone};

PLANNED TITLE: ${plannerOutput.title}
PLANNED SECTIONS: ${plannerOutput.sections.map((section)=>section.heading).join(", ")}

FINAL BLOG POST: 
${
    editorOutput.improved_markdown
}

`;

const response = await run(criticAgent,prompt)
const result = response.finalOutput

if(!result) {
    throw new Error(
      "[Writer Agent] returned no output. Check your model or prompt.",
    );
}

return result

}

