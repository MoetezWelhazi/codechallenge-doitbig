import { render, screen, within } from '@testing-library/react';
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
    expect(screen.getByRole('textbox', { name: /^name$/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /^age$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/smart text editor/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /hello, maya\. you are 28 years old\. visitor type: adult visitor\./i,
      ),
    ).toBeInTheDocument();
  });

  it('updates the smart text preview when answers change', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByRole('textbox', { name: /^name$/i }));
    await user.type(screen.getByRole('textbox', { name: /^name$/i }), 'Nora');
    await user.clear(screen.getByRole('spinbutton', { name: /^age$/i }));
    await user.type(screen.getByRole('spinbutton', { name: /^age$/i }), '34');

    expect(
      screen.getByText(
        /hello, nora\. you are 34 years old\. visitor type: adult visitor\./i,
      ),
    ).toBeInTheDocument();
  });

  it('hides the text when the age answer does not meet the show-when control', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByRole('spinbutton', { name: /^age$/i }));
    await user.type(screen.getByRole('spinbutton', { name: /^age$/i }), '16');

    expect(
      screen.queryByText(
        /hello, maya\. you are 16 years old\. visitor type: younger visitor\./i,
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/this text is hidden right now/i)).toBeInTheDocument();
  });

  it('updates visibility when the minimum age changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText(/comparison answer/i));
    await user.type(screen.getByLabelText(/comparison answer/i), '30');

    expect(screen.getByText(/this text is hidden right now/i)).toBeInTheDocument();
  });

  it('exposes the editor controls with plain-language accessible names', () => {
    render(<App />);

    expect(
      screen.getByRole('checkbox', {
        name: /only show when an answer matches a condition/i,
      }),
    ).toBeChecked();
    expect(screen.getByText(/show this text when/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/answer to check/i)).toHaveValue('age');
    expect(screen.getByLabelText(/how to compare/i)).toHaveValue('gte');
    expect(screen.getByLabelText(/comparison answer/i)).toHaveValue(18);
    expect(document.body).not.toHaveTextContent(/{{|}}/);
  });

  it('shows comparison options that match the selected answer type', async () => {
    const user = userEvent.setup();
    render(<App />);

    const answerSelect = screen.getByLabelText(/answer to check/i);
    const comparisonSelect = screen.getByLabelText(/how to compare/i);

    expect(within(comparisonSelect).getByText(/is at least/i)).toBeInTheDocument();
    expect(within(comparisonSelect).getByText(/is at most/i)).toBeInTheDocument();

    await user.selectOptions(answerSelect, 'name');

    expect(comparisonSelect).toHaveValue('notEmpty');
    expect(within(comparisonSelect).getByText(/includes/i)).toBeInTheDocument();
    expect(
      within(comparisonSelect).queryByText(/is at least/i),
    ).not.toBeInTheDocument();
    expect(
      within(comparisonSelect).queryByText(/is at most/i),
    ).not.toBeInTheDocument();
  });

  it('inserts another chip into the smart text when a shelf chip is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole('button', { name: /^age group$/i }));

    const messagePreview = container.querySelector('.message-preview');
    expect(messagePreview).not.toBeNull();
    const matches = messagePreview.textContent.match(/adult visitor/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it('lets users rename form fields without changing the answer connection', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText(/label for name/i));
    await user.type(screen.getByLabelText(/label for name/i), 'First name');

    expect(
      screen.getByRole('textbox', { name: /^first name$/i }),
    ).toHaveValue('Maya');
    expect(
      screen.getByRole('button', { name: /^first name$/i }),
    ).toBeInTheDocument();
  });
});
