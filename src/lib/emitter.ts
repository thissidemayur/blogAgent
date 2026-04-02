// bridge b/w orchestrator and SSE connection
// one map entry per active pipline run

const controllers = new Map<
string, //run id
ReadableStreamDefaultController<string> //user's SSE pipe
>()

export const emitter = {
    // broser opened SSE connection-> store their pipe
    register(runId:string, ctrl:ReadableStreamDefaultController<string>) {
        controllers.set(runId,ctrl)
        console.log(`[Emitter] Registere: ${runId}`)
    },

    // Browser disconnected -> remove their pipe
    unregister(runId:string){
        controllers.delete(runId)
        console.log(`[Emitter] Unregistere: ${runId}`);
    },

    // core
    send(runId:string, event:string, data:unknown) {
        const ctrl = controllers.get(runId)
        // if no controller = browser already disconnected
        if(!ctrl) return

        // SSE msg format
        const message = `event:${event}\ndata:${JSON.stringify(data)}\n\n`;
        try {
            ctrl.enqueue(message) // push to browser
        } catch (error) {
            console.error(`[SSE Error]: `,error)
            controllers.delete(runId)
        }
    },

    // helpers
    agentStart(runId:string,agent:string) {
        this.send(runId,"agent_start",{agent,timestamp:Date.now()})
    },
    agentDone(runId:string,agent:string,output?:unknown) {
        this.send(runId,"agent_done",{agent,output,timestamp:Date.now()})
    },
    textChunk(runId:string,chunk:string){
         this.send(runId, "text_chunk", { chunk });
    },
    done(runId:string,blog:string){
        this.send(runId,"done",{blog,timestamp:Date.now()})
    },
    error(runId:string,message:string) {
        this.send(runId,"error_event",{message,timestamp:Date.now()})
    }
}