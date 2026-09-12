import '@shopify/ui-extensions/preact';

import {useSettings} from '@shopify/ui-extensions/checkout/preact';
import { useCard } from '../model/use-card';
import { Card } from '../ui/card';
import { useAddWarranty } from '../model/use-add-warranty';
import { useWarrantyAdded } from '../model/use-warranty-added';
import { useHasWarrantyDaysInCart } from '../model/use-has-warranty-days-in-cart';

export const Extension = () => {
  const { title = 'Default title', variant = '', add_button = 'Add to cart' } = useSettings();
  const variantId = variant.toString();
  const hasWarrantyDaysInCart = useHasWarrantyDaysInCart();
  const warrantyAdded = useWarrantyAdded({ variant: variantId });
  const { handleAddWarranty, isLoading, error, clearError } = useAddWarranty({
    variant: variantId,
  });
  const { card } = useCard({ variant: variantId });

  if (!card || warrantyAdded || !hasWarrantyDaysInCart) return null;

  return (
    <s-box padding="none">
      <s-stack direction="block" gap="small">
        {error ? (
          <s-banner
            heading="Unable to add warranty"
            tone="critical"
            dismissible
            onDismiss={clearError}
          >
            {error}
          </s-banner>
        ) : null}
        <s-heading>{title}</s-heading>
        <Card
          isEmpty={!card}
          src={card?.image?.url ?? card?.product?.featuredImage?.url}
          title={card?.product?.title ?? card?.title}
          price={
            card?.price
              ? `${card.price.amount} ${card.price.currencyCode}`
              : undefined
          }
        />
        <s-button
          loading={isLoading}
          disabled={isLoading || warrantyAdded}
          onClick={handleAddWarranty}
        >
          {warrantyAdded ? 'Added' : add_button}
        </s-button>
      </s-stack>
    </s-box>
  );
}
