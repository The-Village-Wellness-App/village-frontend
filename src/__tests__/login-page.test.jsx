import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/login-page';
import { ThemeProviderWrapper } from '../contexts/ThemeContext';

const renderWithProviders = (ui) => render(
  <ThemeProviderWrapper>
    <BrowserRouter>{ui}</BrowserRouter>
  </ThemeProviderWrapper>,
);

describe('LoginPage', () => {
  it('renders the login form by default', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy();
  });

  it('switches to the register form', async () => {
    renderWithProviders(<LoginPage />);

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByLabelText(/username/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy();
  });

  it('switches to the forgot password form', async () => {
    renderWithProviders(<LoginPage />);

    await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));

    expect(screen.getByLabelText(/email/i)).toBeTruthy();
  });

  it('shows an error when submitting an empty login form', async () => {
    renderWithProviders(<LoginPage />);

    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Email and password are required.')).toBeTruthy();
  });
});