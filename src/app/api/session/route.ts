import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

// Create session cookie
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const adminAuth = await getAdminAuth();
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true }, { status: 200 });

    // Must be named __session for Firebase Hosting compatibility
    response.cookies.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Clear session cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.delete("__session");
  return response;
}
