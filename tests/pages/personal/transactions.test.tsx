import { mockedPersonalExpenses } from '@/tests/mocks/mocks';

import { describe, expect, it, vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import usePersonalExpenses from '@/hooks/usePersonalExpenses';
import usePersonalIncomes from '@/hooks/usePersonalIncomes';

import { Transactions } from '@/app/(root)/(routes)/personal/components/transactions';

vi.mock('@/hooks/usePersonalExpenses');
vi.mock('@/hooks/usePersonalIncomes');

describe('Transactions component', () => {
  it('renders the table with data', async () => {
    (usePersonalExpenses as Mock).mockReturnValue({
      personalExpenses: mockedPersonalExpenses,
      isPersonalExpensesLoading: false,
    });

    (usePersonalIncomes as Mock).mockReturnValue({
      personalIncomes: [],
      isPersonalIncomesLoading: false,
    });

    render(<Transactions />);

    await waitFor(() => {
      expect(screen.getAllByText('Wydatek')).toHaveLength(6);
    });
  });

  it('renders empty state when no transactions are available', async () => {
    (usePersonalExpenses as Mock).mockReturnValue({
      personalExpenses: [],
      isPersonalExpensesLoading: false,
    });

    (usePersonalIncomes as Mock).mockReturnValue({
      personalIncomes: [],
      isPersonalIncomesLoading: false,
    });

    render(<Transactions />);

    await waitFor(() => {
      expect(
        screen.getByText('Brak transakcji dla wybranego okresu'),
      ).toBeInTheDocument();
    });
  });
});
