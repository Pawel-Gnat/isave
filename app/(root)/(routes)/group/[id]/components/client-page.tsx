'use client';

import { ActionsPanel } from '@/components/shared/actions-panel';
import { Heading } from '@/components/shared/heading';

import { Transactions } from './transactions';

import { GroupBudget } from '@prisma/client';
import { TransactionType } from '@/types/types';
import { useState } from 'react';
import { IncomeModal } from './income-modal';
import { ExpenseModal } from './expense-modal';
import { DeleteTransaction } from './delete-transaction';

interface ClientSharedBudgetPageProps {
  id: string;
  userId: string;
  currentBudget: GroupBudget;
}

const ClientSharedBudgetPage = ({
  id,
  userId,
  currentBudget,
}: ClientSharedBudgetPageProps) => {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType>(null);

  const handleEditTransaction = (
    transactionId: string,
    transactionType: TransactionType,
  ) => {
    setTransactionId(transactionId);

    if (transactionType === 'income') {
      setIsIncomeModalOpen(true);
    } else {
      setIsExpenseModalOpen(true);
    }
  };

  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setTransactionId('');
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setTransactionId('');
  };

  const handleDeleteTransaction = (
    transactionId: string,
    transactionType: TransactionType,
  ) => {
    setIsDeleteModalOpen(true);
    setTransactionId(transactionId);
    setTransactionType(transactionType);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionId('');
    setTransactionType(null);
  };

  return (
    <>
      <Heading text={currentBudget.name} />
      <ActionsPanel
        setIsIncomeModalOpen={() => setIsIncomeModalOpen(true)}
        setIsExpenseModalOpen={() => setIsExpenseModalOpen(true)}
      />
      <Transactions
        id={id}
        userId={userId}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
      <IncomeModal
        isModalOpen={isIncomeModalOpen}
        closeModal={handleCloseIncomeModal}
        transactionId={transactionId}
        groupBudgetId={currentBudget.id}
      />
      <ExpenseModal
        isModalOpen={isExpenseModalOpen}
        closeModal={handleCloseExpenseModal}
        transactionId={transactionId}
        groupBudgetId={currentBudget.id}
      />
      <DeleteTransaction
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        transactionId={transactionId}
        transactionType={transactionType}
        groupBudgetId={currentBudget.id}
      />
    </>
  );
};

export default ClientSharedBudgetPage;
