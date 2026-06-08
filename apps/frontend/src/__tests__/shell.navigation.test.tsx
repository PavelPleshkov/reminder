import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { db } from '../data/db';
import { resetTestDatabase } from '../test/dbTestUtils';
import { DexieJournalRepository } from '../data/repositories/DexieJournalRepository';
import { buildFiveEntries } from '../data/seed/demoJournalSeed';
import { countPendingReminderWorks } from '../domain/pendingReminders';

const repo = new DexieJournalRepository();

describe('app shell navigation', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await db.meta.put({ key: 'hasSeeded', value: true });
    for (const e of buildFiveEntries()) await repo.save(e);
  });

  it('navigates to Journal with two-column layout', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    await user.click(screen.getByRole('link', { name: /journal/i }));
    expect(screen.getByRole('heading', { name: /journal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/category filters/i)).toBeInTheDocument();
  });

  it('shows placeholder pages for Settings and FAQ', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    await user.click(screen.getByRole('link', { name: /settings/i }));
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /faq/i }));
    expect(screen.getByRole('heading', { name: /faq/i })).toBeInTheDocument();
  });

  it('shows Reminders placeholder with badge matching pending count', async () => {
    const entries = await repo.listActive();
    const expected = countPendingReminderWorks(entries);

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    const badges = screen.getAllByLabelText(new RegExp(`${expected} pending reminders`));
    expect(badges.length).toBeGreaterThan(0);
  });
});
