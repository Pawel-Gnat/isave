'use client';

import { Button } from '@/components/ui/button';

import NavLink from '@/components/shared/nav-link';

import { Milestone } from 'lucide-react';

export default function Error({ reset }: { reset: () => void }) {
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
