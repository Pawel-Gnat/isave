import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';

import { initialState, TransactionsContextProps } from '@/contexts/transactions-context';

import { ModifiedPersonalExpense } from '@/types/types';
import { hash } from 'crypto';

export const renderWithQueryClient = (children: ReactElement) => {
  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export const mockedTransactionsContext: TransactionsContextProps = {
  ...initialState,
  dispatch: vi.fn(),
  setUserId: vi.fn(),
  userId: 'test-user-id',
};

export const mockedPersonalExpenses: ModifiedPersonalExpense[] = [
  {
    id: '1',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    date: new Date('2023-01-01T00:00:00.000Z'),
    value: -500,
    transactions: [
      {
        id: '1a',
        title: 'Groceries',
        value: 100,
        categoryId: 'cat1',
      },
      {
        id: '1b',
        title: 'Utilities',
        value: 150,
        categoryId: 'cat2',
      },
      {
        id: '1c',
        title: 'Transport',
        value: 50,
        categoryId: 'cat3',
      },
    ],
    userId: 'user1',
  },
  {
    id: '2',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    date: new Date('2023-01-01T00:00:00.000Z'),
    value: -500,
    transactions: [
      {
        id: '1a',
        title: 'Groceries',
        value: 100,
        categoryId: 'cat1',
      },
      {
        id: '1b',
        title: 'Utilities',
        value: 150,
        categoryId: 'cat2',
      },
      {
        id: '1c',
        title: 'Transport',
        value: 50,
        categoryId: 'cat3',
      },
    ],
    userId: 'user1',
  },
  {
    id: '3',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    date: new Date('2023-01-01T00:00:00.000Z'),
    value: -500,
    transactions: [
      {
        id: '1a',
        title: 'Groceries',
        value: 100,
        categoryId: 'cat1',
      },
      {
        id: '1b',
        title: 'Utilities',
        value: 150,
        categoryId: 'cat2',
      },
      {
        id: '1c',
        title: 'Transport',
        value: 50,
        categoryId: 'cat3',
      },
    ],
    userId: 'user1',
  },
  {
    id: '4',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    date: new Date('2023-01-01T00:00:00.000Z'),
    value: -500,
    transactions: [
      {
        id: '1a',
        title: 'Groceries',
        value: 100,
        categoryId: 'cat1',
      },
      {
        id: '1b',
        title: 'Utilities',
        value: 150,
        categoryId: 'cat2',
      },
      {
        id: '1c',
        title: 'Transport',
        value: 50,
        categoryId: 'cat3',
      },
    ],
    userId: 'user1',
  },
  {
    id: '5',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    date: new Date('2023-01-01T00:00:00.000Z'),
    value: -500,
    transactions: [
      {
        id: '1a',
        title: 'Groceries',
        value: 100,
        categoryId: 'cat1',
      },
      {
        id: '1b',
        title: 'Utilities',
        value: 150,
        categoryId: 'cat2',
      },
      {
        id: '1c',
        title: 'Transport',
        value: 50,
        categoryId: 'cat3',
      },
    ],
    userId: 'user1',
  },
  {
    id: '6',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    date: new Date('2023-01-01T00:00:00.000Z'),
    value: -500,
    transactions: [
      {
        id: '1a',
        title: 'Groceries',
        value: 100,
        categoryId: 'cat1',
      },
      {
        id: '1b',
        title: 'Utilities',
        value: 150,
        categoryId: 'cat2',
      },
      {
        id: '1c',
        title: 'Transport',
        value: 50,
        categoryId: 'cat3',
      },
    ],
    userId: 'user1',
  },
];

export const mockNotifications = [
  {
    id: 'notif-1',
    createdAt: new Date('2023-08-01T10:00:00Z'),
    updatedAt: new Date('2023-08-01T10:00:00Z'),
    groupBudgetId: 'budget-1',
    userId: 'user-1',
    groupBudget: {
      id: 'budget-1',
      name: 'Family Budget',
      ownerId: 'user-1',
      createdAt: new Date('2023-08-01T10:00:00Z'),
      updatedAt: new Date('2023-08-01T10:00:00Z'),
    },
    owner: {
      id: 'user-1',
      inviteId: 'invite-1',
      name: 'Test user1',
      email: 'test.user1@test.com',
      emailVerified: true,
      hashedPassword: 'hashed-password-1',
      createdAt: new Date('2023-08-01T10:00:00Z'),
      updatedAt: new Date('2023-08-01T10:00:00Z'),
      apiCallLimit: 10,
      lastApiCall: new Date('2023-08-01T10:00:00Z'),
    },
  },
  {
    id: 'notif-2',
    createdAt: new Date('2023-08-02T12:00:00Z'),
    updatedAt: new Date('2023-08-02T12:00:00Z'),
    groupBudgetId: 'budget-2',
    userId: 'user-2',
    groupBudget: {
      id: 'budget-2',
      name: 'Project Budget',
      ownerId: 'user-2',
      createdAt: new Date('2023-08-02T12:00:00Z'),
      updatedAt: new Date('2023-08-02T12:00:00Z'),
    },
    owner: {
      id: 'user-2',
      inviteId: 'invite-2',
      name: 'Test user2',
      email: 'test.user2@test.com',
      emailVerified: true,
      hashedPassword: 'hashed-password-2',
      createdAt: new Date('2023-08-01T10:00:00Z'),
      updatedAt: new Date('2023-08-01T10:00:00Z'),
      apiCallLimit: 10,
      lastApiCall: new Date('2023-08-01T10:00:00Z'),
    },
  },
];
