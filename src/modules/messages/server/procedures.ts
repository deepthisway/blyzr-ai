import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import prisma from "../../../../lib/prisma";
import { inngest } from "@/inngest/client";

// procedure is a single API in tRPC

export const messagesRouter = createTRPCRouter({
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
        name: "test/hello.world",
        data: {
          value: input.value,
        },
      });
      return createdMessage;
    }),
});