import { CSSProperties } from 'react';

import PuffLoader from 'react-spinners/PuffLoader';

import { Button } from '../ui/button';

const override: CSSProperties = {
  borderColor: 'var(--background) var(--background) transparent',
};

interface FormLoadingButtonProps {
  text: string;
  isLoading: boolean;
}

export const FormLoadingButton: React.FC<FormLoadingButtonProps> = ({
  isLoading,
  text,
}) => {
  return (
    <Button type="submit" className={isLoading ? 'w-full opacity-60' : 'w-full'}>
      {isLoading ? <PuffLoader size={25} cssOverride={override} /> : text}
    </Button>
  );
};
