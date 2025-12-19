import { useSupabase } from '@/lib/supabase/useSupabase';
import { useQuery } from '@tanstack/react-query';
import { othersKeys } from './keys';
import type { Database } from '@/lib/supabase/types';
import { getLatestGoldPricesFromView } from './api';

type goldRateView = Database['public']['Views']['latest_gold_rate']['Row'];

export function useGoldData() {
  const supabase = useSupabase();

  return useQuery<goldRateView>({
    queryKey: othersKeys.latestGoldRate(),
    queryFn: () => getLatestGoldPricesFromView(supabase),
  });
}
