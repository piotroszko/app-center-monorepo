import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { trpcServer } from "@repo/trpc/clients/server";
import { isNil } from "lodash";

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

  const parsedToken = await trpcServer.auth.checkToken(
    (tokenCookie as string) || (tokenHeader as string),
  );

  if (!isPublicRoute && !parsedToken?.id) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
