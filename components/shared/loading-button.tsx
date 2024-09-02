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
  disabled?: boolean;
}

export const LoadingButton = ({
  isLoading,
  text,
  onClick,
  disabled,
}: LoadingButtonProps) => {
  return (
    <Button
      type="button"
      className={cn('min-w-32 md:w-fit', isLoading ? 'opacity-60' : '')}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? <PuffLoader size={25} cssOverride={override} /> : text}
    </Button>
  );
};
