"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

export async function updateTreatment(id: string, data: any) {
  try {
    await adminDb.collection("treatments").doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating treatment:", error);
    return { success: false, error: "Failed to update treatment" };
  }
}

export async function updateSiteSettings(data: any) {
  try {
    await adminDb.collection("siteSettings").doc("main").set(
      { ...data, updatedAt: new Date() },
      { merge: true }
    );
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating site settings:", error);
    return { success: false, error: "Failed to update site settings" };
  }
}
