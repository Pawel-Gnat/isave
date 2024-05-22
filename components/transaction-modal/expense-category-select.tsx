'use client';

import { FC, useState, useContext } from 'react';

import { TransactionModalContext } from '@/context/transaction-modal-context';

import { cn } from '@/lib/className';
// import { expenseCategories } from '@/lib/transactionCategories';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ArrowUpDown, Check } from 'lucide-react';

import { Expense } from '@/types/types';
import { ExpenseCategory } from '@prisma/client';

interface ExpenseCategorySelectProps {
  value: Expense;
  onChange: (value: string) => void;
}

export const ExpenseCategorySelect: FC<ExpenseCategorySelectProps> = ({
  value,
  onChange,
}) => {
  const { expenseCategories } = useContext(TransactionModalContext);
  const [open, setOpen] = useState(false);
  // console.log(expenseCategories);

  const getCategory = (categoryId: string) => {
    return expenseCategories.find((category) => category.id === categoryId)?.name;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <p className="overflow-x-hidden">
            {/* {value.categoryId
              ? expenseCategories.find((category) => category.id === value.categoryId)
                  ?.name
              : 'Wybierz kategorię'} */}
            {getCategory(value.categoryId) || 'Wybierz kategorię'}
          </p>
          <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Wybierz kategorię..." className="h-9" />
          <CommandEmpty>Nie znaleziono kategorii.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {expenseCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value.categoryId ? '' : category.id);
                    setOpen(false);
                  }}
                >
                  {category.name}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value.categoryId === category.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
