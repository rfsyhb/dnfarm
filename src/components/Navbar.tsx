'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <nav className="flex flex-row gap-2 items-center justify-center">
      <Link
        href="/"
        className={`font-semibold hover:underline${
          currentPath === '/' ? ' underline' : ''
        }`}
      >
        Home
      </Link>
      <Link
        href="/item"
        className={`hover:underline${
          currentPath === '/item' ? ' underline' : ''
        }`}
      >
        Items
      </Link>
    </nav>
  );
}
