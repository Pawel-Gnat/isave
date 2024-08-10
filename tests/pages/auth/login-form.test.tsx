import { beforeEach, describe, expect, it, vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

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

describe('Login form component', () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  it('should render login form', () => {
    const emailInput = screen.getByRole('textbox', { name: 'Email' });
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

  it('should redirect to homepage and display toast', async () => {
    const push = vi.fn();
    (useRouter as Mock).mockReturnValue({ push });
    (signIn as Mock).mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    const emailInput = screen.getByRole('textbox', { name: 'Email' });
    const passwordInput = screen.getByLabelText('Hasło', { selector: 'input' });
    const loginButton = screen.getByRole('button', { name: 'Zaloguj się' });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'testpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@test.com',
        password: 'testpassword',
      });
      expect(push).toHaveBeenCalledWith('/');
      expect(toast.success).toHaveBeenCalledWith('Pomyślnie zalogowano');
    });
  });
});
