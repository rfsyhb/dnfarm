'use client';
import Link from 'next/link';
import { use } from 'react';

type Props = {
  params: Promise<{ itemCode: string }>;
};

export default function ItemPage({ params }: Props) {
  const { itemCode } = use(params);

  return (
    <div className="w-full h-screen justify-center items-center flex">
      <h1 className="text-2xl font-bold">Item Code: {itemCode}</h1>
      <Link
        href="/item"
        className="ml-4 text-blue-500 underline"
      >
        Back to Items
      </Link>
    </div>
  );
}
