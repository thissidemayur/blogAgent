import {z} from "zod"
import {Agent, run} from "@openai/agents"
import {ThinkerOutput } from "./thinker_agent";
import { ResearcherOutput } from "./researcher_agents";
import { PlannerOutput } from "./planner_agent";



export const writerOutputSchema = z.object({
    full_markdown:z.string().describe("Complete blog post in markdown"),
    word_count:z.number(),
    sections_written:z.array(z.string()).describe("List of section headings written")
})
export type WriterOutput = z.infer<typeof writerOutputSchema>;

function logEmptyWriterResponse(result: {
  finalOutput?: unknown;
  rawResponses?: unknown;
  state?: unknown;
}) {
  console.error("[Writer Agent] empty or missing full_markdown.", {
    finalOutput: result.finalOutput,
    rawResponses: result.rawResponses,
    state: result.state,
  });
}

// const outputGuardrailAgent = new Agent({
//   name: "Guardrail check",
//   instructions: "Check if the output includes any math.",
//   outputType: writerOutputSchema,
// });
// const outputGuardrail: OutputGuardrail<typeof writerOutputSchema> = new Agent({
//   name: `Guardrail check`,
//   async execute({ agentOutput, context }) {
//     const result = await run(outputGuardrailAgent, agentOutput.response, {
//       context,
//     });
//     return {
//       outputInfo: result.finalOutput,
//       tripwireTriggered: result.finalOutput?.full_markdown ?? false
//     };
//   },
// });


export const writerAgent = new Agent({
  name: "Writer",
  instructions: `You are an expert blog writer.

Your ONLY job is to follow the plan exactly and write the blog post.
STRICT RULES:
- Write EVERY section listed in the plan — do not skip any
- Do NOT add sections that are not in the plan
- Use markdown formatting: ## for main sections, ### for sub-sections
- Use the research facts and statistics provided — do not invent new ones
- Match the tone exactly as defined in the brief
- Do NOT write an intro like "Here is your blog post:" — start directly with the title
- Do NOT leave placeholders like [insert example here] or TODO
- Write each section to its target word count

You produce a 'RAW MARKDOWN DRAFT'. An editor will polish it after you.
  
  `,
  outputType: writerOutputSchema,
});


export async function runWriterAgent(
  topic: string,
  thinkerOutput: ThinkerOutput,
  researcherOutput: ResearcherOutput,
  plannerOutput: PlannerOutput,
  editorFeedback?: string, // passed during retery loop from critic
): Promise<WriterOutput> {
  const prompt = `Write a complete blog post following this exact plan.
  
  TOPIC: ${topic}
  TONE: ${thinkerOutput.tone}
  AUDIENCE: ${thinkerOutput.audience}
  GOAL: ${thinkerOutput.goal}
  Key Questions: ${thinkerOutput.key_questions.join(" | ")}
  Topic to avoid: ${thinkerOutput.topics_to_avoid.join(" | ")}

  ━━━ BLOG PLAN ━━━
  title: ${plannerOutput.title}
  Meta Description: ${plannerOutput.meta_description}
  
  SECTION TO WRITE:
  ${plannerOutput.sections
    .map(
      (section, indx) =>
        `[SECTION ${indx + 1}] ${section.heading}
    Points to cover: ${section.points_to_cover.join(" | ")}
    Research to use: ${section.research_to_use.join(" | ")}
    Target words: ${section.word_count_target}
    `,
    )
    .join("\n")}  

  CTA (end of blog): ${plannerOutput.cta}


  ━━━ RESEARCH DATA ━━━

  Key Facts: ${researcherOutput.key_facts.map((data) => `${data.fact} (${data.source}) `).join(" | ")}
  Statistics: ${researcherOutput.statistics.join(" | ")}
  Real Examples: ${researcherOutput.real_examples.join(" | ")}
  Sources: ${researcherOutput.sources.join(" | ")}

  ${
    editorFeedback
      ? `━━━ APPLY THIS FEEDBACK(fromprevious review)━━━
    ${editorFeedback}
    `
      : ""
  }

  Write the complete blog post in markdown now . Start directly with the title using # heading.`;

  const result = await run(writerAgent, prompt);

  if (!result.finalOutput || !result.finalOutput.full_markdown?.trim()) {
    logEmptyWriterResponse(result);
    throw new Error(
      "[Writer Agent] returned empty blog content. Check the logged API response.",
    );
  }

  return result.finalOutput;
}
