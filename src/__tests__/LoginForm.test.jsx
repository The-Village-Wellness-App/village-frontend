import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it('renders the submit button', () => {
    render(<LoginForm />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy();
  });

  it('calls onSwitchToRegister when the register link is clicked', async () => {
    const onSwitch = vi.fn();
    render(<LoginForm onSwitchToRegister={onSwitch} />);

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(onSwitch).toHaveBeenCalled();
  });

  it('calls onForgotPassword when the forgot password link is clicked', async () => {
    const onForgot = vi.fn();
    render(<LoginForm onForgotPassword={onForgot} />);

    await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));

    expect(onForgot).toHaveBeenCalled();
  });

  it('updates the email field when the user types', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });
});