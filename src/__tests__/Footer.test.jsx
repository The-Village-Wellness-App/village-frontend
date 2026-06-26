import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders author links', () => {
    render(<Footer />);
    expect(screen.getByText('WhiteHotThrash')).toBeTruthy();
    expect(screen.getByText('✨BeeGeeEss✨')).toBeTruthy();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`| © ${year}`)).toBeTruthy();
  });
});
