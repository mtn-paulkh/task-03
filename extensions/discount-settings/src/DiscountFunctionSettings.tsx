import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useState } from "preact/hooks";
import { DiscountThresholds } from "./compose/discount-thresholds";
import { SelectCollection } from "./compose/select-collection";
import { useDiscountMetafield } from "./hooks/use-discount-metafield";

export default async () => {
  render(<App />, document.body);
};

function App() {
  const { i18n } = shopify;
  const [saveError, setSaveError] = useState("");
  const { metafield, loading, stageFields, save, reset, collection } =
    useDiscountMetafield();

  async function saveMetafield() {
    setSaveError("");

    if (!collection) {
      const message = i18n.translate("collectionRequired");
      setSaveError(message);
      throw new Error(message);
    }

    try {
      await save();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : i18n.translate("saveError");
      setSaveError(message);
      throw error;
    }
  }

  function resetForm() {
    setSaveError("");
    reset();
  }

  return (
    <s-function-settings
      onSubmit={(event) => {
        event?.preventDefault();
        event.waitUntil?.(saveMetafield());
      }}
      onReset={resetForm}
      onError={(event) => {
        setSaveError(event.error?.message || i18n.translate("saveError"));
      }}
    >
      {loading ? (
        <s-text>{i18n.translate("loading")}</s-text>
      ) : (
        <s-section>
          <s-stack gap="base">
            {saveError && <s-banner tone="critical">{saveError}</s-banner>}
            <SelectCollection
              collection={collection}
              onChange={stageFields}
              onError={setSaveError}
            />
            <DiscountThresholds
              thresholds={metafield?.thresholds ?? null}
              onChange={(thresholds) => stageFields({ thresholds })}
            />
          </s-stack>
        </s-section>
      )}
    </s-function-settings>
  );
}
