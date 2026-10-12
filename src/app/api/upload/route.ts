import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine file extension
    const originalName = file.name || "upload.jpg";
    const rawExt = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpeg", "jpg", "png", "webp"].includes(rawExt) ? rawExt : "jpg";

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type) && !["jpg", "jpeg", "png", "webp"].includes(rawExt)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 5MB limit.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique safe filename
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

    // Store in /public/uploads/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "packages");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    const publicUrl = `/uploads/packages/${fileName}`;
    return NextResponse.json({ url: publicUrl, success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload processing failed" },
      { status: 500 }
    );
  }
}
