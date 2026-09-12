import {toVariantGid} from '../pure-model/api';

export function useWarrantyAdded({variant}: {variant: string}): boolean {
  const variantGid = toVariantGid(variant);
  if (!variantGid) return false;

  return shopify.lines.value.some(
    (line) => line.merchandise?.id === variantGid,
  );
}
