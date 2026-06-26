import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Pain from '../pages/pain-page';

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn();
});

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('PainPage', () => {
  it('renders pain tracking heading', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Pain />);
    expect(await screen.findByText('Pain Tracking')).toBeTruthy();
  });

  it('shows no entries message when empty', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Pain />);
    expect(await screen.findByText('No pain entries yet. Add one above.')).toBeTruthy();
  });

  it('validates pain value is required', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Pain />);
    const submitBtn = await screen.findByRole('button', { name: /save pain entry/i });
    await userEvent.click(submitBtn);
    expect(screen.getByText('Pain value is required')).toBeTruthy();
  });

  it('renders location select with options', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Pain />);
    const select = await screen.findByLabelText('Location');
    expect(select).toBeTruthy();
    expect(screen.getByText('Head')).toBeTruthy();
    expect(screen.getByText('Back')).toBeTruthy();
  });
});
