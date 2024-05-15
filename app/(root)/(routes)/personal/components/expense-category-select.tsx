import { FC } from 'react';

import { expenseCategories } from '@/lib/transactionCategories';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExpenseCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ExpenseCategorySelect: FC<ExpenseCategorySelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Wybierz kategorię" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {expenseCategories.map((category) => (
            <SelectItem key={category.id} value={category.id} className="capitalize">
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
