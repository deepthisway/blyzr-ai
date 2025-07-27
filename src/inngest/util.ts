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
  const assistantMessages = result.output.filter(
    (message) => message.role === "assistant"
  );
  
  if (assistantMessages.length === 0) {
    return undefined;
  }
  
  const message = assistantMessages[assistantMessages.length - 1] as TextMessage;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}