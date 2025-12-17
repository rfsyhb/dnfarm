'use client';

import { useQuery } from '@tanstack/react-query';
import { itemKeys } from './keys';
import { useSupabase } from '@/lib/supabase/useSupabase';
import { getLatestPricesFromView } from './api';

export function useLatestPrices(itemCodes: string[]) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: itemKeys.latestPrices(itemCodes),
    queryFn: () => getLatestPricesFromView(supabase, itemCodes),
    enabled: itemCodes.length > 0,
  });
}
