import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/login-page';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('LoginPage', () => {
  it('renders login form by default', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy();
  });

  it('switches to register form', async () => {
    renderWithRouter(<LoginPage />);
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByLabelText('Username')).toBeTruthy();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeTruthy();
  });

  it('switches to forgot password form', async () => {
    renderWithRouter(<LoginPage />);
    await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
  });

  it('shows error when submitting empty login form', async () => {
    renderWithRouter(<LoginPage />);
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText('Email and password are required.')).toBeTruthy();
  });
});
