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
        take: 51, // 50 + 1 to check if there are more pages
        skip: opts.input.page * 50,
        orderBy: {
          name: "asc",
        },
      });
      const users = data.map((user) =>
        omit(user, ["password", "isDeleted", "updatedAt", "createdAt"]),
      );
      if (users.length > 50) {
        users.pop();
        return {
          users,
          isLastPage: false,
        };
      }
      return {
        users,
        isLastPage: true,
      };
    }),
});
