import { NextRequest, NextResponse } from "next/server";
import { getAdminStorage } from "@/lib/firebase/admin";
import sharp from "sharp";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine and validate file extension
    const originalName = file.name || "upload.jpg";
    const rawExt = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const allowedExts = ["jpeg", "jpg", "png", "webp"];
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedMimes.includes(file.type) && !allowedExts.includes(rawExt)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 8MB limit.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Optimize image with sharp: resize if too large, convert to webp
    const optimizedBuffer = await sharp(rawBuffer)
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    // 1. Primary: Try Firebase Cloud Storage
    try {
      const storage = await getAdminStorage();
      const bucketName =
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "teukmassageandspa"}.firebasestorage.app`;

      const bucket = storage.bucket(bucketName);
      const [bucketExists] = await bucket.exists();

      if (bucketExists) {
        const downloadToken = crypto.randomUUID();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.webp`;
        const filePath = `uploads/${fileName}`;
        const fileRef = bucket.file(filePath);

        await fileRef.save(optimizedBuffer, {
          contentType: "image/webp",
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: downloadToken,
            },
            cacheControl: "public, max-age=31536000",
          },
        });

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media&token=${downloadToken}`;
        return NextResponse.json({ url: publicUrl, success: true }, { status: 200 });
      } else {
        console.warn(`Firebase Storage bucket "${bucketName}" does not exist yet. Using optimized fallback.`);
      }
    } catch (storageErr: any) {
      console.warn("Firebase Storage upload attempt failed:", storageErr?.message);
    }

    // 2. Resilient Fallback: Compact WebP data URL
    // When Firebase Storage is not yet initialized in the Firebase Console,
    // this ensures the admin user is NEVER blocked from uploading treatment photos!
    const compactBuffer = await sharp(rawBuffer)
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const dataUrl = `data:image/webp;base64,${compactBuffer.toString("base64")}`;
    return NextResponse.json({ url: dataUrl, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload processing failed" },
      { status: 500 }
    );
  }
}
