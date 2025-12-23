'use client';

import { useItemData, useUpdatePrice } from '@/features/items/hooks';
import type { UpdatePricePayload } from '@/lib/types';
import { getReadableDateString, sortItemsByRarity } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

export default function ItemPage() {
  const { mutate: updatePrice } = useUpdatePrice();
  const { data, isLoading, isError } = useItemData();
  const [copiedItemCode, setCopiedItemCode] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');

  const SPECIAL_ITEMS = [
    {
      name: 'Essence of Life',
      rarity: 'Epic',
    },
    {
      name: 'Card Box',
      rarity: 'Epic',
    },
    {
      name: 'Ordinary Diamond',
      rarity: 'Rare',
    },
    {
      name: 'Polished Diamond',
      rarity: 'Rare',
    },
    {
      name: 'Mid Grade Agate Code',
      rarity: 'Unique',
    },
    {
      name: 'Mid Grade Crystal Code',
      rarity: 'Unique',
    },
    {
      name: 'Mid Grade Diamond Code',
      rarity: 'Unique',
    },
    {
      name: 'High Grade Agate Code',
      rarity: 'Epic',
    },
    {
      name: 'High Grade Crystal Code',
      rarity: 'Epic',
    },
    {
      name: 'High Grade Diamond Code',
      rarity: 'Epic',
    },
  ];

  if (isLoading) {
    return <div>Getting item data...</div>;
  }

  if (isError || !data) {
    return <div>Failed to load item data.</div>;
  }

  const sortedItems = sortItemsByRarity(data);

  const isSpecialItem = (item: (typeof sortedItems)[number]) => {
    return SPECIAL_ITEMS.some(
      (specialItem) =>
        specialItem.name === item.item_name &&
        specialItem.rarity === item.rarity
    );
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
              <th className="sticky top-0 bg-background border px-2 py-1 z-10">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {sortedItems.map((item) => {
              const isNegative = item.afterTaxAndStamp < 0;
              return (
                <tr
                  key={item.item_code}
                  className={`hover:bg-foreground/10 ${
                    copiedItemCode === item.item_code ? 'bg-foreground/20' : ''
                  }
                ${isSpecialItem(item) ? 'text-yellow-500' : ''}`}
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
                    className={`px-2 py-1 text-right ${
                      isNegative ? 'text-red-500' : ''
                    }`}
                  >
                    {item.afterTaxAndStamp}
                  </td>
                  <td className="px-2 py-1 text-right">{item.td_price}</td>
                  <td className="px-2 py-1">
                    {item.recorded_at
                      ? getReadableDateString(item.recorded_at)
                      : 'n/a'}
                  </td>
                  <td className="px-2 py-1 text-center">
                    <Link href={`/item/history/${item.item_code}`}>
                      <button
                        type="button"
                        className="cursor-pointer w-full border px-2 hover:bg-foreground/20 rounded-xl"
                      >
                        History
                      </button>
                    </Link>
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
          placeholder={`${keyword ? 'Market Price' : 'n/a'}`}
          disabled={!keyword}
        />
        <input
          name="td_price"
          type="number"
          step="any"
          placeholder={`${keyword ? 'Trade Price' : 'n/a'}`}
          disabled={!keyword}
        />
        <button
          type="submit"
          className={`${
            keyword
              ? 'cursor-pointer hover:text-yellow-500'
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!keyword}
        >
          Update Price
        </button>
      </form>
    </div>
  );
}
