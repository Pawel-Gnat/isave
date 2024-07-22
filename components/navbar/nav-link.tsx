import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/className';

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactElement;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, label }) => {
  const currentRoute = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-2 rounded-lg p-2 text-primary transition-colors hover:bg-accent/30 sm:p-4 lg:px-6 lg:pr-16',
        currentRoute === href && 'text-tetriary bg-accent',
      )}
    >
      {icon}
      <span className="hidden w-fit text-nowrap lg:block">{label}</span>
    </Link>
  );
};

export default NavLink;
