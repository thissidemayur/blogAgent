import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { ThinkerOutput } from "./thinker_agent";
import { ResearcherOutput } from "./researcher_agents";

export const SectionPlanSchema = z.object({
  heading: z.string(),
  points_to_cover: z.array(z.string()),
  research_to_use: z.array(z.string()),
  word_count_target: z.number(),
});

export const plannerOutputSchema = z.object({
  title: z.string(),
  meta_description: z.string(),
  slug: z.string(),
  sections: z.array(SectionPlanSchema),
  cta: z.string().describe("Call to action at the end"),
  estimated_total_words: z.number(),
});
export type PlannerOutput = z.infer<typeof plannerOutputSchema>;

export const plannerAgent = new Agent({
  name: "Planner",
  model: "gpt-5.4-nano-2026-03-17",
  instructions: `You are a master content architect.
  
Create a DETAILED blog outline — this is the blueprint the writer will strictly follow.

For each section, specify:
- The exact heading
- Every point to cover
- Which research facts to include (quote them)
- Word count target

The outline must flow logically, build on previous sections,
and guide the reader to the CTA naturally.

  `,
  outputType: plannerOutputSchema,
});

export async function runPlannerAgent(
  topic: string,
  thinkerOutput: ThinkerOutput,
  researcherOutput: ResearcherOutput,
): Promise<PlannerOutput> {
  const response = await run(
    plannerAgent,
    `Create a detailed blog outline.

TOPIC: ${topic}

STRATEGY BRIEF:
${JSON.stringify(thinkerOutput, null, 2)}

RESEARCH DATA:
${JSON.stringify(researcherOutput, null, 2)}`,
  );

  const result = response.finalOutput;
  if (!result) {
    throw new Error(
      `[Researcher Agent] returned no output. check your model or prompt.`,
    );
  }

  return result;
}
