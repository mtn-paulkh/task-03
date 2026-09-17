import "@shopify/ui-extensions/preact";
import { useState } from "preact/hooks";
import type { DiscountMetafield } from "../hooks/use-discount-metafield";

export type SelectedCollection = {
  id: string;
  title: string;
};

type SelectCollectionProps = {
  collection: SelectedCollection | null;
  onChange: (fields: Partial<DiscountMetafield>) => Promise<void>;
  onError: (message: string) => void;
};

export function SelectCollection({
  collection,
  onChange,
  onError,
}: SelectCollectionProps) {
  const { i18n } = shopify;
  const [loading, setLoading] = useState(false);

  async function selectCollection() {
    const selection = await shopify.resourcePicker({
      type: "collection",
      action: "select",
      multiple: false,
      selectionIds: collection ? [{ id: collection.id }] : [],
    });
    const selectedCollection = selection?.[0];

    if (!selectedCollection) {
      return;
    }

    setLoading(true);

    try {
      await onChange({
        collectionIds: [selectedCollection.id],
        collectionTitle: selectedCollection.title,
      });

      onError("");
    } catch (error) {
      onError(
        error instanceof Error ? error.message : i18n.translate("saveError"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <s-stack gap="base">
      <s-heading>Collection</s-heading>
      <s-text-field
        name="selectedCollection"
        value={collection?.title || ""}
        placeholder={i18n.translate("collectionEmpty")}
        readOnly
      />
      <s-button loading={loading} disabled={loading} onClick={selectCollection}>
        {i18n.translate(collection ? "collectionChange" : "collectionSelect")}
      </s-button>
    </s-stack>
  );
}
