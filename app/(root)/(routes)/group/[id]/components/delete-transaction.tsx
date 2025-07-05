import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

import { handleApiDeleteRoute } from '@/utils/dialogUtils';

import { Dialog } from '@/components/dialog/dialog';

import { useQueryClient } from '@tanstack/react-query';
import { TransactionType } from '@/types/types';

interface DeleteTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  transactionType: TransactionType;
  groupBudgetId: string;
}

export const DeleteTransaction = ({
  isOpen,
  onClose,
  transactionId,
  transactionType,
  groupBudgetId,
}: DeleteTransactionProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    if (isLoading) return;
    setIsLoading(true);

    axios
      .delete(
        handleApiDeleteRoute('group', transactionType, transactionId, groupBudgetId),
      )
      .then((response) => {
        toast.success(`${response.data}`);
        queryClient.invalidateQueries({ queryKey: ['groupExpenses'] });
        queryClient.invalidateQueries({ queryKey: ['groupIncomes'] });
        onClose();
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
      open={isOpen}
      onOpenChange={onClose}
      isLoading={isLoading}
      title="Potwierdzenie operacji"
      description="Czy na pewno chcesz usunąć tę pozycję? Ta operacja jest nieodwracalna i spowoduje trwałe usunięcie danych."
      handleDialog={handleDelete}
      actionText="Usuń"
    />
  );
};
