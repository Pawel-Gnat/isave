import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

import { handleApiDeleteRoute } from '@/utils/dialogUtils';

import { Dialog } from '@/components/dialog/dialog';

import { useQueryClient } from '@tanstack/react-query';
import { DeleteBudgetInitialState } from './client-page';

interface DeleteBudgetProps {
  isOpen: DeleteBudgetInitialState;
  setIsOpen: (isOpen: DeleteBudgetInitialState) => void;
}

export const DeleteBudget = ({ isOpen, setIsOpen }: DeleteBudgetProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    if (isLoading) return;
    setIsLoading(true);

    axios
      .delete(handleApiDeleteRoute('group', null, '', isOpen.groupBudgetId))
      .then((response) => {
        toast.success(`${response.data}`);
        queryClient.invalidateQueries({ queryKey: ['groupBudgets'] });
        setIsOpen({ isDeleteBudgetOpen: false, groupBudgetId: '' });
      })
      .catch((error) => {
        toast.error(`${error.response.data.error}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog
      open={isOpen.isDeleteBudgetOpen}
      onOpenChange={() => setIsOpen({ isDeleteBudgetOpen: false, groupBudgetId: '' })}
      isLoading={isLoading}
      title="Potwierdzenie operacji"
      description="Czy na pewno chcesz usunąć ten budżet? Ta operacja jest nieodwracalna i spowoduje trwałe usunięcie danych."
      handleDialog={handleDelete}
      actionText="Usuń"
    />
  );
};
