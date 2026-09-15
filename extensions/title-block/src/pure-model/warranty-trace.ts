/** Private line attribute — persists to order line item custom attributes. */
export const WARRANTY_SOURCE_ATTR_KEY = '_warranty_source';

export const WARRANTY_SOURCE_ATTR_VALUE = 'warranty-block';

/** Merchant-visible label on the order line item. */
export const WARRANTY_SOURCE_LABEL_KEY = 'Warranty source';

export const WARRANTY_SOURCE_LABEL_VALUE = 'Checkout upsell';

export type LineAttribute = { key: string; value: string };

export const WARRANTY_TRACE_LINE_ATTRIBUTES: LineAttribute[] = [
  { key: WARRANTY_SOURCE_ATTR_KEY, value: WARRANTY_SOURCE_ATTR_VALUE },
  { key: WARRANTY_SOURCE_LABEL_KEY, value: WARRANTY_SOURCE_LABEL_VALUE },
];
