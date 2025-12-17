export const itemKeys = {
  all: ['items'] as const,
  latestPricesToCalculate: (itemCodes: string[]) =>
    [...itemKeys.all, 'latestPricesToCalculate', itemCodes.slice().sort()] as const,
};
