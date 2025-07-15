import { createAgent, createNetwork, createTool } from "@inngest/agent-kit";
import { gemini } from "inngest";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessage } from "./util";
import { stderr, stdout } from "process";
import z from "zod";
import { PROMPT } from "@/prompt";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("blyzer-nextjs-dev");
      return sandbox.sandboxId;
    });

    const writer = createAgent({
      name: "coding-agent",
      description: "An expert coding agent that writes code.",
      system: PROMPT,
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
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({ //  each file has a path and content
                path: z.string(),
                content: z.string(),
              })
            ),
          }) as any,
          handler: async ({ files }, { step, network }) => {
            const result = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {}; // used to track file state in memory (like a session store).
                /*
                {
                  "/hello.txt": "Hello World",
                  "/main.js": "console.log('Hi');" is an example of the updatedFiles object
                }
                */
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (error) {
                return `Error updating files: ${error}`;
              }
            });

            if (result && typeof result === "object") {
              network.state.data.files = result;
            }

            return `Files updated.`;
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string())
          }) as any,
          handler: async ({files}, {step})  => {
            return await step?.run("readFiles", async ()=>  {
              try {
                const sandBox =await getSandbox(sandboxId);
                const contents = [];
                for(const file of files)  {
                  const content = await sandBox.files.read(file);
                  contents.push({path: file, content});
                }
                return JSON.stringify(contents);
              } catch (error) {
                return `Error reading files: ${error}`;
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse: async ({result, network})  => {
          const lastAssistantText = lastAssistantTextMessage(result);
          if(lastAssistantText && network)  {
            if(lastAssistantText.includes("<task_summary")) { //  accordiing to the rule given in PROMPT
              network.state.data.summary = lastAssistantText;
            }
          }
          return result;
        }
      }
    });
    const network = createNetwork({
      name: "coding-network",
      description: "A network for coding tasks.",
      agents: [writer],
      maxIter: 10,
      router:  async ({network})=>  {
        const summary = network.state.data.summary;
        if(summary) {
          return;
        }
        return writer; // we return the writer agent to continue processing 
      }
    })

    const message = event.data.value;
    console.log("message is:", message);
    const result = await network.run("Create a page that say hello deeeepsdfg");
    
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    })

    return {
      url: sandboxUrl,
      summary: result.state.data.summary,
      files: result.state.data.files || {},
      title: "Fragment"
    };
  }
);
