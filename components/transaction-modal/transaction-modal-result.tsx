import { FC } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { expenseCategories } from '@/lib/transactionCategories';

import { Expense } from '@/types/types';

interface TransactionModalResultProps {
  date: Date;
  expenses: Expense[];
}

export const TransactionModalResult: FC<TransactionModalResultProps> = ({
  date,
  expenses,
}) => {
  return (
    <div className="m-auto">
      <ol className="mb-4 list-inside list-decimal space-y-2">
        {expenses.map((expense) => (
          <li key={expense.id}>
            <span className="font-medium">{expense.title}</span>{' '}
            <span>
              (
              {
                expenseCategories.find((category) => category.id === expense.categoryId)
                  ?.name
              }
              )
            </span>{' '}
            - <span>{expense.value} zł</span>
          </li>
        ))}
      </ol>
      <hr />
      <div className="mt-2 flex flex-row justify-between gap-4">
        <p className="font-medium">{format(date, 'PPP', { locale: pl })}</p>{' '}
        <p>
          Suma:{' '}
          <span className="font-medium">
            {expenses.reduce((acc, expense) => acc + expense.value, 0).toFixed(2)} zł
          </span>
        </p>
      </div>
    </div>
  );
};
