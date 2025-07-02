'use client';

import { ActionsPanel } from '@/components/shared/actions-panel';
import { Heading } from '@/components/shared/heading';

import { Transactions } from './components/transactions';
import { useState } from 'react';
import { IncomeModal } from './components/income-modal';
import { ExpenseModal } from './components/expense-modal';
import { TransactionType } from '@/types/types';
import { DeleteTransaction } from './components/delete-transaction';

const PersonalPage = () => {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType>(null);

  console.log(transactionType);
  console.log(transactionId);

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
      <Heading text="Transakcje osobiste" />
      <ActionsPanel
        setIsIncomeModalOpen={setIsIncomeModalOpen}
        setIsExpenseModalOpen={setIsExpenseModalOpen}
      />
      <Transactions
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
      <IncomeModal
        isModalOpen={isIncomeModalOpen}
        closeModal={handleCloseIncomeModal}
        transactionId={transactionId}
      />
      <ExpenseModal
        isModalOpen={isExpenseModalOpen}
        closeModal={handleCloseExpenseModal}
        transactionId={transactionId}
      />
      <DeleteTransaction
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        transactionId={transactionId}
        transactionType={transactionType}
      />
    </>
  );
};

export default PersonalPage;
