/**
 * Utility functions for Treatment and Package pricing and discounts.
 */

export interface PriceDetails {
  regularPrice: number;
  discountPrice?: number;
  hasDiscount: boolean;
  savings: number;
  discountPercent: number;
  finalPrice: number;
}

/**
 * Calculates effective price, savings, and discount percentages.
 * 
 * Rules:
 * - If discountPrice is provided and > 0 and < regularPrice, it is used.
 * - Else if discountPercent is provided (1..99), discount is computed from percent.
 * - Otherwise, hasDiscount = false and finalPrice = regularPrice.
 */
export function calculateItemPrice(
  regularPrice: number,
  discountPrice?: number | null,
  discountPercent?: number | null
): PriceDetails {
  const reg = Number(regularPrice) || 0;
  const discP =
    discountPrice !== undefined && discountPrice !== null && !isNaN(Number(discountPrice))
      ? Number(discountPrice)
      : null;
  const discPct =
    discountPercent !== undefined && discountPercent !== null && !isNaN(Number(discountPercent))
      ? Number(discountPercent)
      : null;

  let finalPrice = reg;
  let hasDiscount = false;

  if (discP !== null && discP > 0 && discP < reg) {
    finalPrice = discP;
    hasDiscount = true;
  } else if (discPct !== null && discPct > 0 && discPct < 100) {
    finalPrice = Math.round(reg * (1 - discPct / 100));
    hasDiscount = true;
  }

  const savings = hasDiscount ? Math.max(0, reg - finalPrice) : 0;
  const computedPercent =
    hasDiscount && reg > 0 ? Math.round((savings / reg) * 100) : 0;

  return {
    regularPrice: reg,
    discountPrice: hasDiscount ? finalPrice : undefined,
    hasDiscount,
    savings,
    discountPercent: computedPercent,
    finalPrice,
  };
}

/**
 * Helper for treatment duration options:
 * { minutes: number, price: number, discountPrice?: number }
 */
export function calculateDurationPrice(
  option: { minutes: number; price: number; discountPrice?: number | null },
  treatmentDiscountPercent?: number | null
): PriceDetails {
  return calculateItemPrice(
    option.price,
    option.discountPrice,
    treatmentDiscountPercent
  );
}
