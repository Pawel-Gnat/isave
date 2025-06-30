'use client';

import { ActionsPanel } from '@/components/shared/actions-panel';
import { Heading } from '@/components/shared/heading';

import { Transactions } from './components/transactions';
import { useState } from 'react';
import { IncomeModal } from './components/income-modal';
import { ExpenseModal } from './components/expense-modal';
import { TransactionType } from '@/types/types';

const PersonalPage = () => {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState<string>('');

  const handleEditTransaction = (
    transactionId: string,
    transactionType: TransactionType,
  ) => {
    setEditTransactionId(transactionId);

    if (transactionType === 'income') {
      setIsIncomeModalOpen(true);
    } else {
      setIsExpenseModalOpen(true);
    }
  };

  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setEditTransactionId('');
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalOpen(false);
    setEditTransactionId('');
  };

  return (
    <>
      <Heading text="Transakcje osobiste" />
      <ActionsPanel
        setIsIncomeModalOpen={setIsIncomeModalOpen}
        setIsExpenseModalOpen={setIsExpenseModalOpen}
      />
      <Transactions onEditTransaction={handleEditTransaction} />
      <IncomeModal
        isModalOpen={isIncomeModalOpen}
        closeModal={handleCloseIncomeModal}
        editTransactionId={editTransactionId}
      />
      <ExpenseModal
        isModalOpen={isExpenseModalOpen}
        closeModal={handleCloseExpenseModal}
        editTransactionId={editTransactionId}
      />
    </>
  );
};

export default PersonalPage;
