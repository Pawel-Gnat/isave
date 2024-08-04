'use client';

import { useEffect } from 'react';
import { captureException } from '@sentry/nextjs';

import { logError } from '@/utils/errorUtils';

import NavLink from '@/components/navbar/nav-link';

import { Button } from '@/components/ui/button';

import { Milestone } from 'lucide-react';

export default function GlobalError({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(() => captureException(`GlobalError page: ${error}`), error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2>Błąd działania aplikacji!</h2>
      <Button onClick={() => reset()} className="w-fit">
        Spróbuj ponownie
      </Button>
      <NavLink href="/" label="Wróć do strony głównej" icon={<Milestone />} />
    </div>
  );
}
