import { useState } from 'react';
import { journalEntrySchema, type JournalEntry, type Work } from '@reminder/shared';
import { Button } from '../../shared/ui/Button';
import { WorkEditor } from './WorkEditor';
import { getValidationMessage } from './validationMessages';
import styles from './journal.module.css';

function createEmptyWork(): Work {
  return {
    id: crypto.randomUUID(),
    description: '',
    labels: [],
    done: false,
    cost: null,
    nextCriterion: 'mileage',
    nextTargetMileage: null,
    nextTargetDate: null,
  };
}

function createDraftEntry(): JournalEntry {
  const now = new Date().toISOString();
  const today = now.split('T')[0];
  return {
    id: crypto.randomUUID(),
    workDate: today,
    odometerKm: 0,
    works: [createEmptyWork()],
    totalCost: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeEntry(entry: JournalEntry): JournalEntry {
  const works = entry.works.map((work) => {
    const labels = work.labels.length === 0 ? (['General'] as Work['labels']) : work.labels;
    const normalized: Work = {
      ...work,
      description: work.description.trim(),
      labels,
      nextTargetMileage: work.nextCriterion === 'mileage' ? work.nextTargetMileage : null,
      nextTargetDate: work.nextCriterion === 'date' ? work.nextTargetDate : null,
    };
    return normalized;
  });
  const totalCost = works.reduce((sum, w) => sum + (w.cost ?? 0), 0);
  return { ...entry, works, totalCost };
}

interface EntryFormProps {
  onSave: (entry: JournalEntry) => Promise<void>;
  onCancel: () => void;
}

export function EntryForm({ onSave, onCancel }: EntryFormProps) {
  const [draft, setDraft] = useState<JournalEntry>(createDraftEntry);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [workErrors, setWorkErrors] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const addWork = () => {
    setDraft((d) => ({ ...d, works: [createEmptyWork(), ...d.works] }));
  };

  const updateWork = (index: number, work: Work) => {
    setDraft((d) => {
      const works = [...d.works];
      works[index] = work;
      return { ...d, works };
    });
  };

  const removeWork = (index: number) => {
    setDraft((d) => ({ ...d, works: d.works.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setErrors({});
    setWorkErrors({});

    const normalized = normalizeEntry(draft);
    const result = journalEntrySchema.safeParse(normalized);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const wErrors: Record<string, Record<string, string>> = {};

      for (const issue of result.error.issues) {
        const path = issue.path;
        if (path[0] === 'works' && typeof path[1] === 'number') {
          const workId = normalized.works[path[1]]?.id ?? String(path[1]);
          const field = path[2]?.toString() ?? 'unknown';
          if (!wErrors[workId]) wErrors[workId] = {};
          wErrors[workId][field] = getValidationMessage(path as (string | number)[]);
        } else {
          const key = path[0]?.toString() ?? 'unknown';
          fieldErrors[key] = getValidationMessage(path as (string | number)[]);
        }
      }

      setErrors(fieldErrors);
      setWorkErrors(wErrors);
      setIsSaving(false);
      return;
    }

    try {
      await onSave(result.data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.formOverlay} onClick={onCancel}>
      <div className={styles.formPanel} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="entry-form-title">
        <h2 id="entry-form-title" className={styles.formTitle}>
          New Journal Entry
        </h2>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="workDate">
            Work date
          </label>
          <input
            id="workDate"
            type="date"
            className={styles.formInput}
            value={draft.workDate}
            onChange={(e) => setDraft((d) => ({ ...d, workDate: e.target.value }))}
          />
          {errors.workDate && <p className={styles.formError}>{errors.workDate}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="odometerKm">
            Odometer (km)
          </label>
          <input
            id="odometerKm"
            type="number"
            className={styles.formInput}
            min={0}
            value={draft.odometerKm}
            onChange={(e) =>
              setDraft((d) => ({ ...d, odometerKm: e.target.value === '' ? 0 : Number(e.target.value) }))
            }
          />
          {errors.odometerKm && <p className={styles.formError}>{errors.odometerKm}</p>}
        </div>

        <div className={styles.worksSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.formLabel}>Works</span>
            <Button variant="secondary" onClick={addWork}>
              Add work
            </Button>
          </div>
          {errors.works && <p className={styles.formError}>{errors.works}</p>}
          {draft.works.map((work, index) => (
            <WorkEditor
              key={work.id}
              work={work}
              errors={workErrors[work.id]}
              onChange={(w) => updateWork(index, w)}
              onRemove={() => removeWork(index)}
            />
          ))}
        </div>

        <div className={styles.formActions}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
