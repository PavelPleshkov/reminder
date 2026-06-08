import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { db } from '../data/db';
import { resetTestDatabase } from '../test/dbTestUtils';
import { DexieJournalRepository } from '../data/repositories/DexieJournalRepository';

const repo = new DexieJournalRepository();

async function openForm() {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/journal']}>
      <App />
    </MemoryRouter>,
  );
  await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: /create entry/i }));
  return user;
}

describe('validation on save', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await db.meta.put({ key: 'hasSeeded', value: true });
  });

  it('rejects 101 character description', async () => {
    const user = await openForm();
    const longDesc = 'a'.repeat(101);
    await user.clear(screen.getByLabelText('Description'));
    await user.type(screen.getByLabelText('Description'), longDesc);
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await waitFor(() => {
      expect(screen.getByText(/100 characters/i)).toBeInTheDocument();
    });
    expect(await repo.countActive()).toBe(0);
  });

  it('rejects zero works', async () => {
    const user = await openForm();
    await user.click(screen.getByRole('button', { name: /remove/i }));
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least one work/i)).toBeInTheDocument();
    });
    expect(await repo.countActive()).toBe(0);
  });

  it('rejects missing mileage target', async () => {
    const user = await openForm();
    await user.type(screen.getByLabelText('Description'), 'Valid desc');
    await user.clear(screen.getByLabelText('Target odometer (km)'));
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await waitFor(() => {
      expect(screen.getByText(/Enter a target odometer for mileage reminders/i)).toBeInTheDocument();
    });
    expect(await repo.countActive()).toBe(0);
  });

  it('rejects whitespace-only description', async () => {
    const user = await openForm();
    await user.clear(screen.getByLabelText('Description'));
    await user.type(screen.getByLabelText('Description'), '   ');
    await user.type(screen.getByLabelText('Target odometer (km)'), '50000');
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await waitFor(() => {
      expect(screen.getByText(/Description must be/i)).toBeInTheDocument();
    });
    expect(await repo.countActive()).toBe(0);
  });

  it('rejects negative cost', async () => {
    const user = await openForm();
    await user.type(screen.getByLabelText('Description'), 'Valid work');
    await user.type(screen.getByLabelText('Target odometer (km)'), '50000');
    const costInput = screen.getByLabelText('Cost (optional)');
    await user.clear(costInput);
    await user.type(costInput, '-10');
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await waitFor(() => {
      expect(screen.getByText(/Cost must be zero or greater/i)).toBeInTheDocument();
    });
    expect(await repo.countActive()).toBe(0);
  });

  it('applies General label when none selected', async () => {
    const user = await openForm();
    await user.type(screen.getByLabelText('Description'), 'No label work');
    await user.type(screen.getByLabelText('Target odometer (km)'), '55000');
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await waitFor(() => {
      const entry = screen.getByRole('article');
      expect(within(entry).getByText('No label work')).toBeInTheDocument();
      expect(within(entry).getByText('General')).toBeInTheDocument();
    });
  });
});
