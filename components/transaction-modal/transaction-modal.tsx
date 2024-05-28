'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

import { TransactionModalContext } from '@/context/transaction-modal-context';

import { createTransaction } from '@/utils/createTransaction';
import { getContent, getDescription, getTitle } from '@/utils/transactionModalUtils';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { LoadingButton } from '@/components/shared/loading-button';

import { Modal } from '@/components/shared/modal';

import { TransactionTableModal } from './transaction-table-modal';
import { TransactionDatePicker } from './transaction-date-picker';

import { TransactionValues } from '@/types/types';

export const TransactionModal = () => {
  const {
    showTransactionModal,
    setShowTransactionModal,
    transactionType,
    isLoading,
    setIsLoading,
    isEditing,
  } = useContext(TransactionModalContext);

  return (
    <Dialog
      open={showTransactionModal}
      onOpenChange={() => setShowTransactionModal(false)}
    >
      <DialogContent className="flex max-h-[75%] min-h-[60%] min-w-[50%] max-w-[75%] flex-col">
        <DialogHeader>
          <DialogTitle>{getTitle(transactionType, isEditing)}</DialogTitle>
          <DialogDescription>
            {getDescription(transactionType, isEditing)}
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-1 justify-center overflow-auto">
          {getContent(transactionType, isEditing)}
        </div>
        <DialogFooter className="flex gap-2 sm:justify-between">
          {getFooter(transactionType)}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
