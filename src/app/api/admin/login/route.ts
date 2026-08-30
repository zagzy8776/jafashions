import { NextResponse } from "next/server";
import { checkPassword, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!checkPassword(String(password || ""))) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
