"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, updateTag } from "next/cache";

export async function addPackage(data: {
  name: string;
  description: string;
  totalMinutes: number;
  price: number;
  includes: string[];
  imageUrl?: string;
}) {
  try {
    const snap = await adminDb.collection("packages").orderBy("order", "desc").limit(1).get();
    const nextOrder = snap.empty ? 0 : (snap.docs[0].data().order || 0) + 1;

    await adminDb.collection("packages").add({
      name: data.name,
      description: data.description,
      totalMinutes: Number(data.totalMinutes),
      price: Number(data.price),
      currency: "USD",
      includes: data.includes.filter(Boolean),
      imageUrl: data.imageUrl || "",
      active: true,
      order: nextOrder,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    try { updateTag("packages"); } catch { /* ignore if called outside action */ }
    revalidatePath("/packages");
    revalidatePath("/admin/packages");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePackage(id: string, data: any) {
  try {
    await adminDb.collection("packages").doc(id).update({
      ...data,
      totalMinutes: Number(data.totalMinutes),
      price: Number(data.price),
      includes: data.includes.filter(Boolean),
      updatedAt: FieldValue.serverTimestamp(),
    });

    try { updateTag("packages"); } catch { /* ignore if called outside action */ }
    revalidatePath("/packages");
    revalidatePath("/admin/packages");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePackage(id: string) {
  try {
    await adminDb.collection("packages").doc(id).delete();

    try { updateTag("packages"); } catch { /* ignore if called outside action */ }
    revalidatePath("/packages");
    revalidatePath("/admin/packages");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
