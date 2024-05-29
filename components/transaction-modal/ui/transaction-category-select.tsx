'use client';

import { FC, useState, useContext, forwardRef } from 'react';

import { TransactionCategoryContext } from '@/context/transaction-category-context';

import { cn } from '@/lib/className';

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

import { Transaction, TransactionType } from '@/types/types';

interface TransactionCategorySelectProps {
  value: Transaction;
  transactionType: TransactionType;
  onChange: (value: string) => void;
  className: string;
}

export const TransactionCategorySelect: FC<TransactionCategorySelectProps> = forwardRef<
  HTMLButtonElement,
  TransactionCategorySelectProps
>(({ value, transactionType, onChange, className }, ref) => {
  const { expenseCategories, incomeCategories } = useContext(TransactionCategoryContext);
  const [open, setOpen] = useState(false);
  const transactionCategories =
    transactionType === 'expense' ? expenseCategories : incomeCategories;

  const getCategory = (categoryId: string) => {
    return transactionCategories.find((category) => category.id === categoryId)?.name;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(className, 'w-full justify-between')}
          ref={ref}
        >
          <p className="overflow-x-hidden">
            {getCategory(value.categoryId) || 'Wybierz kategorię'}
          </p>
          <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Wybierz kategorię..." className="h-9" />
          <CommandEmpty>Nie znaleziono kategorii</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {transactionCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={(currentValue: string) => {
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
});
