import { FC } from 'react';

import { Input } from '@/components/ui/input';

interface TransactionValueInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const TransactionValueInput: FC<TransactionValueInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <Input
      type="number"
      min={0}
      step={0.01}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      required
    />
  );
};
