import type { Database } from './supabase/types';

type DB = Database;

export const getDateString = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

// ex: 01 Jan 2025 14:30:15
export const getReadableDateString = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export const getMsDurationString = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const diffMs = end.getTime() - start.getTime();

  if (diffMs < 0) return 0;
  return diffMs;
};

type TbItemData = DB['public']['Tables']['item_data']['Row'];
type TbItemPriceHistory = DB['public']['Tables']['item_price_history']['Row'];
type ItemData = Omit<TbItemData, 'id'>;
type ItemPriceHistory = Omit<TbItemPriceHistory, 'id'>;

export const calculateStampPrice = (item: ItemData, lavishPrice: number) => {
  if (item.stampable === false) return 0;
  const stampPrice = lavishPrice / ((3000 + 200 * 30) / 20);
  const totalStampPrice = stampPrice * item.stamp_total;
  return Math.round(totalStampPrice);
};

export const calculateAfterTaxAndStamp = (
  item: ItemPriceHistory,
  stampPrice: number
) => {
  const taxRate = 0.1; // 10% tax trading house
  const afterTaxPrice = item.th_price * (1 - taxRate);
  const afterTaxAndStamp = afterTaxPrice - stampPrice;
  const isRounded = Number.isInteger(afterTaxAndStamp);
  return isRounded
    ? Math.round(afterTaxAndStamp)
    : Number(afterTaxAndStamp.toFixed(3));
};

type Rarity = DB['public']['Enums']['rarity_type'];
type ItemDataToSort = ItemData & ItemPriceHistory;
const rarityOrder: Rarity[] = ['Common', 'Rare', 'Epic', 'Unique', 'Legendary'];

const sortByRarity = (a: Rarity, b: Rarity) => {
  return rarityOrder.indexOf(a) - rarityOrder.indexOf(b);
};

export const sortItemsByRarity = (items: ItemDataToSort[]) => {
  return items.sort((a, b) => sortByRarity(a.rarity, b.rarity));
};
