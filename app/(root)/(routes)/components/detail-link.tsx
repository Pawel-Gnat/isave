import Link from 'next/link';

interface DetailLinkProps {
  src: string;
}

export const DetailLink = ({ src }: DetailLinkProps) => {
  return (
    <Link
      href={src}
      className="bg-secondary hover:bg-secondary/30 rounded-md p-2 px-4 transition-colors"
    >
      Szczegóły
    </Link>
  );
};
