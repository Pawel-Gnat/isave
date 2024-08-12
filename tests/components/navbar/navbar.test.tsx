import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { signOut } from 'next-auth/react';

import Navbar from '@/components/navbar/navbar';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

describe('Navbar', () => {
  it('renders all navigation links', () => {
    render(<Navbar />);

    const statisticsLink = screen.getByRole('link', { name: 'Statystyki' });
    const personalTransactionsLink = screen.getByRole('link', {
      name: 'Transakcje osobiste',
    });
    const groupTransactionsLink = screen.getByRole('link', {
      name: 'Transakcje grupowe',
    });
    const settingsLink = screen.getByRole('link', { name: 'Ustawienia' });

    expect(statisticsLink).toBeInTheDocument();
    expect(personalTransactionsLink).toBeInTheDocument();
    expect(groupTransactionsLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
  });

  it('renders the logo with correct alt text', () => {
    render(<Navbar />);

    const logo = screen.getByAltText('iSave');

    expect(logo).toBeInTheDocument();
  });

  it('calls signOut when the logout button is clicked', () => {
    render(<Navbar />);

    const logoutButton = screen.getByRole('button', { name: 'Wyloguj się' });

    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
