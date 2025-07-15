import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

export function lastAssistantTextMessage(result: AgentResult) {
  /*
  To safely retrieve the content of the last message sent by the assistant, 
  in plain string form, whether it's a string or a structured rich message.
  */
  const lastMessage = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastMessage] as TextMessage;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}