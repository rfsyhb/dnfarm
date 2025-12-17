import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type DB = Database;

export async function getLatestPricesFromView(
  supabase: SupabaseClient<DB>,
  itemCodes: string[]
) {
  const { data, error } = await supabase
    .from('latest_item_prices')
    .select('item_code, item_name, th_price, td_price, recorded_at')
    .in('item_code', itemCodes);

  if (error) throw error;
  return data || [];
}