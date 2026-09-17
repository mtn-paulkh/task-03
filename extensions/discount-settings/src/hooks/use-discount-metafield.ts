import {useEffect, useMemo, useState} from "preact/hooks";
import {
  FUNCTION_CONFIGURATION_METAFIELD,
  parseDiscountMetafield,
  type DiscountMetafield,
} from "../pure-model/discount-metafield";

export type {DiscountMetafield, DiscountThreshold} from "../pure-model/discount-metafield";

export function useDiscountMetafield() {
  const {applyMetafieldChange, data} = shopify;
  const persistedMetafield = useMemo(
    () => parseDiscountMetafield(data?.metafields),
    [data?.metafields],
  );
  const [metafield, setMetafield] =
    useState<DiscountMetafield | null>(persistedMetafield);

  useEffect(() => {
    setMetafield(persistedMetafield);
  }, [persistedMetafield]);

  const collectionId = metafield?.collectionIds[0];
  const collection = collectionId
    ? {
        id: collectionId,
        title: metafield.collectionTitle || collectionId,
      }
    : null;

  function updateField<Key extends keyof DiscountMetafield>(
    key: Key,
    value: DiscountMetafield[Key],
  ) {
    setMetafield((current) => current ? { ...current, [key]: value } : null);
  }

  function updateFields(fields: Partial<DiscountMetafield>) {
    setMetafield((current) => current ? { ...current, ...fields } : null);
  }

  async function applyValue(value: DiscountMetafield | null) {
    if (!value) {
      return;
    }
    const result = await applyMetafieldChange({
      type: "updateMetafield",
      namespace: FUNCTION_CONFIGURATION_METAFIELD.namespace,
      key: FUNCTION_CONFIGURATION_METAFIELD.key,
      value: JSON.stringify(value),
      valueType: "json",
    });

    if (result.type === "error") {
      throw new Error(result.message);
    }
  }

  async function stageFields(fields: Partial<DiscountMetafield>) {

    const nextValue = metafield ? { ...metafield, ...fields } : null;
    await applyValue(nextValue);
    setMetafield(nextValue);
  }

  async function save() {
    await applyValue(metafield);
  }

  function reset() {
    if (!persistedMetafield) {
      return;
    }
    setMetafield({...persistedMetafield});
  }

  return {
    metafield,
    loading: !metafield,
    updateField,
    updateFields,
    stageFields,
    save,
    reset,
    collection,
  };
}
