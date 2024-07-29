import { CSSProperties, FC } from 'react';

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

export const LoadingButton: FC<LoadingButtonProps> = ({
  isLoading,
  text,
  onClick,
  disabled,
}) => {
  return (
    <Button
      type="button"
      className={cn('md:w-fit min-w-32', isLoading ? 'opacity-60' : '')}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? <PuffLoader size={25} cssOverride={override} /> : text}
    </Button>
  );
};
