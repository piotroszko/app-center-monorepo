import { User } from "@prisma/client";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const createToken = async (user: User, secret: string) => {
  if (!secret) {
    return null;
  }
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("30 days")
    .setIssuer("app-center")
    .setSubject("auth")
    .setAudience("app-center")
    .sign(new TextEncoder().encode(secret));
};

export const checkToken = async (token: string, secret: string) => {
  if (!secret) {
    return null;
  }
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
    algorithms: ["HS256"],
    audience: "app-center",
    issuer: "app-center",
    subject: "auth",
  });

  return payload as JWTPayload & { id: string; name: string; email: string };
};
