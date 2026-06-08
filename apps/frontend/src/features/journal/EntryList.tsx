import { useState } from 'react';
import type { JournalEntry } from '@reminder/shared';
import { Button } from '../../shared/ui/Button';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import styles from './journal.module.css';

export type SortMode = 'odometer' | 'date';
export type SortDirection = 'asc' | 'desc';

interface EntryListProps {
  entries: JournalEntry[];
  sortMode: SortMode;
  onDelete: (id: string) => Promise<void>;
  onToggleAllDone: (entry: JournalEntry) => Promise<void>;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCriterion(work: JournalEntry['works'][0]): string {
  if (work.nextCriterion === 'mileage') {
    return `Next: ${work.nextTargetMileage?.toLocaleString() ?? '?'} km`;
  }
  if (work.nextCriterion === 'date') {
    return `Next: ${work.nextTargetDate ? formatDate(work.nextTargetDate) : '?'}`;
  }
  return 'On breakdown';
}

export function EntryList({ entries, sortMode, onDelete, onToggleAllDone }: EntryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      {entries.map((entry) => {
        const allDone = entry.works.every((w) => w.done);
        return (
          <article key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div>
                {sortMode === 'date' ? (
                  <>
                    <div className={styles.entryHeaderPrimary}>{formatDate(entry.workDate)}</div>
                    <div className={styles.entryHeaderSecondary}>
                      {entry.odometerKm.toLocaleString()} km
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.entryHeaderPrimary}>
                      {entry.odometerKm.toLocaleString()} km
                    </div>
                    <div className={styles.entryHeaderSecondary}>{formatDate(entry.workDate)}</div>
                  </>
                )}
              </div>
              <div className={styles.entryActions}>
                <Button
                  variant="secondary"
                  onClick={() => onToggleAllDone(entry)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }}
                >
                  {allDone ? 'Mark all undone' : 'Mark all done'}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setDeleteId(entry.id)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: 'var(--font-size-sm)' }}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p style={{ margin: '0 0 var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>
              Total cost: {entry.totalCost.toLocaleString()}
            </p>
            {entry.works.map((work) => (
              <div key={work.id} className={styles.workItem}>
                <p className={styles.workDescription}>
                  {work.done ? '✓ ' : ''}
                  {work.description}
                </p>
                <div className={styles.workMeta}>
                  {work.labels.map((l) => (
                    <span key={l} className={styles.labelChip}>
                      {l}
                    </span>
                  ))}
                  {work.cost !== null && work.cost > 0 && (
                    <span> · Cost: {work.cost.toLocaleString()}</span>
                  )}
                  <span> · {formatCriterion(work)}</span>
                </div>
              </div>
            ))}
          </article>
        );
      })}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete entry"
        message="Are you sure you want to delete this journal entry? It will be moved to trash."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
