export type DiscountThreshold = {
  quantity: number;
  percentage: number;
};

type StoredDiscountMetafield = {
  thresholds?: unknown;
};

function parseThresholdValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  ) {
    return Number(value);
  }

  return null;
}

function parseThresholds(value: unknown): DiscountThreshold[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (threshold): threshold is Record<string, unknown> =>
        typeof threshold === "object" && threshold !== null,
    )
    .map((threshold) => {
      const quantity = parseThresholdValue(threshold.quantity);
      const percentage = parseThresholdValue(threshold.percentage);

      if (quantity === null || percentage === null) {
        return null;
      }

      return {quantity, percentage};
    })
    .filter((threshold): threshold is DiscountThreshold => threshold !== null);
}

export function parseDiscountConfiguration(
  jsonValue: unknown,
): DiscountThreshold[] {
  if (!jsonValue || typeof jsonValue !== "object") {
    return [];
  }

  const parsed = jsonValue as StoredDiscountMetafield;
  return parseThresholds(parsed.thresholds);
}

/** Highest tier whose minimum quantity is met by cart quantity. */
export function resolveDiscountPercentage(
  thresholds: DiscountThreshold[],
  collectionItemQuantity: number,
): number | null {
  if (collectionItemQuantity <= 0 || thresholds.length === 0) {
    return null;
  }

  const applicable = thresholds
    .filter(
      (threshold) =>
        threshold.quantity > 0 &&
        threshold.percentage > 0 &&
        collectionItemQuantity >= threshold.quantity,
    )
    .sort((left, right) => right.quantity - left.quantity);

  return applicable[0]?.percentage ?? null;
}
