import { authedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import prisma from "../../../../lib/prisma";
import { inngest } from "@/inngest/client";

// procedure is a single API in tRPC

export const messagesRouter = createTRPCRouter({
  // This procedure handles the retrieval of messages.
  getMessages: authedProcedure
    .input(
      z.object({
        projectId: z
          .string()
          .min(1, "Project ID is required to fetch messages"),
      })
    )
    .query(async ({input, ctx}) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: {
            equals: input.projectId,
          },
          userId: ctx.auth.userId!,
        },
        include: {
          fragment: true
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      return messages;
    }),
  // This procedure handles the creation of a message.
  create: authedProcedure // baseProcedure  Defines a callable API endpoint with input validation.
    .input(
      z.object({
        value: z
          .string()
          .min(1, "Message cannot be empty")
          .max(10000, "Message cannot exceed 10000 characters"),
        projectId: z.string().min(1, "Project ID is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
          projectId: input.projectId,
          userId: ctx.auth.userId!,
          },
      });
      await inngest.send({
        name: "elixier/run",
        data: {
          value: input.value,
          projectId: input.projectId,
          userId: ctx.auth.userId!,
        },
      });
      return createdMessage;
    }),
});