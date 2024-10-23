import { prisma } from "@repo/db";
import { z } from "zod";
import { omit } from "lodash";
import { publicProcedure, router } from "../../server/trpc";

export const userRouter = router({
  getUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const data = await prisma.user.findFirst({
        where: {
          id: opts.input.userId,
        },
      });
      return { ...omit(data, ["password", "isDeleted", "updatedAt"]) };
    }),
});
