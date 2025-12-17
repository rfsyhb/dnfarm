import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type DB = Database;
type LatestPrice = DB['public']['Tables']['item_price_history']['Row'];

export async function getLatestPricesFromView(
  supabase: SupabaseClient<DB>,
  itemCodes: string[]
) {
  const { data, error } = await supabase
    .from('latest_item_prices')
    .select('item_code, th_price, td_price, recorded_at')
    .in('item_code', itemCodes);

  if (error) throw error;
  return data as Pick<
    LatestPrice,
    'item_code' | 'th_price' | 'td_price' | 'recorded_at'
  >[];
}