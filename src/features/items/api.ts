import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { calculateAfterTaxAndStamp, calculateStampPrice } from '@/lib/utils';

type DB = Database;
type ItemData = DB['public']['Tables']['item_data']['Row'];
type ItemPriceHistory = DB['public']['Tables']['item_price_history']['Row'];

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

export async function getItemData(supabase: SupabaseClient<DB>) {
  // Get master item data
  const { data, error } = await supabase
    .from('item_data')
    .select('item_code, item_name, rarity, stampable, stamp_total');

  if (error) throw error;
  const items: Omit<ItemData, 'id'>[] = data;

  // Get latest item prices history
  const itemCodes = items
    .map((item) => item.item_code)
    .filter((code): code is string => code !== null);
  const { data: latestPrices, error: priceError } = await supabase
    .from('latest_item_prices')
    .select('item_code, th_price, td_price, recorded_at')
    .in('item_code', itemCodes);
  if (priceError) throw priceError;
  const itemPriceHistory: ItemPriceHistory[] = latestPrices;

  // Merge item data with latest prices
  const mergedData = items.map((i) => {
    const priceInfo = itemPriceHistory.find((p) => p.item_code === i.item_code);
    return {
      ...i,
      th_price: priceInfo?.th_price || 0,
      td_price: priceInfo?.td_price || 0,
      recorded_at: priceInfo?.recorded_at ?? new Date().toISOString(),
    };
  });

  const lavishPrice = mergedData.find((item) =>
    item.item_name.includes('Lavish')
  )?.th_price as number;

  const finalData = mergedData.map((item) => {
    const itemData = {
      item_code: item.item_code,
      th_price: item.th_price,
      td_price: item.td_price,
      recorded_at: item.recorded_at,
    };
    const stampPrice = calculateStampPrice(item, lavishPrice);
    const afterTaxAndStamp = calculateAfterTaxAndStamp(itemData, stampPrice);
    return {
      ...item,
      afterTaxAndStamp,
    };
  });
  return finalData;
}

export async function getItemPriceHistory(
  supabase: SupabaseClient<DB>,
  itemCode: string
) {
  const { data, error } = await supabase
    .from('item_price_history')
    .select(`
      item_code,
      th_price,
      td_price,
      recorded_at,
      item_data (
        item_name
      )
    `)
    .eq('item_code', itemCode)
    .order('recorded_at', { ascending: true });

  if (error) throw error;
  return data || [];
}
