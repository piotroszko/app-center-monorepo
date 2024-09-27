import { User } from "@prisma/client";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export const createToken = async (user: User, secretKey: string) => {
  if (!secretKey) {
    return null;
  }
  return sign({ id: user.id }, secretKey, {
    expiresIn: "30d",
    algorithm: "RS256",
  });
};

export const checkToken = async (token: string, publicKey: string) => {
  if (!publicKey) {
    return null;
  }
  return verify(token, publicKey, { algorithms: ["RS256"] }) as JwtPayload & {
    id: string;
  };
};
