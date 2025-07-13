import {
  createAgent,
} from "@inngest/agent-kit";
import { gemini } from "inngest";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const writer = createAgent({
      name: "writer",
      system:
        "You are an expert writer.  You write readable, concise, simple content.",
      model: gemini({ model: "gemini-2.5-flash" }),
    });
  }
);
