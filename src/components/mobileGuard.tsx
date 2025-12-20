'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import NotMobileFriendly from './notMobileFriendly';

export default function MobileGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <NotMobileFriendly />;
  }

  return children;
}
