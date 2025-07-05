'use client';

import { MembersDialog } from './members-dialog';

import { Heading } from '@/components/shared/heading';

import { SharedBudgets } from './shared-budgets';
import { BudgetsPanel } from './budgets-panel';
import { useState } from 'react';
import { NewBudgetModal } from './new-budget-modal';
import { DeleteBudget } from './delete-budget';

interface ClientGroupPageProps {
  userId: string;
}

type Action = 'add' | 'remove' | null;

export interface MembersInitialState {
  isMembersDialogOpen: boolean;
  action: Action;
  groupBudgetId: string;
}

const MEMBERS_INITIAL_STATE: MembersInitialState = {
  isMembersDialogOpen: false,
  action: null,
  groupBudgetId: '',
};

export interface DeleteBudgetInitialState {
  isDeleteBudgetOpen: boolean;
  groupBudgetId: string;
}

const DELETE_BUDGET_INITIAL_STATE: DeleteBudgetInitialState = {
  isDeleteBudgetOpen: false,
  groupBudgetId: '',
};

const ClientGroupPage = ({ userId }: ClientGroupPageProps) => {
  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] =
    useState<MembersInitialState>(MEMBERS_INITIAL_STATE);
  const [isDeleteBudgetOpen, setIsDeleteBudgetOpen] = useState<DeleteBudgetInitialState>(
    DELETE_BUDGET_INITIAL_STATE,
  );

  return (
    <>
      <Heading text="Transakcje grupowe" />
      <BudgetsPanel setIsNewBudgetModalOpen={setIsNewBudgetModalOpen} />
      <SharedBudgets
        userId={userId}
        setIsMembersDialogOpen={setIsMembersDialogOpen}
        setIsDeleteBudgetOpen={setIsDeleteBudgetOpen}
      />
      <NewBudgetModal isOpen={isNewBudgetModalOpen} setIsOpen={setIsNewBudgetModalOpen} />
      <MembersDialog isOpen={isMembersDialogOpen} setIsOpen={setIsMembersDialogOpen} />
      <DeleteBudget isOpen={isDeleteBudgetOpen} setIsOpen={setIsDeleteBudgetOpen} />
    </>
  );
};

export default ClientGroupPage;
