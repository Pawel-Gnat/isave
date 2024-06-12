'use client';

import { useContext } from 'react';

import { AlertContext } from '@/contexts/alert-context';

import { Button } from '@/components/ui/button';

export const BudgetsPanel = () => {
  const { dispatch } = useContext(AlertContext);

  return (
    <div className="mb-4 ml-auto flex">
      <Button
        variant="outline"
        onClick={() => dispatch({ type: 'SET_SHOW_CREATE_BUDGET' })}
      >
        Stwórz grupowy budżet
      </Button>
    </div>
  );
};
