import { env } from "@/config/env.server";
import { tvly } from "@/config/tavily";
import { tool, Tool } from "@openai/agents";
import { z } from "zod";
const webSearchParameters = z.object({
  query: z.string().describe("The search query"),
  max_results: z
    .number()
    .optional()
    .default(5)
    .describe("Number od result to return"),
});
export const websearchTool: Tool = tool({
  name: "web_search",
  description:
    "Search the web for current information, facts, statistics, and examples about a topic. Use this to gather research data.",
  parameters: webSearchParameters,

  execute: async ({ query, max_results }) => {
   
    const searchResult = await tavilySearch(query)

    return searchResult
  },
});


async function tavilySearch(query: string) {
   const tavily_api_key = env.TAVILY_API_KEY;
   if (!tavily_api_key) {
     throw new Error("TAVILY_API_KEY not set");
   }
   
  const response = await tvly.search(query);
  const searchResult = response.results?.map((post)=>({
    title:post.title,
    content:post.content,
    url:post.url,
    score:post.score
  }))

  return {
    result: searchResult,
    query,
    answer:response.answer
  };
}

