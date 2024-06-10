import { FC, forwardRef } from 'react';

import { Input } from '@/components/ui/input';

interface TransactionValueInputProps {
  value: number;
  onChange: (value: number) => void;
  className: string;
}

export const TransactionValueInput: FC<TransactionValueInputProps> = forwardRef<
  HTMLInputElement,
  TransactionValueInputProps
>(({ value, onChange, className }, ref) => {
  return (
    <Input
      type="number"
      step={0.01}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      required
      className={className}
      ref={ref}
    />
  );
});

TransactionValueInput.displayName = 'TransactionValueInput';
