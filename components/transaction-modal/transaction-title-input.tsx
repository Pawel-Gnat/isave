import { FC } from 'react';

import { Input } from '@/components/ui/input';

interface TransactionTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TransactionTitleInput: FC<TransactionTitleInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
};
