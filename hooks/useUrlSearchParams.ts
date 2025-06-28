import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateParams = useCallback(
    (updateFunction: (params: URLSearchParams) => void) => {
      const newParams = new URLSearchParams(searchParams);
      updateFunction(newParams);
      router.push(`?${newParams.toString()}`);
    },
    [searchParams],
  );

  return [searchParams, updateParams] as const;
}
