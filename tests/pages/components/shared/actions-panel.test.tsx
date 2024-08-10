import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TransactionsContext } from '@/contexts/transactions-context';

import { ActionsPanel } from '@/components/shared/actions-panel';

import { mockedTransactionsContext } from '@/tests/mocks/mocks';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));
vi.mock('next/navigation');

describe('Actions panel component', () => {
  const renderComponent = () => {
    return render(
      <TransactionsContext.Provider value={mockedTransactionsContext}>
        <ActionsPanel id="" category="personal" />
      </TransactionsContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    renderComponent();
  });

  it('renders date picker component with modal buttons', async () => {
    const addNewExpenseButton = screen.getByRole('button', { name: 'Dodaj wydatek' });
    const addNewIncomeButton = screen.getByRole('button', { name: 'Dodaj przychód' });
    const datePicker = screen.getByTestId('date-picker');

    await waitFor(() => {
      expect(addNewExpenseButton).toBeInTheDocument();
      expect(addNewIncomeButton).toBeInTheDocument();
      expect(datePicker).toBeInTheDocument();
    });
  });

  it('dispatches SET_DATE action when date picker is used', async () => {
    const user = userEvent.setup();
    const datePicker = screen.getByTestId('date-picker');

    await user.click(datePicker);

    const calendarDay1 = screen.getByRole('gridcell', { name: '18' });
    const calendarDay24 = screen.getByRole('gridcell', { name: '19' });

    await user.click(calendarDay1);
    await user.click(calendarDay24);

    expect(mockedTransactionsContext.dispatch).toHaveBeenCalledWith({
      type: 'SET_DATE',
      payload: {
        date: {
          from: new Date('2024-07-31T22:00:00.000Z'),
          to: new Date('2024-08-17T22:00:00.000Z'),
        },
      },
    });
  });

  it('dispatches SET_SHOW_INCOME_MODAL action when add income button is clicked', async () => {
    const user = userEvent.setup();
    const addNewIncomeButton = screen.getByRole('button', { name: 'Dodaj przychód' });

    await user.click(addNewIncomeButton);

    expect(mockedTransactionsContext.dispatch).toHaveBeenCalledWith({
      type: 'SET_SHOW_INCOME_MODAL',
      payload: { groupBudgetId: '', transactionCategory: 'personal' },
    });
  });

  it('dispatches SET_SHOW_EXPENSE_MODAL action when add expense button is clicked', async () => {
    const user = userEvent.setup();
    const addNewExpenseButton = screen.getByRole('button', { name: 'Dodaj wydatek' });

    await user.click(addNewExpenseButton);

    expect(mockedTransactionsContext.dispatch).toHaveBeenCalledWith({
      type: 'SET_SHOW_EXPENSE_MODAL',
      payload: { groupBudgetId: '', transactionCategory: 'personal' },
    });
  });
});
