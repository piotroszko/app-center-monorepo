import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isNil } from "lodash";
import { checkToken } from "@repo/trpc/libs/jwt";
import { getPublicKey } from "@repo/trpc/libs/env";

const publicRoutes = ["/auth/login", "/auth/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const tokenCookie = cookies().get("Authorization")?.value;
  const tokenHeader = req.headers.get("Authorization");
  if (isNil(tokenCookie) && isNil(tokenHeader) && isPublicRoute) {
    return NextResponse.next();
  } else if (isNil(tokenCookie) && isNil(tokenHeader) && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  const token = getPublicKey();
  if (isNil(token)) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  const parsedToken = await checkToken(
    (tokenCookie as string) || (tokenHeader as string),
    token,
  );

  if (!isPublicRoute && !parsedToken?.id) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
