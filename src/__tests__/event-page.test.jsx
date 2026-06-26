import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Event from '../pages/event-page';

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn();
});

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('EventPage', () => {
  it('renders events heading', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Event />);
    expect(await screen.findByText('Events')).toBeTruthy();
  });

  it('shows no events message when empty', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Event />);
    expect(await screen.findByText('No events yet. Create one above!')).toBeTruthy();
  });

  it('validates title is required on submit', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Event />);
    const submitBtn = await screen.findByRole('button', { name: /create event/i });
    await userEvent.click(submitBtn);
    expect(screen.getByText('Title is required')).toBeTruthy();
  });

  it('renders category select with options', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
      headers: new Map([['content-type', 'application/json']]),
    });

    renderWithRouter(<Event />);
    const select = await screen.findByLabelText('Category');
    expect(select).toBeTruthy();
    expect(screen.getByText('Medication')).toBeTruthy();
    expect(screen.getByText('Therapy')).toBeTruthy();
  });
});
