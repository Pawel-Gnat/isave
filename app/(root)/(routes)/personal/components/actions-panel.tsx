import { DatePicker } from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';

export const ActionsPanel = () => {
  return (
    <div className="mb-4 flex flex-row justify-between">
      <DatePicker />
      <div className="space-x-4">
        <Button variant="outline">Dodaj przychód</Button>
        <Button variant="outline">Dodaj wydatek</Button>
      </div>
    </div>
  );
};
