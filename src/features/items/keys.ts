export const itemKeys = {
  all: ['items'] as const,
  latestPricesToCalculate: (itemCodes: string[]) =>
    [...itemKeys.all, 'latestPricesToCalculate', itemCodes.slice().sort()] as const,
  itemPriceHistory: (itemCode: string) =>
    [...itemKeys.all, 'itemPriceHistory', itemCode] as const,
};
