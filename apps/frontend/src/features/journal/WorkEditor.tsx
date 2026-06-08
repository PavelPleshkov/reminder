import type { Work, CategoryLabel } from '@reminder/shared';
import { WORK_LABELS } from '@reminder/shared';
import { Button } from '../../shared/ui/Button';
import styles from './journal.module.css';

interface WorkEditorProps {
  work: Work;
  errors?: Record<string, string>;
  onChange: (work: Work) => void;
  onRemove: () => void;
}

export function WorkEditor({ work, errors = {}, onChange, onRemove }: WorkEditorProps) {
  const toggleLabel = (label: CategoryLabel) => {
    const has = work.labels.includes(label);
    const labels = has ? work.labels.filter((l) => l !== label) : [...work.labels, label];
    onChange({ ...work, labels });
  };

  const handleCriterionChange = (criterion: Work['nextCriterion']) => {
    onChange({
      ...work,
      nextCriterion: criterion,
      nextTargetMileage: criterion === 'mileage' ? work.nextTargetMileage : null,
      nextTargetDate: criterion === 'date' ? work.nextTargetDate : null,
    });
  };

  return (
    <div className={styles.workEditor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className={styles.formLabel} htmlFor={`desc-${work.id}`}>
          Description
        </label>
        <Button variant="secondary" onClick={onRemove} style={{ padding: '0.25rem 0.5rem' }}>
          Remove
        </Button>
      </div>
      <textarea
        id={`desc-${work.id}`}
        className={styles.formInput}
        value={work.description}
        onChange={(e) => onChange({ ...work, description: e.target.value })}
        rows={2}
        maxLength={101}
      />
      {errors.description && <p className={styles.formError}>{errors.description}</p>}

      <div className={styles.formGroup}>
        <span className={styles.formLabel}>Category labels</span>
        <div className={styles.labelCloud} role="group" aria-label="Category labels">
          {WORK_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              className={`${styles.labelButton} ${work.labels.includes(label) ? styles.labelButtonSelected : ''}`}
              onClick={() => toggleLabel(label)}
              aria-pressed={work.labels.includes(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor={`cost-${work.id}`}>
          Cost (optional)
        </label>
        <input
          id={`cost-${work.id}`}
          type="number"
          className={styles.formInput}
          min={0}
          value={work.cost ?? ''}
          onChange={(e) =>
            onChange({
              ...work,
              cost: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />
        {errors.cost && <p className={styles.formError}>{errors.cost}</p>}
      </div>

      <div className={styles.formGroup}>
        <span className={styles.formLabel}>Next service criterion</span>
        <div className={styles.criterionGroup} role="radiogroup" aria-label="Next criterion">
          {(['mileage', 'date', 'on_breakdown'] as const).map((c) => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <input
                type="radio"
                name={`criterion-${work.id}`}
                checked={work.nextCriterion === c}
                onChange={() => handleCriterionChange(c)}
              />
              {c === 'mileage' ? 'Mileage' : c === 'date' ? 'Date' : 'On breakdown'}
            </label>
          ))}
        </div>
      </div>

      {work.nextCriterion === 'mileage' && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor={`mileage-${work.id}`}>
            Target odometer (km)
          </label>
          <input
            id={`mileage-${work.id}`}
            type="number"
            className={styles.formInput}
            min={0}
            value={work.nextTargetMileage ?? ''}
            onChange={(e) =>
              onChange({
                ...work,
                nextTargetMileage: e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />
          {errors.nextTargetMileage && (
            <p className={styles.formError}>{errors.nextTargetMileage}</p>
          )}
        </div>
      )}

      {work.nextCriterion === 'date' && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor={`date-${work.id}`}>
            Target date
          </label>
          <input
            id={`date-${work.id}`}
            type="date"
            className={styles.formInput}
            value={work.nextTargetDate ?? ''}
            onChange={(e) => onChange({ ...work, nextTargetDate: e.target.value || null })}
          />
          {errors.nextTargetDate && <p className={styles.formError}>{errors.nextTargetDate}</p>}
        </div>
      )}

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={work.done}
          onChange={(e) => onChange({ ...work, done: e.target.checked })}
        />
        Done
      </label>
    </div>
  );
}
