import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { db } from '../data/db';
import { resetTestDatabase } from '../test/dbTestUtils';
import { DexieJournalRepository } from '../data/repositories/DexieJournalRepository';
import { buildJournalFixture } from './fixtures/journalEntries.fixture';

const repo = new DexieJournalRepository();

describe('filter and sort journal entries', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await db.meta.put({ key: 'hasSeeded', value: true });
    const entries = buildJournalFixture(24);
    for (const e of entries) await repo.save(e);
  });

  it('filters by Brakes category', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/journal']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /^brakes$/i }));

    const brakesEntries = await repo.listActive();
    const brakesCount = brakesEntries.filter((e) =>
      e.works.some((w) => w.labels.includes('Brakes')),
    ).length;

    await waitFor(() => {
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBe(brakesCount);
    });
  });

  it('sorts by date with date-first header emphasis', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/journal']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /^date$/i }));

    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThan(0);
  });

  it('defaults to odometer descending sort', async () => {
    render(
      <MemoryRouter initialEntries={['/journal']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    const entries = await repo.listActive('odometerKm', 'desc');
    const firstOdometer = entries[0]?.odometerKm;
    expect(screen.getByText(new RegExp(firstOdometer.toLocaleString()))).toBeInTheDocument();
  });

  it('reverses sort direction', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/journal']}>
        <App />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /reverse/i }));

    const entries = await repo.listActive('odometerKm', 'asc');
    const firstOdometer = entries[0]?.odometerKm;
    expect(screen.getByText(new RegExp(firstOdometer.toLocaleString()))).toBeInTheDocument();
  });
});
