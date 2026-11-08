
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { ThemeProviderWrapper } from '../contexts/ThemeContext';

const renderWithProviders = (ui) => render(
  <ThemeProviderWrapper>
    <BrowserRouter>{ui}</BrowserRouter>
  </ThemeProviderWrapper>,
);

describe('App routing', () => {
  it('renders the home page at /', async () => {
    window.history.pushState({}, '', '/');

    renderWithProviders(<App />);

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Hello!' },
        { timeout: 10000 },
      ),
    ).toBeInTheDocument();
  });

  it('renders the login page at /login', async () => {
    window.history.pushState({}, '', '/login');

    renderWithProviders(<App />);

    expect(
      await screen.findByLabelText(/email/i, {}, { timeout: 10000 }),
    ).toBeInTheDocument();
  });
});
