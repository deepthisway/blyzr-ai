import { authedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";

// procedure is a single API in tRPC

export const projectsRouter = createTRPCRouter({
  getOne: authedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Project ID is required to fetch a project"),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId!,
        },
      });
      return existingProject;
    }),
    
  getProjects: authedProcedure.query(async ({ctx}) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId!,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return projects;
  }),

  // This procedure handles the creation of a project.
  create: authedProcedure 
    .input(
      z.object({
        value: z.string().min(1, "Message cannot be empty"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId!,
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              userId: ctx.auth.userId!,
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
          userId: ctx.auth.userId!,
        },
      });

      return createProject;
    }),
});
