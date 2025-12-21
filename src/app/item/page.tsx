'use client';

import { useItemData, useUpdatePrice } from '@/features/items/hooks';
import type { UpdatePricePayload } from '@/lib/types';
import {
  calculateAfterTaxAndStamp,
  calculateStampPrice,
  getDateString,
} from '@/lib/utils';
import { useState } from 'react';

export default function ItemPage() {
  const { mutate: updatePrice } = useUpdatePrice();
  const { data, isLoading, isError } = useItemData();
  const [copiedItemCode, setCopiedItemCode] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');

  const SPECIAL_ITEMS = [
    'Essence of Life',
    'Card Box',
    'Ordinary Diamond',
    'Polished Diamond',
  ];

  if (isLoading) {
    return <div>Getting item data...</div>;
  }

  if (isError || !data) {
    return <div>Failed to load item data.</div>;
  }

  const isSpecialItem = (itemName: string) => {
    return SPECIAL_ITEMS.includes(itemName);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item_code = formData.get('item_code') as string;
    const th_price = Number(formData.get('th_price') ?? 0);
    const td_price = Number(formData.get('td_price') ?? 0);

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

  const lavishPrice = data.find((item) => item.item_name.includes('Lavish'))
    ?.th_price as number;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-row items-center gap-2 w-full p-1">
        <h1 className="text-xl font-semibold w-full">Item Page</h1>
        <input
          placeholder="icukuruwa?"
          type="text"
          value={keyword}
          autoCorrect="off"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="h-120 w-full overflow-y-auto border">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                Item Code
              </th>
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                Item Name
              </th>
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                Rarity
              </th>
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                Market Price
              </th>
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                After tax & stamp
              </th>
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                Trade Price
              </th>
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                Recorded At
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {data?.map((item) => {
              const itemData = {
                item_code: item.item_code,
                th_price: item.th_price,
                td_price: item.td_price,
                recorded_at: item.recorded_at,
              };
              const stampPrice = calculateStampPrice(item, lavishPrice);
              const afterSellPrice = calculateAfterTaxAndStamp(
                itemData,
                stampPrice
              );
              const isNegative = afterSellPrice < 0;
              return (
                <tr
                  key={item.item_code}
                  className={`hover:bg-foreground/10 ${
                    copiedItemCode === item.item_code ? 'bg-foreground/20' : ''
                  }
                ${isSpecialItem(item.item_name) ? 'text-yellow-500' : ''}`}
                >
                  <td className="px-2 py-1">
                    <button
                      type="button"
                      onClick={() => handleCopyItemCode(item.item_code)}
                      className={`hover:underline cursor-pointer${
                        copiedItemCode === item.item_code
                          ? ' text-green-500'
                          : ''
                      }`}
                      title="Click to copy"
                    >
                      {item.item_code}
                    </button>
                  </td>
                  <td className="px-2 py-1">{item.item_name}</td>
                  <td className="px-2 py-1">{item.rarity}</td>
                  <td className="px-2 py-1 text-right">{item.th_price}</td>
                  <td
                    className={`px-2 py-1 text-right ${isNegative ? 'text-red-500' : ''}`}
                  >
                    {afterSellPrice}
                  </td>
                  <td className="px-2 py-1 text-right">{item.td_price}</td>
                  <td className="px-2 py-1">
                    {item.recorded_at ? getDateString(item.recorded_at) : 'n/a'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form
        onSubmit={onSubmitForm}
        className="w-full px-2 py-2 flex gap-2"
      >
        <input
          name="item_code"
          type="text"
          placeholder="Item Code"
          required
        />
        <input
          name="th_price"
          type="number"
          step="any"
          placeholder="Market Price"
          disabled={!keyword}
        />
        <input
          name="td_price"
          type="number"
          step="any"
          placeholder="Trade Price"
          disabled={!keyword}
        />
        <button
          type="submit"
          className="cursor-pointer hover:text-yellow-500"
          disabled={!keyword}
        >
          Update Price
        </button>
      </form>
    </div>
  );
}
