import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
  type CartInput,
  type CartLinesDiscountsGenerateRunResult,
} from '../generated/api';

type DiscountFunctionConfiguration = {
  firstLineProductPercentage?: number;
};

function getFirstLinePercentage(input: CartInput): number {
  const raw = input.discount.metafield?.jsonValue as
    | DiscountFunctionConfiguration
    | null
    | undefined;

  const percentage = Number(raw?.firstLineProductPercentage);
  if (!Number.isFinite(percentage)) {
    return 100;
  }

  return Math.min(100, Math.max(0, percentage));
}

export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  const firstLine = input.cart.lines[0];
  const percentage = getFirstLinePercentage(input);

  if (
    !firstLine ||
    percentage <= 0 ||
    !input.discount.discountClasses.includes(DiscountClass.Product)
  ) {
    return {operations: []};
  }

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: [
            {
              message: `${percentage}% off first item`,
              targets: [{cartLine: {id: firstLine.id}}],
              value: {percentage: {value: percentage}},
            },
          ],
          selectionStrategy: ProductDiscountSelectionStrategy.First,
        },
      },
    ],
  };
}
