'use client';

import { useEffect, useMemo } from 'react';
import { useDnFarmStore } from '@/store/dnfarm.store';
import { useItemData } from '@/features/items/hooks';
import { additionalItems as fallbackItems } from '@/lib/data';

const config = [
  { code: 'OD-RA', name: 'Ordinary Diamond' },
  { code: 'PD-RA', name: 'Polished Diamond' },
  { code: 'EOL-EP', name: 'Essence of Life' },
  { code: 'CB-EP', name: 'Card Box' },
  { code: 'MGAC-UQ', name: '(UQ) Mid Agate' },
  { code: 'MGCC-UQ', name: '(UQ) Mid Crystal' },
  { code: 'MGDC-UQ', name: '(UQ) Mid Diamond' },
  { code: 'HGAC-EP', name: '(EP) High Agate' },
  { code: 'HGCC-EP', name: '(EP) High Crystal' },
  { code: 'HGDC-EP', name: '(EP) High Diamond' },
] as const;

export function AdditionalItemsHydrator() {
  const setAdditionalItems = useDnFarmStore((s) => s.setAdditionalItems);
  const { data: itemData } = useItemData();

  const data = itemData?.filter((item) =>
    config.some((c) => c.code === item.item_code)
  );

  console.log('AdditionalItemsHydrator data:', data);

  const fallbackByName = useMemo(() => {
    return new Map(fallbackItems.map((i) => [i.name, i.price]));
  }, []);

  useEffect(() => {
    const latestByCode = new Map(
      data?.map((i) => [
        i.item_code,
        i.afterTaxAndStamp > 0 ? i.afterTaxAndStamp : 0,
      ])
    );

    const merged = config.map(({ code, name }) => ({
      name,
      price: latestByCode.get(code) ?? fallbackByName.get(name) ?? 0,
    }));

    setAdditionalItems(merged);
  }, [data, fallbackByName, setAdditionalItems]);

  return null;
}
