import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import axios from 'axios';

import RegisterForm from '@/app/(auth)/(routes)/auth/components/register-form';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock('axios');

describe('RegisterForm', () => {
  beforeEach(() => {
    render(<RegisterForm toggleAuthStatus={() => {}} />);
  });

  it('should render register form', () => {
    const nameInput = screen.getByLabelText('Imię', { selector: 'input' });
    const emailInput = screen.getByLabelText('Email', { selector: 'input' });
    const passwordInput = screen.getByLabelText('Hasło', { selector: 'input' });
    const createButton = screen.getByRole('button', { name: 'Utwórz konto' });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
  });

  it('should render error messages', async () => {
    const user = userEvent.setup();
    const createButton = screen.getByRole('button', { name: 'Utwórz konto' });

    await user.click(createButton);

    expect(screen.getByText('Imię musi mieć przynajmniej 3 znaki')).toBeInTheDocument();
    expect(screen.getByText('Zweryfikuj adres email')).toBeInTheDocument();
    expect(screen.getByText('Hasło musi mieć przynajmniej 4 znaki')).toBeInTheDocument();
  });

  it(`shouldn render a toast with activation link sent message`, async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByLabelText('Imię', { selector: 'input' });
    const emailInput = screen.getByLabelText('Email', { selector: 'input' });
    const passwordInput = screen.getByLabelText('Hasło', { selector: 'input' });
    const createButton = screen.getByRole('button', { name: 'Utwórz konto' });

    const apiResponseMsg = 'Wysłano link aktywacyjny';
    axios.post = vi.fn().mockResolvedValue({ data: apiResponseMsg });

    await user.type(nameInput, 'Test');
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'haslo');
    await user.click(createButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(apiResponseMsg);
    });
  });
});
