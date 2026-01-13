'use client';

import { useItemPriceHistory } from '@/features/items/hooks';
import { getReadableDateString } from '@/lib/utils';

export function HistoryModalContent({
  itemCode,
  rarity,
}: {
  itemCode: string;
  rarity: string;
}) {
  const { data, isLoading, isError } = useItemPriceHistory(itemCode);

  if (isLoading)
    return <div className="text-background">Loading item price history...</div>;
  if (isError)
    return <div className="text-background">Failed to load price history.</div>;
  if (!data || data.length === 0)
    return (
      <div className="text-background">
        No price history available for this item.
      </div>
    );

  return (
    <div className="w-[min(90vw,600px)] text-background">
      <div className="text-center mb-3">
        <h2 className="text-xl font-semibold">
          {data[0]?.item_data?.item_name ?? itemCode}{' '}
          <span className="font-normal text-lg">({rarity})</span>
        </h2>
        <p>Price History</p>
      </div>

      <div className="max-h-80 overflow-y-auto">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-background text-foreground">
            <tr>
              <th className="px-2 py-1 border-b border-r">Recorded At</th>
              <th className="px-2 py-1 border-b border-r">Market Price</th>
              <th className="px-2 py-1 border-b">Trade Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((history) => (
              <tr
                key={history.recorded_at}
                className="hover:bg-foreground/20"
              >
                <td className="px-2 py-1 border-r">
                  {getReadableDateString(history.recorded_at)}
                </td>
                <td className="px-2 py-1 border-r text-right">
                  {history.th_price}
                </td>
                <td className="px-2 py-1 text-right">{history.td_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
