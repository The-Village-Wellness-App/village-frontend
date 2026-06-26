import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  it('renders welcome text', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
    expect(screen.getByText('WELCOME!')).toBeTruthy();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Mood')).toBeTruthy();
    expect(screen.getByText('Pain')).toBeTruthy();
    expect(screen.getByText('Events')).toBeTruthy();
    expect(screen.getByText('Graphs & Reports')).toBeTruthy();
  });
});
