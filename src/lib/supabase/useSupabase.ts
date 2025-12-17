'use client';

import { useMemo } from 'react';
import { createSupabaseBrowser } from './client';

export function useSupabase() {
  return useMemo(() => createSupabaseBrowser(), []);
}
