import { FC } from 'react';
import Link from 'next/link';

interface DetailLinkProps {
  src: string;
}

export const DetailLink: FC<DetailLinkProps> = ({ src }) => {
  return (
    <Link
      href={src}
      className="rounded-md bg-secondary p-2 px-4 transition-colors hover:bg-secondary/30"
    >
      Szczegóły
    </Link>
  );
};
