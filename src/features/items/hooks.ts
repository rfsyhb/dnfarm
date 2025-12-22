'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itemKeys } from './keys';
import { useSupabase } from '@/lib/supabase/useSupabase';
import {
  getItemData,
  getItemPriceHistory,
  getLatestPricesFromView,
} from './api';
import { Database } from '@/lib/supabase/types';
import type { UpdatePricePayload } from '@/lib/types';

type LatestItemPriceRow =
  Database['public']['Views']['latest_item_prices']['Row'];
type ItemData = Database['public']['Tables']['item_data']['Row'];
type MainItemData = Omit<
  ItemData & LatestItemPriceRow & { afterTaxAndStamp: number },
  'id'
>;
type ItemPriceHistory =
  Database['public']['Tables']['item_price_history']['Row'] & {
    item_data: { item_name: string };
  };

export function useLatestPricesForCalculate(itemCodes: string[]) {
  const supabase = useSupabase();

  return useQuery<LatestItemPriceRow[]>({
    queryKey: itemKeys.latestPricesToCalculate(itemCodes),
    queryFn: () => getLatestPricesFromView(supabase, itemCodes),
    enabled: itemCodes.length > 0,
  });
}

export function useUpdatePrice() {
  const qc = useQueryClient();

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: itemKeys.all });
    },
    onError: (error: Error) => {
      if (error.message === 'Forbidden') {
        alert('Wrong keyword, bud.');
        return;
      }

      if (error.message === 'Item not found') {
        alert('Item code not found.');
        return;
      }
    },
  });
}

export function useItemData() {
  const supabase = useSupabase();

  return useQuery<MainItemData[]>({
    queryKey: itemKeys.all,
    queryFn: () => getItemData(supabase),
  });
}

export function useItemPriceHistory(itemCode: string) {
  const supabase = useSupabase();

  return useQuery<ItemPriceHistory[]>({
    queryKey: itemKeys.itemPriceHistory(itemCode),
    queryFn: async () => {
      return getItemPriceHistory(supabase, itemCode);
    },
  });
}
