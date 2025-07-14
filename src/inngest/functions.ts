import { createAgent } from "@inngest/agent-kit";
import { gemini } from "inngest";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./util";

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
    });

    const summary = await writer.run(
      "Write a one-liner summary of what E2B sandboxes are."
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = await sandbox.getHost(3000);
      return `http://${host}`;
    })

    return {
      sandboxId,
      summary,
    };
  }
);
