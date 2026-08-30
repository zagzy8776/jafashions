import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  cloudinaryReady,
  unsignedReady,
  uploadImage,
} from "@/lib/cloudinary";

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

  if (unsignedReady()) {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body }
    );
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      return NextResponse.json(
        { error: data.error?.message || "Cloudinary unsigned upload failed" },
        { status: 400 }
      );
    }
    return NextResponse.json({ url: data.secure_url });
  }

  if (cloudinaryReady()) {
    const buf = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buf, file.name || `ja-${Date.now()}`);
    return NextResponse.json({ url });
  }

  return NextResponse.json(
    {
      error:
        "Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET for unsigned uploads.",
    },
    { status: 500 }
  );
}
