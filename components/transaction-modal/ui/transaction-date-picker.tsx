'use client';

import { FC } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { cn } from '@/lib/className';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { CalendarDays } from 'lucide-react';

interface TransactionDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export const TransactionDatePicker: FC<TransactionDatePickerProps> = ({
  date,
  setDate,
}) => {
  const handleDateSelect = (day: Date | undefined) => {
    if (day) {
      setDate(day);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'ml-auto w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP', { locale: pl }) : <span>Podaj datę</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={pl}
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
