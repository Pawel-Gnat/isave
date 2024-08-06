import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from '@/app/(auth)/(routes)/auth/components/login-form';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  it('should render login form', () => {
    const emailInput = screen.getByLabelText('Email', { selector: 'input' });
    const passwordInput = screen.getByLabelText('Hasło', { selector: 'input' });
    const loginButton = screen.getByRole('button', { name: 'Zaloguj się' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('should render error messages', async () => {
    const user = userEvent.setup();
    const loginButton = screen.getByRole('button', { name: 'Zaloguj się' });

    await user.click(loginButton);

    expect(screen.getByText('Zweryfikuj adres email')).toBeInTheDocument();
    expect(screen.getByText('Wpisz hasło do konta')).toBeInTheDocument();
  });
});
