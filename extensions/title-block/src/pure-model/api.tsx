const VARIANT_BY_ID_QUERY = `
  query VariantById($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        image {
          url
          altText
        }
        product {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
        }
      }
    }
  }
`;

export type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type StorefrontImage = {
  url: string;
  altText: string | null;
};

export type WarrantyCardVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
  image: StorefrontImage | null;
  product: {
    id: string;
    title: string;
    handle: string;
    featuredImage: StorefrontImage | null;
  };
};

export type VariantByIdQueryVariables = {
  id: string;
};

export type VariantByIdQueryData = {
  node: WarrantyCardVariant | null;
};

export function toVariantGid(variant: string): string {
  const trimmed = variant.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('gid://')) return trimmed;
  return `gid://shopify/ProductVariant/${trimmed}`;
}

/** Storefront: variant по GID (или numeric id). null если не найден / не опубликован. */
export async function getWarrantyCardProduct({
  variant,
}: {
  variant: string;
}): Promise<WarrantyCardVariant | null> {
  const id = toVariantGid(variant);
  if (!id) return null;

  const {data, errors} = await shopify.query<
    VariantByIdQueryData,
    VariantByIdQueryVariables
  >(VARIANT_BY_ID_QUERY, {
    variables: {id},
  });

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(', '));
  }

  return data?.node ?? null;
}
