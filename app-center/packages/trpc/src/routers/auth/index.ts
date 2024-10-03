import { prisma } from "@repo/db";
import { User } from "@prisma/client";
import { z } from "zod";
import { hash } from "argon2";
import { isNil } from "lodash";
import { generateKeyPairSync } from "crypto";
import { publicProcedure, router } from "../../server/trpc";
import { checkToken, createToken } from "../../libs/jwt";

const buf = Buffer.from(
  "secretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecret",
);

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
      const hashedPassword = await hash(opts.input.password, {
        salt: buf,
      });
      if (data && hashedPassword === data.password) {
        return getToken(data);
      }
      return null;
    }),
  // register if there 0 users in the database
  firstRegister: publicProcedure
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
      const data = await prisma.user.findMany();
      if (data.length === 0) {
        const hashedPassword = await hash(opts.input.password, {
          salt: buf,
        });
        const user = await prisma.user.create({
          data: {
            name: opts.input.login,
            email: opts.input.email,
            password: hashedPassword,
          },
        });

        return user;
      }
      return null;
    }),
  checkToken: publicProcedure.input(z.string()).query(async (opts) => {
    const publicKeyName = "publicKey";
    const token = await prisma.settings.findFirst({
      where: {
        key: publicKeyName,
      },
    });
    if (isNil(token)) {
      return false;
    }
    const result = await checkToken(opts.input, token.value);
    if (isNil(result)) {
      return false;
    }
    return result;
  }),
});

const getToken = async (user: User) => {
  const privateKeyName = "privateKey";
  const publicKeyName = "publicKey";

  if (isNil(user)) {
    return null;
  }
  const token = await prisma.settings.findFirst({
    where: {
      key: privateKeyName,
    },
  });
  if (isNil(token)) {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    await prisma.settings.create({
      data: {
        key: privateKeyName,
        value: privateKey,
      },
    });
    await prisma.settings.create({
      data: {
        key: publicKeyName,
        value: publicKey,
      },
    });
    return createToken(user, privateKey);
  }
  return createToken(user, token.value);
};
