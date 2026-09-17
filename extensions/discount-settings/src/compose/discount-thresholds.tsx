import "@shopify/ui-extensions/preact";
import type { DiscountThreshold } from "../hooks/use-discount-metafield";

type DiscountThresholdsProps = {
  thresholds: DiscountThreshold[] | null;
  onChange: (thresholds: DiscountThreshold[]) => void;
};

function toFieldValue(value: number | null) {
  return value === null ? "" : String(value);
}

function fromFieldValue(value: string) {
  return value === "" ? null : Number(value);
}

export function DiscountThresholds({
  thresholds,
  onChange,
}: DiscountThresholdsProps) {
  function updateThreshold(
    index: number,
    key: keyof DiscountThreshold,
    value: number | null,
  ) {
    if (!thresholds) {
      return;
    }
    onChange(
      thresholds.map((threshold, thresholdIndex) =>
        thresholdIndex === index ? { ...threshold, [key]: value } : threshold,
      ),
    );
  }

  function addThreshold() {
    if (!thresholds) {
      return;
    }
    onChange([...thresholds, { quantity: null, percentage: null }]);
  }

  function removeThreshold(index: number) {
    if (!thresholds) {
      return;
    }

    onChange(
      thresholds.filter((_, thresholdIndex) => thresholdIndex !== index),
    );
  }

  return (
    <>
      <s-stack gap="base">
        <s-heading>Discount thresholds</s-heading>

        {thresholds &&
          thresholds.length > 0 &&
          thresholds.map((threshold, index) => (
            <s-grid
              key={`threshold-${threshold.quantity}-${threshold.percentage}`}
              gridTemplateColumns="1fr 1fr auto"
              gap="base"
              alignItems="end"
            >
              <s-number-field
                label="Quantity"
                name={`thresholds.${index}.quantity`}
                value={toFieldValue(threshold.quantity)}
                min={1}
                inputMode="numeric"
                onChange={(event) =>
                  updateThreshold(
                    index,
                    "quantity",
                    fromFieldValue(event.currentTarget.value),
                  )
                }
              />
              <s-number-field
                label="Discount percentage"
                name={`thresholds.${index}.percentage`}
                value={toFieldValue(threshold.percentage)}
                min={0}
                max={100}
                suffix="%"
                onChange={(event) =>
                  updateThreshold(
                    index,
                    "percentage",
                    fromFieldValue(event.currentTarget.value),
                  )
                }
              />
              {thresholds?.length !== 1 && (
                <s-button
                  icon="x-circle"
                  variant="tertiary"
                  accessibilityLabel="Remove threshold"
                  onClick={(event) => {
                    event.preventDefault();
                    removeThreshold(index);
                  }}
                />
              )}
            </s-grid>
          ))}
      </s-stack>
      <s-stack gap="base">
        <s-button onClick={addThreshold}>Add threshold</s-button>
      </s-stack>
    </>
  );
}
