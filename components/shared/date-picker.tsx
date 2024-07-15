import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { cn } from '@/lib/className';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { CalendarDays } from 'lucide-react';

import { DateRange } from 'react-day-picker';

interface DatePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export const DatePicker = ({ date, setDate }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[320px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'PPP', { locale: pl })} -{' '}
                {format(date.to, 'PPP', { locale: pl })}
              </>
            ) : (
              format(date.from, 'PPP', { locale: pl })
            )
          ) : (
            <span>Wybierz zakres dat</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
};
