import { messagesRouter } from "@/modules/messages/server/procedures";
import { createTRPCRouter } from "../init";

// this is like a file that manages all the routers in the app
// it is the main entry point for the tRPC API
// it combines all the routers into a single router
// and exports it as the app's API

export const appRouter = createTRPCRouter({
  messages: messagesRouter
})

// export type definition of API
export type AppRouter = typeof appRouter;
