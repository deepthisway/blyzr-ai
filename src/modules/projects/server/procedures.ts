import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";

// procedure is a single API in tRPC

export const projectsRouter = createTRPCRouter({
  // This procedure handles the retrieval of messages.
  getProjects: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });
    return projects;
  }),

  // This procedure handles the creation of a message.
  create: baseProcedure // baseProcedure defines a callable API endpoint with input validation.
    .input(
      z.object({
        value: z.string().min(1, "Message cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      const createProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "elixier/run",
        data: {
          value: input.value,
          projectId: createProject.id,
        },
      });

      return createProject;
    }),
});
