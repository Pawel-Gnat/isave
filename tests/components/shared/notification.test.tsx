import { describe, expect, it, vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import axios from 'axios';

import useNotifications from '@/hooks/useNotifications';
import useGroupBudgets from '@/hooks/useGroupBudgets';

import { Notification } from '@/components/shared/notification';

import { mockedTransactionsContext, mockNotifications } from '@/tests/mocks/mocks';

vi.mock('axios');
vi.mock('@/hooks/useNotifications');
vi.mock('@/hooks/useGroupBudgets');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Notification component', () => {
  it('handles the accept button click', async () => {
    const postMock = vi
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: 'Zaakceptowano zaproszenie' });
    const groupBudgetsRefetch = vi.fn();
    const notificationsRefetch = vi.fn();
    const user = userEvent.setup();

    (useGroupBudgets as Mock).mockReturnValue(groupBudgetsRefetch);
    (useNotifications as Mock).mockReturnValue(notificationsRefetch);

    render(
      <Notification
        notification={mockNotifications[0]}
        userId={mockedTransactionsContext.userId}
      />,
    );

    const acceptButton = screen.getByLabelText('Akceptuj zaproszenie', {
      selector: 'button',
    });

    await user.click(acceptButton);

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith(
        `api/transaction/group/${mockNotifications[0].groupBudgetId}/invitation`,
        {
          userId: mockedTransactionsContext.userId,
        },
      );
      expect(toast.success).toHaveBeenCalledWith('Zaakceptowano zaproszenie');
    });
  });

  it('handles the reject button', async () => {
    const deleteMock = vi.spyOn(axios, 'delete').mockResolvedValue({
      data: 'Odrzucono zaproszenie',
    });
    const notificationsRefetch = vi.fn();
    const user = userEvent.setup();

    (useNotifications as Mock).mockReturnValue(notificationsRefetch);

    render(
      <Notification
        notification={mockNotifications[0]}
        userId={mockedTransactionsContext.userId}
      />,
    );

    const rejectButton = screen.getByLabelText('Odrzuć zaproszenie', {
      selector: 'button',
    });

    await user.click(rejectButton);

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(
        `api/transaction/group/${mockNotifications[0].groupBudgetId}/invitation/${mockedTransactionsContext.userId}`,
      );
      expect(toast.success).toHaveBeenCalledWith('Odrzucono zaproszenie');
    });
  });
});
