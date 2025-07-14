import { createAgent, createTool } from "@inngest/agent-kit";
import { gemini } from "inngest";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./util";
import { stderr, stdout } from "process";
import z from "zod";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("blyzer-nextjs-dev");
      return sandbox.sandboxId;
    });

    const writer = createAgent({
      name: "writer",
      system:
        "You are an expert writer. You write readable, concise, simple content.",
      model: gemini({ model: "gemini-2.5-flash" }),
      tools:[
        createTool({
          // This tools block gives the writer agent the ability to run shell commands securely using a sandbox
          name: "terminal",
          description: "Execute commands in the terminal.", // This tells the agent what the tool does, helping it decide when to use it
          parameters: z.object({   //the input shape the tool expects eg. "ls -l"
            command: z.string()
          }) as any,
          handler: async ({command}, {step}) => { // core function that runs when the agent uses the tool
            // step and command are coming from two diffent objs, hence seperated destructuring
            return await step?.run("terminal", async()=>{
              const buffers = {stdout: "", stderr: ""};

              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;     // Collects stdout and stderr outputs
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  }
                });
                return result.stdout
              } catch (e) {
                  console.error(
                    `Command Failed: ${e} \n stderr: ${buffers.stderr} \n stdout: ${buffers.stdout}`
                  );
                  return `Command Failed: ${e} \n stderr: ${buffers.stderr} \n stdout: ${buffers.stdout}`
              }
            })
          }
        })
      ]
    });

    const summary = await writer.run(
      "Write a one-liner summary of what E2B sandboxes are."
    );
    
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    })

    return {
      sandboxId,
      summary,
    };
  }
);
