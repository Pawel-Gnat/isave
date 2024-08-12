import { mockedGroupExpenses } from '@/tests/mocks/mocks';

import { describe, expect, it, vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import useGroupExpenses from '@/hooks/useGroupExpenses';
import useGroupIncomes from '@/hooks/useGroupIncomes';

import { Transactions } from '@/app/(root)/(routes)/group/[id]/components/transactions';

vi.mock('@/hooks/useGroupExpenses');
vi.mock('@/hooks/useGroupIncomes');

describe('Group transactions component', () => {
  it('renders the table with data', async () => {
    (useGroupExpenses as Mock).mockReturnValue({
      groupExpenses: mockedGroupExpenses,
      isgroupExpensesLoading: false,
    });

    (useGroupIncomes as Mock).mockReturnValue({
      groupIncomes: [],
      isgroupIncomesLoading: false,
    });

    render(<Transactions userId="user1" id="1" />);

    await waitFor(() => {
      expect(screen.getAllByText('Wydatek')).toHaveLength(2);
    });
  });

  it('renders empty state when no transactions are available', async () => {
    (useGroupExpenses as Mock).mockReturnValue({
      groupExpenses: [],
      isgroupExpensesLoading: false,
    });

    (useGroupIncomes as Mock).mockReturnValue({
      groupIncomes: [],
      isgroupIncomesLoading: false,
    });

    render(<Transactions userId="user1" id="1" />);

    await waitFor(() => {
      expect(
        screen.getByText('Brak transakcji dla wybranego okresu'),
      ).toBeInTheDocument();
    });
  });
});
