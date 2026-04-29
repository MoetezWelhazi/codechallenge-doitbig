import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getByLabelText(/smart text recipe/i)).toBeInTheDocument();
    expect(screen.getByText(/hello, maya\. you are 28 years old\./i)).toBeInTheDocument();
    expect(screen.getByText(/maya is an adult visitor\./i)).toBeInTheDocument();
  });

  it('updates the smart text preview when answers change', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Nora');
    await user.clear(screen.getByRole('spinbutton', { name: /^age$/i }));
    await user.type(screen.getByRole('spinbutton', { name: /^age$/i }), '34');

    expect(screen.getByText(/hello, nora\. you are 34 years old\./i)).toBeInTheDocument();
    expect(screen.getByText(/nora is an adult visitor\./i)).toBeInTheDocument();
  });

  it('hides the text when the age answer does not meet the show-when control', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByRole('spinbutton', { name: /^age$/i }));
    await user.type(screen.getByRole('spinbutton', { name: /^age$/i }), '16');

    expect(screen.queryByText(/hello, maya\. you are 16 years old\./i)).not.toBeInTheDocument();
    expect(screen.getByText(/this text is hidden right now/i)).toBeInTheDocument();
    expect(screen.getByText(/maya is a younger visitor\./i)).toBeInTheDocument();
  });

  it('updates visibility when the minimum age changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText(/minimum age/i));
    await user.type(screen.getByLabelText(/minimum age/i), '30');

    expect(screen.getByText(/this text is hidden right now/i)).toBeInTheDocument();
  });
});
