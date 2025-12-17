export const itemKeys = {
  all: ['items'] as const,
  latestPrices: (itemCodes: string[]) =>
    [...itemKeys.all, 'latestPrices', itemCodes.slice().sort()] as const,
};
