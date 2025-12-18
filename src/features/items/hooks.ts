'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { itemKeys } from './keys';
import { useSupabase } from '@/lib/supabase/useSupabase';
import { getLatestPricesFromView } from './api';
import { Database } from '@/lib/supabase/types';
import type { UpdatePricePayload } from '@/lib/types';

type LatestItemPriceRow =
  Database['public']['Views']['latest_item_prices']['Row'];

export function useLatestPricesForCalculate(itemCodes: string[]) {
  const supabase = useSupabase();

  return useQuery<LatestItemPriceRow[]>({
    queryKey: itemKeys.latestPricesToCalculate(itemCodes),
    queryFn: () => getLatestPricesFromView(supabase, itemCodes),
    enabled: itemCodes.length > 0,
  });
}

export function useUpdatePrice() {
  return useMutation({
    mutationFn: async (payload: UpdatePricePayload) => {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Request failed');

      return json as { ok: true; data: unknown } | { message: string };
    },
  });
}
