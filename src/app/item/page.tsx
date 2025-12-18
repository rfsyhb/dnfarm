'use client';

import { useItemData, useUpdatePrice } from '@/features/items/hooks';
import type { UpdatePricePayload } from '@/lib/types';

export default function ItemPage() {
  const { mutate: updatePrice } = useUpdatePrice();
  const { data, isLoading } = useItemData();
  
  if (isLoading) {
    return <div>Getting item data...</div>;
  }

  const onSubmit = (payload: UpdatePricePayload) => {
    updatePrice(payload, {
      onSuccess: (response) => {
        console.log(response);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <p>Item Page</p>
      <div className="h-120 border w-full">
        <p>to be added</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const keyword = formData.get('keyword') as string;
            const item_code = formData.get('item_code') as string;
            const th_price = Number(formData.get('th_price'));
            const td_price = Number(formData.get('td_price'));
            onSubmit({ keyword, item_code, th_price, td_price });
          }}
        >
          <input
            name="keyword"
            type="text"
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
            placeholder="TH Price"
          />
          <input
            name="td_price"
            type="number"
            placeholder="TD Price"
          />
          <button type="submit">Update Price</button>
        </form>
      </div>
    </div>
  );
}
