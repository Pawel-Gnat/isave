import Link from 'next/link';
import { FC } from 'react';

import { Badge } from '@/components/ui/badge';

interface BudgetProps {
  title: string;
  href: string;
}

export const Budget: FC<BudgetProps> = ({ title, href }) => {
  return (
    <Link
      href={href}
      className="flex flex-col gap-4 rounded-lg p-4 transition-colors hover:bg-accent"
    >
      <div className="flex flex-row justify-between gap-4">
        <p>{title}</p>
        <button>delete</button>
      </div>
      <div className="flex flex-row justify-between gap-4">
        <div>
          <Badge variant="default">name</Badge>
        </div>
        <div>
          <button>remove</button>
          <button>add</button>
        </div>
      </div>
    </Link>
  );
};
