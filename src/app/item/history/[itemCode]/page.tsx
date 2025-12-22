'use client';
import { useItemPriceHistory } from '@/features/items/hooks';
import { getReadableDateString } from '@/lib/utils';
import { use } from 'react';

type Props = {
  params: Promise<{ itemCode: string }>;
};

export default function ItemPage({ params }: Props) {
  const { itemCode } = use(params);
  const { data, isLoading } = useItemPriceHistory(itemCode);

  if (isLoading) return <div>Loading item price history...</div>;
  if (!data) return <div>No data found for item code: {itemCode}</div>;

  return (
    <div className="w-full h-screen justify-center items-center flex flex-col">
      <div className='text-center'>
        <h2 className="text-xl font-semibold">{data[0].item_data.item_name}</h2>
        <p>Price History</p>
      </div>
      <div className="max-h-80 max-w-120 overflow-y-auto">
        {data && data.length === 0 && (
          <div>No price history available for this item.</div>
        )}
        {data && data.length > 0 && (
          <table className="table-fixed border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-background">
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
        )}
      </div>
    </div>
  );
}
