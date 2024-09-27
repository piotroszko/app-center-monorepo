import { z } from "zod";

import { publicProcedure, router } from "./trpc";
import { authRouter } from "../routers/auth";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return "Hello, world!";
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    console.log("Adding todo", opts.input);
    return true;
  }),
  setDone: publicProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.number(),
      }),
    )
    .mutation(async (opts) => {
      console.log("Setting done", opts.input);
      return true;
    }),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
