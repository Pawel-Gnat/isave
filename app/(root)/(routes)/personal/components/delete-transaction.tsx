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
}

export const DeleteTransaction = ({
  isOpen,
  onClose,
  transactionId,
  transactionType,
}: DeleteTransactionProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['personalBudget'] });
  };

  const handleDelete = () => {
    if (isLoading) return;

    axios
      .delete(handleApiDeleteRoute('personal', transactionType, transactionId, ''))
      .then((response) => {
        toast.success(`${response.data}`);
        handleRefetch();
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
