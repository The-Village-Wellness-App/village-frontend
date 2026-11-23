
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Pain from '../pages/pain-page';

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn();
});

const renderWithProviders = (ui) => render(
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {ui}
    </LocalizationProvider>
  </BrowserRouter>,
);

const mockEmptyPainsResponse = () => {
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: [] }),
    headers: new Map([['content-type', 'application/json']]),
  });
};

describe('PainPage', () => {
  it('renders the pain tracking heading', async () => {
    mockEmptyPainsResponse();

    renderWithProviders(<Pain />);

    expect(
      await screen.findByRole('heading', { name: 'Pain Tracking' }),
    ).toBeTruthy();
  });

  it('shows a message when there are no pain entries', async () => {
    mockEmptyPainsResponse();

    renderWithProviders(<Pain />);

    expect(
      await screen.findByText('No pain entries yet. Add one above.'),
    ).toBeTruthy();
  });

  it('starts the pain slider at 1', async () => {
    mockEmptyPainsResponse();

    renderWithProviders(<Pain />);

    expect(await screen.findByText('Pain Value: 1/10')).toBeTruthy();

    const slider = screen.getByRole('slider');

    expect(slider.getAttribute('aria-valuemin')).toBe('1');
    expect(slider.getAttribute('aria-valuemax')).toBe('10');
    expect(slider.getAttribute('aria-valuenow')).toBe('1');
  });

  it('renders the location select with its available options', async () => {
    mockEmptyPainsResponse();

    const user = userEvent.setup();

    renderWithProviders(<Pain />);

    const select = await screen.findByRole('combobox', {
      name: 'Location',
    });

    expect(select).toBeTruthy();

    // Open the Material UI dropdown to display its options.
    await user.click(select);

    expect(
      await screen.findByRole('option', { name: 'Head' }),
    ).toBeTruthy();

    expect(
      screen.getByRole('option', { name: 'Back' }),
    ).toBeTruthy();

    expect(
      screen.getByRole('option', { name: 'Neck' }),
    ).toBeTruthy();
  });
});
