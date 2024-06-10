import { FC, forwardRef } from 'react';

import { Input } from '@/components/ui/input';

interface TransactionTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  className: string;
}

export const TransactionTitleInput: FC<TransactionTitleInputProps> = forwardRef<
  HTMLInputElement,
  TransactionTitleInputProps
>(({ value, onChange, className }, ref) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      ref={ref}
    />
  );
});

TransactionTitleInput.displayName = 'TransactionTitleInput';
