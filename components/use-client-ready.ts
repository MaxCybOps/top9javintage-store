'use client';
import { useEffect, useState } from 'react';
/** True only after this component has hydrated, so persisted UI never mismatches SSR. */
export function useClientReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  return ready;
}
