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
  getUsers: publicProcedure
    .input(
      z.object({
        nameFragment: z.string(),
        page: z.number().default(0),
      }),
    )
    .query(async (opts) => {
      const data = await prisma.user.findMany({
        where: {
          name: {
            contains: opts.input.nameFragment,
          },
        },
        take: 10,
        skip: opts.input.page * 10,
      });
      // delete password, isDeleted, updatedAt, createdAt from response
      return data.map((user) =>
        omit(user, ["password", "isDeleted", "updatedAt", "createdAt"]),
      );
    }),
});
