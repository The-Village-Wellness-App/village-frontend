import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('App routing', () => {
  it('renders home page at /', async () => {
    renderWithRouter(<App />);
    expect(await screen.findByText('Hello World')).toBeTruthy();
  });

  it('renders login page at /login', async () => {
    window.history.pushState({}, '', '/login');
    renderWithRouter(<App />);
    expect(await screen.findByLabelText('Email')).toBeTruthy();
  });
});
