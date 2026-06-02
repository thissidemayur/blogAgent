import { Agent ,run} from "@openai/agents";
import {z} from "zod"
import { ThinkerOutput } from "./thinker_agent";
import { WriterOutput } from "./writer_agent";


export const editorOutputSchema = z.object({
  improved_markdown: z
    .string()
    .describe("The fully polished blog post in markdow."),
  changes_made: z
    .array(z.string())
    .describe("List of specific edits made — e.g. 'Strengthened intro hook'"),
 word_count:z.number().describe("Word count after editing ")
});

export type EditorOutput = z.infer<typeof editorOutputSchema>


export const editorAgent = new Agent({
  name: "Editor",
  model: "gpt-5.4-nano-2026-03-17",
  instructions: `You are a proffesional blog editor.
  
  You receive a raw draft and polish it into FINAL version the user will read.

- Opening hook — make it grab attention in the first 2 sentences
- Closing conclusion — make it memorable and strong
- Transitions between sections — should flow naturally, not feel abrupt  
- Clarity — rewrite any sentence that is awkward or unclear
- Tone consistency — match the defined tone throughout entire post
- Remove repetition — if a point is made twice, keep the better version
- Tighten sentences — remove filler words like "basically", "essentially", "very"
- Markdown formatting — ensure headings, bold, and lists are used well 


WHAT YOU NEVER TOUCH:
- Facts, statistics, or data — do not change any numbers or claims
- Section structure — do not add, remove, or reorder sections
- The core message of any section

WORD COUNT RULE:
Final word count should be within 15% of the original draft.
Do not delete entire paragraphs — only tighten sentences.

List every specific change you made in changes_made array.
  `,
  outputType:editorOutputSchema
});

export async function* streamEditorAgent(
  thinkerOutput: ThinkerOutput,
  writerOutput: WriterOutput,
): AsyncGenerator <string>{
    const prompt = `Polish this raw blog draft into the final version.
REQUIRED TONE     : ${thinkerOutput.tone}
TARGET AUDIENCE   : ${thinkerOutput.audience}
GOAL OF BLOG      : ${thinkerOutput.goal}
ESTIMATED_LENGTH  :${thinkerOutput.estimated_length}

━━━ RAW DRAFT TO EDIT ━━━
${writerOutput.full_markdown}

Return the improved_markdown as the full polished blog.
List every change you made in changes_made.

`;

    const response =await run(editorAgent,prompt,{
        stream:true
    })

    const agentStream = response.toTextStream()

    let emittedContent = false
    for await (const value of agentStream) {
        if(value.trim().length > 0) {
          emittedContent = true
        }
        yield value
    }

    if(!emittedContent) {
      console.error("[Editor Agent] stream completed without content.", {
        writerWordCount: writerOutput.word_count,
        writerMarkdownLength: writerOutput.full_markdown?.length ?? 0,
      });
    }
}

// non streaming version
export async function runEditorAgent(thinkerOutput:ThinkerOutput,writerOutput:WriterOutput):Promise<EditorOutput> {
    const prompt = `Polish this raw blog draft into the final version.
REQUIRED TONE     : ${thinkerOutput.tone}
TARGET AUDIENCE   : ${thinkerOutput.audience}
GOAL OF BLOG      : ${thinkerOutput.goal}
ESTIMATED_LENGTH  :${thinkerOutput.estimated_length}

━━━ RAW DRAFT TO EDIT ━━━
${writerOutput.full_markdown}

Return the improved_markdown as the full polished blog.
List every change you made in changes_made.

`;
  const result = await run(editorAgent, prompt);

  if (!result.finalOutput) {
    throw new Error(
      "[Editor Agent] returned no output. Check your model or prompt.",
    );
  }

  return result.finalOutput;

}
