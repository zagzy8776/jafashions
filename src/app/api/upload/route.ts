import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { cloudinaryReady, uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  if (cloudinaryReady()) {
    const buf = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buf, file.name || `ja-${Date.now()}`);
    return NextResponse.json({ url });
  }

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (cloud && preset) {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", preset);
    body.append("folder", "jafashions");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body,
    });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      return NextResponse.json({ error: data.error?.message || "Cloudinary unsigned upload failed" }, { status: 400 });
    }
    return NextResponse.json({ url: data.secure_url });
  }

  return NextResponse.json({
    error: "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (or an unsigned CLOUDINARY_UPLOAD_PRESET).",
  }, { status: 500 });
}
