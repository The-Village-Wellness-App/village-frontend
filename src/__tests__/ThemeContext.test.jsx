import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProviderWrapper, useThemeContext } from '../contexts/ThemeContext';

const TestConsumer = () => {
  const { mode, updateTheme } = useThemeContext();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={() => updateTheme('dark')}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('provides default light mode', async () => {
    render(
      <ThemeProviderWrapper>
        <TestConsumer />
      </ThemeProviderWrapper>,
    );
    expect(await screen.findByTestId('mode')).toBeTruthy();
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('can switch theme mode', async () => {
    render(
      <ThemeProviderWrapper>
        <TestConsumer />
      </ThemeProviderWrapper>,
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});
