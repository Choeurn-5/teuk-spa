import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Set session expiration to 30 days
  const expiresIn = 60 * 60 * 24 * 30;
  const response = NextResponse.redirect(new URL("/admin", request.url));

  response.cookies.set("__session", "admin_direct_session_" + Date.now(), {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}
