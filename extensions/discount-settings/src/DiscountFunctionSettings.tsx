import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

const METAFIELD_NAMESPACE = "$app";
const METAFIELD_KEY = "function-configuration";
const DEFAULT_PERCENTAGE = 100;

export default async () => {
  render(<App />, document.body);
};

function parseFirstLinePercentage(metafields) {
  const raw = metafields?.find(
    (metafield) => metafield.key === METAFIELD_KEY,
  )?.value;

  try {
    const parsed = JSON.parse(raw || "{}");
    const percentage = Number(parsed.firstLineProductPercentage);
    if (Number.isFinite(percentage)) {
      return Math.min(100, Math.max(0, percentage));
    }
  } catch {
    // ignore invalid JSON
  }

  return DEFAULT_PERCENTAGE;
}

function App() {
  const { applyMetafieldChange, data, i18n } = shopify;

  const [saveError, setSaveError] = useState("");
  const persistedPercentage = useMemo(
    () => parseFirstLinePercentage(data?.metafields),
    [data?.metafields],
  );

  const [percentage, setPercentage] = useState(persistedPercentage);
  const [savedPercentage, setSavedPercentage] = useState(persistedPercentage);

  useEffect(() => {
    setPercentage(persistedPercentage);
    setSavedPercentage(persistedPercentage);
  }, [persistedPercentage]);

  async function applyExtensionMetafieldChange() {
    setSaveError("");

    const result = await applyMetafieldChange({
      type: "updateMetafield",
      namespace: METAFIELD_NAMESPACE,
      key: METAFIELD_KEY,
      value: JSON.stringify({ firstLineProductPercentage: percentage }),
      valueType: "json",
    });

    if (result.type === "error") {
      setSaveError(result.message);
      throw new Error(result.message);
    }

    setSavedPercentage(percentage);
  }

  function resetForm() {
    setSaveError("");
    setPercentage(savedPercentage);
  }

  return (
    <s-function-settings
      onSubmit={(event) => {
        event.waitUntil(applyExtensionMetafieldChange());
      }}
      onReset={resetForm}
      onError={(event) => {
        setSaveError(event.error?.message || i18n.translate("saveError"));
      }}
    >
      {!data?.metafields ? (
        <s-text>{i18n.translate("loading")}</s-text>
      ) : (
        <s-section>
          <s-stack gap="base">
            {saveError && <s-banner tone="critical">{saveError}</s-banner>}
            <s-number-field
              label={i18n.translate("percentageLabel")}
              name="firstLineProductPercentage"
              value={String(percentage)}
              defaultValue={String(savedPercentage)}
              min={0}
              max={100}
              suffix="%"
              onChange={(event) =>
                setPercentage(Number(event.currentTarget.value))
              }
            />
            <s-text color="subdued">{i18n.translate("percentageHelp")}</s-text>
          </s-stack>
        </s-section>
      )}
    </s-function-settings>
  );
}
