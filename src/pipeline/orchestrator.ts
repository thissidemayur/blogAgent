
import { runThinkerAgent } from "@/agents/thinker_agent";
import {
  runResearcherAgent,
} from "@/agents/researcher_agents";
import { runPlannerAgent } from "@/agents/planner_agent";
import { runWriterAgent } from "@/agents/writer_agent";
import {  streamEditorAgent } from "@/agents/editor_agent";
import { runCriticAgent } from "@/agents/critics_agent";
import { emitter } from "@/lib/emitter";


export async function runPipeline(runId:string,topic:string){

    try {
        // thinker agent
        emitter.agentStart(runId,"thinker")
        const thinkerResult = await runThinkerAgent(topic);
        emitter.agentDone(runId,"thinker",thinkerResult)
    
        // researcher agent
        emitter.agentStart(runId,"researcher")
        const researcherResult = await runResearcherAgent(thinkerResult, topic);
        emitter.agentDone(runId,"researcher",researcherResult)
    
        // planner agent
        emitter.agentStart(runId,"planner")
        const plannerResult =  await runPlannerAgent(topic,thinkerResult,researcherResult)
        emitter.agentDone(runId,"planner",plannerResult)
    
        // writer agent
        emitter.agentStart(runId, "writer");
        const writerResult =  await runWriterAgent(topic,thinkerResult,researcherResult,plannerResult)
        if (!writerResult.full_markdown?.trim()) {
            console.error(`[Pipeline ${runId}] writer produced empty content`, {
                topic,
                writerResult,
            });
            throw new Error("Writer generated empty content. Please try a more specific topic.");
        }
        console.info(`[Pipeline ${runId}] passing writer output to editor`, {
            topic,
            markdownLength: writerResult.full_markdown.length,
            wordCount: writerResult.word_count,
            sectionsWritten: writerResult.sections_written,
        });
        emitter.agentDone(runId, "writer", {word_count:writerResult.word_count,headings:writerResult.sections_written});
    
        // editor agent
        emitter.agentStart(runId, "editor");
        let fullBlog=""
        for await (const chunk of streamEditorAgent(thinkerResult,writerResult)){
            fullBlog +=chunk
            emitter.textChunk(runId,chunk) //each words -> broswer instantly
        }
        if (!fullBlog.trim()) {
            console.error(`[Pipeline ${runId}] editor produced empty content`, {
                topic,
                writerResult,
            });
            throw new Error("Editor generated empty content. Please try again.");
        }
        emitter.agentDone(runId, "editor", {word_count:fullBlog.split(" ").length});
    
        // critic agent 
        emitter.agentStart(runId, "critic");
        const critcResult = await runCriticAgent(thinkerResult,plannerResult,{
            improved_markdown:fullBlog,
            changes_made:[],
            word_count:fullBlog.split(" ").length
        })
        emitter.agentDone(runId, "critic", critcResult);
        emitter.done(runId,fullBlog)
    } catch (error) {
        const message = error instanceof Error ? error?.message : "[Unknown Error]"
        console.error("[ORCHESTRATION ERROR]: ",message)
        emitter.error(runId,message)
        throw error
    }
}
