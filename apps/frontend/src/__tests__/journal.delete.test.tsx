import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { db } from '../data/db';
import { resetTestDatabase } from '../test/dbTestUtils';
import { DexieJournalRepository } from '../data/repositories/DexieJournalRepository';
import { buildFiveEntries } from '../data/seed/demoJournalSeed';

const repo = new DexieJournalRepository();

describe('delete entry with confirmation', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await db.meta.put({ key: 'hasSeeded', value: true });
    for (const e of buildFiveEntries()) await repo.save(e);
  });

  it('removes entry on confirm delete', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/journal']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    const countBefore = await repo.countActive();
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /^delete$/i }));

    await waitFor(async () => {
      expect(await repo.countActive()).toBe(countBefore - 1);
    });
  });

  it('keeps entry on cancel delete', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/journal']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    const countBefore = await repo.countActive();
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(await repo.countActive()).toBe(countBefore);
  });
});
