import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import prisma from "../../../../lib/prisma";
import { inngest } from "@/inngest/client";

// procedure is a single API in tRPC

export const messagesRouter = createTRPCRouter({
    // This procedure handles the retrieval of messages.
    getMessages: baseProcedure
.query(async () =>{
    const messages = await prisma.message.findMany({
        orderBy: {
            updatedAt: "asc"
        }
    })
    return messages;
}),
    // This procedure handles the creation of a message.
  create: baseProcedure // baseProcedure  Defines a callable API endpoint with input validation.
    .input(
      z.object({
        value: z.string().min(1, "Message cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });
      await inngest.send({
        name: "elixier/run",
        data: {
          value: input.value,
        },
      });
      return createdMessage;
    }),
});