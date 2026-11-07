
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Mood from '../pages/mood-page';

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn();
});

const renderWithRouter = (ui) => render(
  <BrowserRouter>{ui}</BrowserRouter>,
);

const mockEmptyMoodsResponse = () => {
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: [] }),
    headers: new Map([['content-type', 'application/json']]),
  });
};

describe('MoodPage', () => {
  it('renders the mood tracking heading', async () => {
    mockEmptyMoodsResponse();

    renderWithRouter(<Mood />);

    expect(
      await screen.findByRole('heading', { name: 'Mood Tracking' }),
    ).toBeTruthy();
  });

  it('shows the loading spinner initially', () => {
    // Keep the request pending so the component remains in its loading state.
    globalThis.fetch.mockReturnValue(new Promise(() => {}));

    renderWithRouter(<Mood />);

    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('shows a message when there are no mood entries', async () => {
    mockEmptyMoodsResponse();

    renderWithRouter(<Mood />);

    expect(
      await screen.findByText('No mood entries yet. Add one above.'),
    ).toBeTruthy();
  });

  it('starts the mood slider at 1', async () => {
    mockEmptyMoodsResponse();

    renderWithRouter(<Mood />);

    expect(await screen.findByText('Mood Value: 1/10')).toBeTruthy();

    const slider = screen.getByRole('slider');

    expect(slider.getAttribute('aria-valuemin')).toBe('1');
    expect(slider.getAttribute('aria-valuemax')).toBe('10');
    expect(slider.getAttribute('aria-valuenow')).toBe('1');
  });

  it('displays the Save Mood Entry button', async () => {
    mockEmptyMoodsResponse();

    renderWithRouter(<Mood />);

    expect(
      await screen.findByRole('button', { name: /save mood entry/i }),
    ).toBeTruthy();
  });
});
