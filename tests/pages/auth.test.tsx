import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AuthPage from '@/app/(auth)/(routes)/auth/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    render(<AuthPage />);
  });

  it('should render login form', () => {
    const loginFormHeading = screen.getByRole('heading', {
      name: 'Zaloguj się na swoje konto.',
    });
    const loginFormDescription = screen.getByText(
      'Podaj swój adres email i hasło, aby się zalogować.',
    );
    const emailInput = screen.getByLabelText('Email', { selector: 'input' });
    const passwordInput = screen.getByLabelText('Hasło', { selector: 'input' });
    const loginButton = screen.getByRole('button', { name: 'Zaloguj się' });
    const createAccountButton = screen.getByRole('button', {
      name: 'Utwórz konto',
    });

    expect(loginFormHeading).toBeInTheDocument();
    expect(loginFormDescription).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(createAccountButton).toBeInTheDocument();
  });

  it('should render error messages - login form', async () => {
    const user = userEvent.setup();
    const loginButton = screen.getByRole('button', { name: 'Zaloguj się' });

    await user.click(loginButton);

    expect(screen.getByText('Zweryfikuj adres email')).toBeInTheDocument();
    expect(screen.getByText('Wpisz hasło do konta')).toBeInTheDocument();
  });

  it(`shouldn't render error messages - login form`, () => {
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email', { selector: 'input' });
    const loginButton = screen.getByRole('button', { name: 'Zaloguj się' });

    user.type(emailInput, 'test@test.com');
    user.click(loginButton);

    expect(screen.queryByText('Zweryfikuj adres email')).not.toBeInTheDocument();
  });

  it('should render register form', async () => {
    const user = userEvent.setup();

    const createAccountButton = screen.getByRole('button', {
      name: 'Utwórz konto',
    });

    await user.click(createAccountButton);

    const registerFormHeading = screen.getByRole('heading', {
      name: 'Utwórz swoje konto.',
    });
    const registerFormDescription = screen.getByText(
      'Podaj swoje dane osobiste, adres email i hasło, aby utworzyć konto.',
    );
    const nameInput = screen.getByLabelText('Imię', { selector: 'input' });
    const emailInput = screen.getByLabelText('Email', { selector: 'input' });
    const passwordInput = screen.getByLabelText('Hasło', { selector: 'input' });
    const registerButton = screen.getByRole('button', { name: 'Utwórz konto' });
    const loginButton = screen.getByRole('button', {
      name: 'Zaloguj się',
    });

    expect(registerFormHeading).toBeInTheDocument();
    expect(registerFormDescription).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
