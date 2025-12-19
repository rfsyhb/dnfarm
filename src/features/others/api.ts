import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type DB = Database;

export async function getLatestGoldPricesFromView(
  supabase: SupabaseClient<DB>
) {
  const { data, error } = await supabase
    .from('latest_gold_rate')
    .select('gold_rate_sell, gold_rate_buy, recorded_at')
    .single();

  if (error) throw error;
  const goldData: DB['public']['Views']['latest_gold_rate']['Row'] = data;

  return goldData || [];
}
