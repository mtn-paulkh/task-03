export const FUNCTION_CONFIGURATION_METAFIELD = {
  namespace: "$app",
  key: "function-configuration",
} as const;

type Metafield = {
  key: string;
  value: string;
};

type StoredDiscountMetafield = {
  collectionIds?: unknown;
  collectionTitle?: unknown;
  thresholds?: unknown;
};

export type DiscountThreshold = {
  quantity: number | null;
  percentage: number | null;
};

export type DiscountMetafield = {
  collectionIds: string[];
  collectionTitle: string;
  thresholds: DiscountThreshold[];
};

const EMPTY_THRESHOLD: DiscountThreshold = {
  quantity: null,
  percentage: null,
};

function parseThresholdValue(value: unknown) {
  if (
    (typeof value === "number" && Number.isFinite(value)) ||
    (typeof value === "string" &&
      value.trim() !== "" &&
      Number.isFinite(Number(value)))
  ) {
    return Number(value);
  }

  return null;
}

function parseThresholds(value: unknown): DiscountThreshold[] {
  if (!Array.isArray(value)) {
    return [{...EMPTY_THRESHOLD}];
  }

  const thresholds = value
    .filter(
      (threshold): threshold is Record<string, unknown> =>
        typeof threshold === "object" && threshold !== null,
    )
    .map((threshold) => ({
      quantity: parseThresholdValue(threshold.quantity),
      percentage: parseThresholdValue(threshold.percentage),
    }));

  return thresholds.length > 0 ? thresholds : [{...EMPTY_THRESHOLD}];
}

export function parseDiscountMetafield(
  metafields?: Metafield[],
): DiscountMetafield | null {
  const metafieldRaw = metafields?.find(
    (metafield) =>
      metafield.key === FUNCTION_CONFIGURATION_METAFIELD.key,
  )?.value ?? "{}";

  try {
    const parsed = JSON.parse(metafieldRaw) as StoredDiscountMetafield;

    return {
      collectionIds: Array.isArray(parsed.collectionIds)
        ? parsed.collectionIds.filter(
            (id): id is string => typeof id === "string",
          )
        : [],
      collectionTitle:
        typeof parsed.collectionTitle === "string"
          ? parsed.collectionTitle
          : "",
      thresholds: parseThresholds(parsed.thresholds),
    };
  } catch {
    return null;
  }
}
