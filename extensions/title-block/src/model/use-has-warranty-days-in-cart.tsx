import {useAppMetafields} from '@shopify/ui-extensions/checkout/preact';

const DEFAULT_NAMESPACE = '$app:custom';
const DEFAULT_KEY = 'warranty_days';

function isFilledMetafieldValue(value: unknown): boolean {
  if (value == null) return false;
  return String(value).trim() !== '';
}

function productIdMatchesTarget(productId: string, targetId: string | number) {
  return productId.endsWith(String(targetId));
}

export function useHasWarrantyDaysInCart({
  namespace = DEFAULT_NAMESPACE,
  key = DEFAULT_KEY,
}: {
  namespace?: string;
  key?: string;
} = {}): boolean {
  const warrantyMetafields = useAppMetafields({
    type: 'product',
    namespace,
    key,
  });

  return shopify.lines.value.some((line) => {
    const productId = line.merchandise?.product?.id;
    if (!productId) return false;

    const entry = warrantyMetafields.find((item) =>
      productIdMatchesTarget(productId, item.target.id),
    );

    return isFilledMetafieldValue(entry?.metafield?.value);
  });
}
