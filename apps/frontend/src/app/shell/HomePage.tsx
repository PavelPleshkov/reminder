import { Link } from 'react-router-dom';
import { RemindersBadge } from './RemindersBadge';
import { useAppContext } from '../../App';
import styles from './shell.module.css';

const TILES = [
  { to: '/journal', label: 'Journal', icon: '📓' },
  { to: '/reminders', label: 'Reminders', icon: '🔔', showBadge: true },
  { to: '/categories', label: 'Categories & Aggregates', icon: '📊' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
  { to: '/faq', label: 'FAQ', icon: '❓' },
  { to: '/trash', label: 'Trash', icon: '🗑️' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
] as const;

export function HomePage() {
  const { pendingCount } = useAppContext();

  return (
    <div className={styles.home}>
      <h2 className={styles.homeTitle}>Welcome to Reminder</h2>
      <div className={styles.tileGrid}>
        {TILES.map((tile) => (
          <Link key={tile.to} to={tile.to} className={styles.tile}>
            <span className={styles.tileIcon} aria-hidden="true">
              {tile.icon}
            </span>
            <span className={styles.tileLabel}>
              {tile.label}
              {'showBadge' in tile && tile.showBadge && pendingCount > 0 && (
                <> <RemindersBadge count={pendingCount} /></>
              )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
