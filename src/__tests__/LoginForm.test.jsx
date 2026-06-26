import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });

  it('renders submit button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy();
  });

  it('calls onSwitchToRegister when register link clicked', async () => {
    const onSwitch = vi.fn();
    render(<LoginForm onSwitchToRegister={onSwitch} />);
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(onSwitch).toHaveBeenCalled();
  });

  it('calls onForgotPassword when forgot password link clicked', async () => {
    const onForgot = vi.fn();
    render(<LoginForm onForgotPassword={onForgot} />);
    await userEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(onForgot).toHaveBeenCalled();
  });

  it('updates form state on input change', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    expect(screen.getByLabelText('Email').value).toBe('test@example.com');
  });
});
