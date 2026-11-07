import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  it('renders the welcome text', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText('WELCOME!')).toBeTruthy();
  });

  it('renders the current navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Mood' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Pain' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Events' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Graphs & Reports' })).toBeTruthy();
  });
});