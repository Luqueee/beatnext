import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await auth();

  //console.log("Session: ", session, request.nextUrl.pathname);

  if (!session) {
    return NextResponse.redirect(new URL("/profile/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source: "/profile",
      //regexp: "^/profile/(.*)",
      // locale: false,
      // has: [
      //   { type: "header", key: "Authorization", value: "Bearer Token" },
      //   { type: "query", key: "userId", value: "123" },
      // ],
      // missing: [{ type: "cookie", key: "session", value: "active" }],
    },
    {
      source: "/api/profile/:path*",
    },
  ],
};
