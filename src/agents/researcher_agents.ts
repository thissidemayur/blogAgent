import { websearchTool } from "@/tools/webSearch_tool";
import { Agent, run } from "@openai/agents";
import { z } from "zod";
import {  ThinkerOutput } from "./thinker_agent";

export const researcherOutputSchema = z.object({
    key_facts: z.array(z.object({
    fact: z.string().describe("key fact"),
    source: z.string().describe("site or url name of provided facts"),
  })).describe("key facts with source urls"),

    statistics:z.array(z.string()).describe("provide statitcs with context"),
    real_examples:z.array(z.string()).describe("Real word example"),
    angles_to_cover:z.array(z.string()).describe("e.x: angel 1 , angle 2"),
    sources:z.array(z.string()).describe("[ URL1 , url2]")
})

export type ResearcherOutput = z.infer<typeof researcherOutputSchema>


export const researcherAgent = new Agent({
  name: "Researcher",
  model: "gpt-5.4-nano-2026-03-17",
  instructions: `You are a thorough research analyst.

Given a content strategy brief, use the web_search tool to find:
- Real, current facts and data about the topic
- Relevant statistics with sources
- Real-world examples and case studies
- Key angles and sub-topics to cover

Run multiple searches (at least 3) to cover different aspects.
Always note your sources.
Be factual — never invent statistics or examples.


  `,
  outputType:researcherOutputSchema,
  tools: [
    websearchTool
  ]
});


export async function runResearcherAgent (thinkerOutput:ThinkerOutput,topic:string){
  const result = await run(researcherAgent,
     `Research this topic for a blog post.

ORIGINAL TOPIC: ${topic}

CONTENT STRATEGY BRIEF:
- Audience: ${thinkerOutput.audience}
- Goal: ${thinkerOutput.goal}
- Unique Angle: ${thinkerOutput.unique_angle}
- Key Questions to Answer: ${thinkerOutput.key_questions.join(", ")}
- Tone: ${thinkerOutput.tone}

Use web_search  tool to find facts, statistics, real examples, and current information.
    
  `)

  if(!result.finalOutput) {
    throw new Error(
      `[Researcher Agent] returned no output. check your model or prompt.`,
    );
  }

  return result.finalOutput
}

