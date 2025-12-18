'use client';

import { useItemData, useUpdatePrice } from '@/features/items/hooks';
import type { UpdatePricePayload } from '@/lib/types';
import { getDateString } from '@/lib/utils';
import { useState } from 'react';

export default function ItemPage() {
  const { mutate: updatePrice } = useUpdatePrice();
  const { data, isLoading } = useItemData();
  const [copiedItemCode, setCopiedItemCode] = useState<string | null>(null);

  if (isLoading) {
    return <div>Getting item data...</div>;
  }

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keyword = formData.get('keyword') as string;
    const item_code = formData.get('item_code') as string;
    const th_price = Number(formData.get('th_price'));
    const td_price = Number(formData.get('td_price'));

    const payload: UpdatePricePayload = {
      keyword,
      item_code,
      th_price,
      td_price,
    };
    updatePrice(payload);

    e.currentTarget.reset();
  };

  const handleCopyItemCode = async (itemCode: string) => {
    await navigator.clipboard.writeText(itemCode);
    setCopiedItemCode(itemCode);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      <h1 className='text-xl font-semibold w-full'>Item Page</h1>
      <div className="h-120 w-full overflow-y-auto">
        <table className="w-full border border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky top-0 bg-black border px-2 py-1 z-10">
                Item Code
              </th>
              <th className="sticky top-0 bg-black border px-2 py-1 z-10">
                Item Name
              </th>
              <th className="sticky top-0 bg-black border px-2 py-1 z-10">
                Rarity
              </th>
              <th className="sticky top-0 bg-black border px-2 py-1 z-10">
                Market Price
              </th>
              <th className="sticky top-0 bg-black border px-2 py-1 z-10">
                Trade Price
              </th>
              <th className="sticky top-0 bg-black border px-2 py-1 z-10">
                Recorded At
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {data?.map((item) => (
              <tr
                key={item.item_code}
                className={`hover:bg-foreground/10 ${copiedItemCode === item.item_code ? 'bg-foreground/20' : ''}`}
              >
                <td className="px-2 py-1">
                  <button
                    type="button"
                    onClick={() => handleCopyItemCode(item.item_code)}
                    className={`hover:underline cursor-pointer${
                      copiedItemCode === item.item_code ? ' text-green-500' : ''
                    }`}
                    title="Click to copy"
                  >
                    {item.item_code}
                  </button>
                </td>
                <td className="px-2 py-1">{item.item_name}</td>
                <td className="px-2 py-1">{item.rarity}</td>
                <td className="px-2 py-1 text-right">{item.th_price}</td>
                <td className="px-2 py-1 text-right">{item.td_price}</td>
                <td className="px-2 py-1">
                  {item.recorded_at ? getDateString(item.recorded_at) : 'n/a'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form
          onSubmit={onSubmitForm}
          className="sticky bottom-0 bg-background w-full px-2 py-2 flex gap-2"
        >
          <input
            name="keyword"
            type="text"
            autoComplete="off"
            placeholder="Keyword"
          />
          <input
            name="item_code"
            type="text"
            placeholder="Item Code"
          />
          <input
            name="th_price"
            type="number"
            step="any"
            placeholder="Market Price"
          />
          <input
            name="td_price"
            type="number"
            step="any"
            placeholder="Trade Price"
          />
          <button
            type="submit"
            className="cursor-pointer hover:text-yellow-500"
          >
            Update Price
          </button>
        </form>
      </div>
    </div>
  );
}
