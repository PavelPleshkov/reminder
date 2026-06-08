import { FILTER_CATEGORIES, type FilterCategory } from '@reminder/shared';
import styles from './journal.module.css';

interface CategoryFiltersProps {
  selected: FilterCategory;
  onChange: (category: FilterCategory) => void;
}

export function CategoryFilters({ selected, onChange }: CategoryFiltersProps) {
  return (
    <aside className={styles.filters} aria-label="Category filters">
      <p className={styles.filterTitle}>Filter</p>
      <ul className={styles.filterList}>
        {FILTER_CATEGORIES.map((cat) => (
          <li key={cat} className={styles.filterItem}>
            <button
              type="button"
              className={`${styles.filterButton} ${selected === cat ? styles.filterButtonActive : ''}`}
              onClick={() => onChange(cat)}
              aria-pressed={selected === cat}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
