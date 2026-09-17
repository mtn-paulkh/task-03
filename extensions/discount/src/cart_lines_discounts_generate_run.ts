import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
  type CartInput,
  type CartLinesDiscountsGenerateRunResult,
} from '../generated/api';
import {
  parseDiscountConfiguration,
  resolveDiscountPercentage,
} from './discount-configuration';

export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  if (!input.discount.discountClasses.includes(DiscountClass.Product)) {
    return {operations: []};
  }

  const thresholds = parseDiscountConfiguration(
    input.discount.metafield?.jsonValue,
  );

  const eligibleLines = input.cart.lines.filter(
    (line) =>
      line.merchandise.__typename === 'ProductVariant' &&
      line.merchandise.product.inAnyCollection,
  );

  if (eligibleLines.length === 0) {
    return {operations: []};
  }

  const collectionItemQuantity = eligibleLines.reduce(
    (total, line) => total + line.quantity,
    0,
  );

  const percentage = resolveDiscountPercentage(
    thresholds,
    collectionItemQuantity,
  );

  if (percentage === null || percentage <= 0) {
    return {operations: []};
  }

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: [
            {
              message: `${percentage}% off selected collection items`,
              targets: eligibleLines.map((line) => ({
                cartLine: {id: line.id},
              })),
              value: {percentage: {value: String(percentage)}},
            },
          ],
          selectionStrategy: ProductDiscountSelectionStrategy.First,
        },
      },
    ],
  };
}
