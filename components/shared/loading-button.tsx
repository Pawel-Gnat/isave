import { CSSProperties } from 'react';
import { cn } from '@/lib/className';

import PuffLoader from 'react-spinners/PuffLoader';

import { Button } from '../ui/button';

const override: CSSProperties = {
  borderColor: 'var(--background) var(--background) transparent',
};

interface LoadingButtonProps {
  text: string;
  isLoading: boolean;
  onClick: () => void;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  onClick,
}) => {
  return (
    <Button
      type="button"
      className={cn('w-fit min-w-32', isLoading ? 'opacity-60' : '')}
      onClick={onClick}
    >
      {isLoading ? <PuffLoader size={25} cssOverride={override} /> : text}
    </Button>
  );
};
