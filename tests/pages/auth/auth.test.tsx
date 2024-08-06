import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AuthPage from '@/app/(auth)/(routes)/auth/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    render(<AuthPage />);
  });

  it('should render login card', () => {
    const loginFormHeading = screen.getByRole('heading', {
      name: 'Zaloguj się na swoje konto.',
    });
    const loginFormDescription = screen.getByText(
      'Podaj swój adres email i hasło, aby się zalogować.',
    );

    const createAccountButton = screen.getByRole('button', {
      name: 'Utwórz konto',
    });

    expect(loginFormHeading).toBeInTheDocument();
    expect(loginFormDescription).toBeInTheDocument();
    expect(createAccountButton).toBeInTheDocument();
  });

  it('should render register card', async () => {
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
    const loginButton = screen.getByRole('button', {
      name: 'Zaloguj się',
    });

    expect(registerFormHeading).toBeInTheDocument();
    expect(registerFormDescription).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
