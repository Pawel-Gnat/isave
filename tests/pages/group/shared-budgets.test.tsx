import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';

import useGroupBudgets from '@/hooks/useGroupBudgets';

import { SharedBudgets } from '@/app/(root)/(routes)/group/components/shared-budgets';

import { mockedGroupBudgets } from '@/tests/mocks/mocks';

vi.mock('@/hooks/useGroupBudgets');

describe('SharedBudgets Component', () => {
  it('renders the budget list when data is loaded', () => {
    (useGroupBudgets as Mock).mockReturnValue({
      groupBudgets: mockedGroupBudgets,
      isGroupBudgetsLoading: false,
    });

    render(<SharedBudgets userId="owner1" />);

    mockedGroupBudgets.forEach((budget) => {
      expect(screen.getByText(budget.name)).toBeInTheDocument();
    });
  });

  it('renders empty state when there are no budgets', async () => {
    (useGroupBudgets as Mock).mockReturnValue({
      groupBudgets: [],
      isGroupBudgetsLoading: false,
    });

    render(<SharedBudgets userId="owner1" />);

    await waitFor(() => {
      expect(screen.getByText('Brak budżetów')).toBeInTheDocument();
    });
  });
});
