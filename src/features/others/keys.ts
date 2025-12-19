export const othersKeys = {
  all: ['others'] as const,
  latestGoldRate: () => [...othersKeys.all, 'latestGoldRate'] as const,
};
