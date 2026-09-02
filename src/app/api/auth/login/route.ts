import { NextResponse } from "next/server";
import { checkPassword, setAdminCookie, signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    if (!checkPassword(String(password))) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    await setAdminCookie();
    const token = signAdminToken();

    return NextResponse.json(
      { ok: true, token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
