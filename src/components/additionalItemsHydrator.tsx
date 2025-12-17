'use client';

import { useEffect, useMemo } from 'react';
import { useDnFarmStore } from '@/store/dnfarm.store';
import { useLatestPricesForCalculate } from '@/features/items/hooks';
import { additionalItems as fallbackItems } from '@/lib/data';

const config = [
  { code: 'OD-RA', name: 'Ordinary Diamond' },
  { code: 'PD-RA', name: 'Polished Diamond' },
  { code: 'EOL-EP', name: 'Essence of Life' },
  { code: 'CB-EP', name: 'Card Box' },
] as const;

export function AdditionalItemsHydrator() {
  const setAdditionalItems = useDnFarmStore((s) => s.setAdditionalItems);

  const { data } = useLatestPricesForCalculate(config.map((c) => c.code));

  const fallbackByName = useMemo(() => {
    return new Map(fallbackItems.map((i) => [i.name, i.price]));
  }, []);

  useEffect(() => {
    const latestByCode = new Map(data?.map((i) => [i.item_code, i.td_price]));

    const merged = config.map(({ code, name }) => ({
      name,
      price: latestByCode.get(code) ?? fallbackByName.get(name) ?? 0,
    }));

    setAdditionalItems(merged);
  }, [data, fallbackByName, setAdditionalItems]);

  return null;
}