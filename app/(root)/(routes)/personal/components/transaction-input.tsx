import { FC } from 'react';

import { Input } from '@/components/ui/input';

interface TransactionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TransactionInput: FC<TransactionInputProps> = ({ value, onChange }) => {
  return <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />;
};
