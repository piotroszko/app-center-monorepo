import { prisma } from "@repo/db";
import { z } from "zod";
import { hash } from "bcryptjs";
import { isNil, omit } from "lodash";
import { publicProcedure, router } from "../../server/trpc";
import { createToken } from "../../libs/jwt";
import { getJwtSecret } from "../../libs/env";
import { TRPCError } from "@trpc/server";

const secretHash = "$2a$10$fJnYjccrjmw47juTG7680u";

export const authRouter = router({
  isAnyUser: publicProcedure.query(async () => {
    const data = await prisma.user.findMany();
    return data.length > 0;
  }),
  login: publicProcedure
    .input(
      z.object({
        login: z
          .string()
          .min(5, {
            message: "Login must be at least 5 characters long",
          })
          .max(50, {
            message: "Login must be at most 50 characters long",
          }),
        password: z
          .string()
          .min(5, {
            message: "Password must be at least 5 characters long",
          })
          .max(50, {
            message: "Password must be at most 50 characters long",
          }),
      }),
    )
    .mutation(async (opts) => {
      const data = await prisma.user.findFirst({
        where: {
          OR: [
            {
              name: opts.input.login,
            },
            {
              email: opts.input.login,
            },
          ],
        },
      });
      const hashPassword = await hash(opts.input.password, secretHash);
      const isPasswordCorrect = hashPassword === data?.password;
      const secret = getJwtSecret();

      if (data && isPasswordCorrect && secret) {
        return createToken(data, secret);
      }
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid login or password",
      });
    }),
  register: publicProcedure
    .input(
      z
        .object({
          login: z
            .string()
            .min(5, {
              message: "Login must be at least 5 characters long",
            })
            .max(50, {
              message: "Login must be at most 50 characters long",
            }),
          password: z
            .string()
            .min(5, {
              message: "Password must be at least 5 characters long",
            })
            .max(50, {
              message: "Password must be at most 50 characters long",
            }),
          repeatPassword: z
            .string()
            .min(5, {
              message: "Password must be at least 5 characters long",
            })
            .max(50, {
              message: "Password must be at most 50 characters long",
            }),
          email: z
            .string()
            .email()
            .min(5, {
              message: "Email must be at least 5 characters long",
            })
            .max(50, {
              message: "Email must be at most 50 characters long",
            }),
        })
        .refine((data) => data.password === data.repeatPassword, {
          message: "Passwords do not match",
          path: ["repeatPassword"],
        }),
    )
    .mutation(async (opts) => {
      const hashedPassword = await hash(opts.input.password, secretHash);

      const user = await prisma.user.create({
        data: {
          name: opts.input.login,
          email: opts.input.email,
          password: hashedPassword,
        },
      });
      const secret = getJwtSecret();

      if (isNil(secret)) {
        return { ...omit(user, "password") };
      }

      return { ...omit(user, "password"), token: createToken(user, secret) };
    }),
});
