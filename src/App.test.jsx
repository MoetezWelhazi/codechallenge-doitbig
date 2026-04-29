import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders the preview and editor surfaces', () => {
    render(<App />);

    expect(screen.getByLabelText(/prototype workspace/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /visitor form/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /text settings/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /^age$/i })).toBeInTheDocument();
    expect(
      screen.getByText(/hello, welcome to your app/i, {
        selector: '.message-preview',
      }),
    ).toBeInTheDocument();
  });
});
