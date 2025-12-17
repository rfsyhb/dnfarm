'use client';

import { useQuery } from '@tanstack/react-query';
import { itemKeys } from './keys';
import { useSupabase } from '@/lib/supabase/useSupabase';
import { getLatestPricesFromView } from './api';
import { Database } from '@/lib/supabase/types';

type LatestItemPriceRow = Database['public']['Views']['latest_item_prices']['Row'];

export function useLatestPricesForCalculate(itemCodes: string[]) {
  const supabase = useSupabase();

  return useQuery<LatestItemPriceRow[]>({
    queryKey: itemKeys.latestPricesToCalculate(itemCodes),
    queryFn: () => getLatestPricesFromView(supabase, itemCodes),
    enabled: itemCodes.length > 0,
  });
}
