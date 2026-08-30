import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || "bbke1t9y";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.CLOUDINARY_UPLOAD_PRESET || "Jafashion";

export function unsignedReady() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
}

export function cloudinaryReady() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export async function uploadImage(fileBuffer: Buffer, filename: string) {
  const cld = configureCloudinary();
  const dataUri = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
  const result = await cld.uploader.upload(dataUri, {
    folder: "jafashions",
    public_id: filename.replace(/\.[^.]+$/, "").slice(0, 80),
    resource_type: "image",
    overwrite: false,
    unique_filename: true,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url as string;
}
