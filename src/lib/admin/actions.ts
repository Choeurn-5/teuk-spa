"use server";

import { adminDb } from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export async function addGalleryPhoto(imageUrl: string, caption: string) {
  try {
    const snap = await adminDb.collection("gallery").orderBy("order", "desc").limit(1).get();
    const nextOrder = snap.empty ? 0 : (snap.docs[0].data().order || 0) + 1;

    await adminDb.collection("gallery").add({
      imageUrl,
      caption,
      active: true,
      order: nextOrder,
      createdAt: FieldValue.serverTimestamp(),
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryPhoto(id: string) {
  try {
    await adminDb.collection("gallery").doc(id).delete();
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addTreatment(data: {
  name: string;
  khmerName?: string;
  category?: string;
  shortDescription: string;
  durationMinutes?: number;
  price?: number;
  discountPercent?: number | null;
  durationOptions?: { minutes: number; price: number; discountPrice?: number | null }[];
  imageUrl?: string;
}) {
  try {
    const snap = await adminDb.collection("treatments").orderBy("order", "desc").limit(1).get();
    const nextOrder = snap.empty ? 0 : (snap.docs[0].data().order || 0) + 1;

    const durationOptions =
      data.durationOptions && data.durationOptions.length > 0
        ? data.durationOptions.map((opt) => ({
            minutes: Number(opt.minutes) || 60,
            price: Number(opt.price) || 0,
            discountPrice:
              opt.discountPrice !== undefined && opt.discountPrice !== null && !isNaN(Number(opt.discountPrice)) && Number(opt.discountPrice) > 0
                ? Number(opt.discountPrice)
                : null,
          }))
        : [{ minutes: data.durationMinutes || 60, price: data.price || 25, discountPrice: null }];

    const discountPercent =
      data.discountPercent !== undefined && data.discountPercent !== null && !isNaN(Number(data.discountPercent)) && Number(data.discountPercent) > 0
        ? Number(data.discountPercent)
        : null;

    await adminDb.collection("treatments").add({
      name: data.name,
      khmerName: data.khmerName || "",
      category: data.category || "Body Therapy",
      shortDescription: data.shortDescription,
      durationOptions,
      discountPercent,
      imageUrl: data.imageUrl || "",
      active: true,
      order: nextOrder,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTreatment(id: string) {
  try {
    await adminDb.collection("treatments").doc(id).delete();
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
