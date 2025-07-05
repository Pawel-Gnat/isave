import { Button } from '@/components/ui/button';

interface BudgetsPanelProps {
  setIsNewBudgetModalOpen: (isOpen: boolean) => void;
}

export const BudgetsPanel = ({ setIsNewBudgetModalOpen }: BudgetsPanelProps) => {
  return (
    <div className="mb-4 flex justify-center sm:ml-auto">
      <Button variant="outline" onClick={() => setIsNewBudgetModalOpen(true)}>
        Stwórz grupowy budżet
      </Button>
    </div>
  );
};
