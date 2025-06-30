import { DatePicker } from '@/components/shared/date-picker';

import { Button } from '@/components/ui/button';

import { DateRange } from 'react-day-picker';
import { useUrlSearchParams } from '@/hooks/useUrlSearchParams';
import { endOfMonth, format, startOfMonth } from 'date-fns';

interface ActionsPanelProps {
  setIsIncomeModalOpen: (isModalOpen: boolean) => void;
  setIsExpenseModalOpen: (isModalOpen: boolean) => void;
}

export const ActionsPanel = ({
  setIsIncomeModalOpen,
  setIsExpenseModalOpen,
}: ActionsPanelProps) => {
  const [searchParams, updateParams] = useUrlSearchParams();

  const handleSetDate = (date: DateRange | undefined) => {
    updateParams((params) => {
      params.set('from', format(date?.from || startOfMonth(new Date()), 'yyyy-MM-dd'));
      params.set('to', format(date?.to || endOfMonth(new Date()), 'yyyy-MM-dd'));
    });
  };

  return (
    <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:items-end md:flex-row">
      <DatePicker
        date={{
          from: new Date(searchParams.get('from') || startOfMonth(new Date())),
          to: new Date(searchParams.get('to') || endOfMonth(new Date())),
        }}
        setDate={handleSetDate}
      />
      <div className="space-x-2 sm:space-x-4">
        <Button variant="outline" onClick={() => setIsIncomeModalOpen(true)}>
          Dodaj przychód
        </Button>
        <Button variant="outline" onClick={() => setIsExpenseModalOpen(true)}>
          Dodaj wydatek
        </Button>
      </div>
    </div>
  );
};
