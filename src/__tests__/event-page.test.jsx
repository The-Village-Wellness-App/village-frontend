
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Event from '../pages/event-page';

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn();
});

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>,
  );
};

const mockEmptyEventsResponse = () => {
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ events: [] }),
    headers: new Map([
      ['content-type', 'application/json'],
    ]),
  });
};

describe('EventPage', () => {
  it('renders the events heading', async () => {
    mockEmptyEventsResponse();

    renderWithRouter(<Event />);

    expect(
      await screen.findByRole('heading', { name: 'Events' }),
    ).toBeTruthy();
  });

  it('shows a message when there are no events', async () => {
    mockEmptyEventsResponse();

    renderWithRouter(<Event />);

    expect(
      await screen.findByText('No events yet. Create one above!'),
    ).toBeTruthy();
  });

  it('validates that the title is required on submit', async () => {
    mockEmptyEventsResponse();

    const user = userEvent.setup();

    renderWithRouter(<Event />);

    const submitButton = await screen.findByRole('button', {
      name: /create event/i,
    });

    await user.click(submitButton);

    expect(
      await screen.findByText('Title is required'),
    ).toBeTruthy();
  });

  it('renders the category select with its available options', async () => {
    mockEmptyEventsResponse();

    const user = userEvent.setup();

    renderWithRouter(<Event />);

    const categorySelect = await screen.findByLabelText('Category');

    expect(categorySelect).toBeTruthy();

    await user.click(categorySelect);

    expect(
      await screen.findByRole('option', { name: 'Medication' }),
    ).toBeTruthy();

    expect(
      screen.getByRole('option', { name: 'Therapy' }),
    ).toBeTruthy();
  });
});
