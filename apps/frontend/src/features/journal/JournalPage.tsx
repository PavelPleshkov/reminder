import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry, FilterCategory } from '@reminder/shared';
import { useAppContext } from '../../App';
import { CategoryFilters } from './CategoryFilters';
import { EntryList, type SortMode, type SortDirection } from './EntryList';
import { EntryForm } from './EntryForm';
import { Button } from '../../shared/ui/Button';
import styles from './journal.module.css';

function filterEntries(entries: JournalEntry[], category: FilterCategory): JournalEntry[] {
  if (category === 'All') return entries;
  return entries.filter((e) => e.works.some((w) => w.labels.includes(category)));
}

function sortEntries(
  entries: JournalEntry[],
  mode: SortMode,
  direction: SortDirection,
): JournalEntry[] {
  const sorted = [...entries].sort((a, b) => {
    const key = mode === 'date' ? 'workDate' : 'odometerKm';
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
}

export function JournalPage() {
  const { repository, refreshPendingCount, hasSeededData } = useAppContext();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [category, setCategory] = useState<FilterCategory>('All');
  const [sortMode, setSortMode] = useState<SortMode>('odometer');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    const orderKey = sortMode === 'date' ? 'workDate' : 'odometerKm';
    const data = await repository.listActive(orderKey, sortDirection);
    setEntries(data);
    setLoading(false);
  }, [repository, sortMode, sortDirection]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSave = async (entry: JournalEntry) => {
    await repository.save(entry);
    setShowForm(false);
    await loadEntries();
    await refreshPendingCount();
  };

  const handleDelete = async (id: string) => {
    await repository.moveToTrash(id);
    await loadEntries();
    await refreshPendingCount();
  };

  const handleToggleAllDone = async (entry: JournalEntry) => {
    const allDone = entry.works.every((w) => w.done);
    const updated: JournalEntry = {
      ...entry,
      works: entry.works.map((w) => ({ ...w, done: !allDone })),
    };
    await repository.save(updated);
    await loadEntries();
    await refreshPendingCount();
  };

  const filtered = filterEntries(entries, category);
  const displayed = sortEntries(filtered, sortMode, sortDirection);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Journal</h2>
        {hasSeededData && (
          <span className={styles.sampleHint}>Sample data</span>
        )}
      </div>

      <div className={styles.layout}>
        <CategoryFilters selected={category} onChange={setCategory} />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <Button onClick={() => setShowForm(true)}>Create entry</Button>
            <span className={styles.sortLabel}>Sort:</span>
            <Button
              variant={sortMode === 'odometer' ? 'primary' : 'secondary'}
              onClick={() => setSortMode('odometer')}
            >
              Odometer
            </Button>
            <Button
              variant={sortMode === 'date' ? 'primary' : 'secondary'}
              onClick={() => setSortMode('date')}
            >
              Date
            </Button>
            <Button
              variant="secondary"
              onClick={() => setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'))}
            >
              {sortDirection === 'desc' ? 'Reverse ↑' : 'Reverse ↓'}
            </Button>
          </div>

          <div className={styles.list}>
            {loading ? (
              <p>Loading…</p>
            ) : displayed.length === 0 ? (
              <p className={styles.emptyState}>Create your first entry</p>
            ) : (
              <EntryList
                entries={displayed}
                sortMode={sortMode}
                onDelete={handleDelete}
                onToggleAllDone={handleToggleAllDone}
              />
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <EntryForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
}
