import styles from './shell.module.css';

interface RemindersBadgeProps {
  count: number;
}

export function RemindersBadge({ count }: RemindersBadgeProps) {
  if (count <= 0) return null;
  return (
    <span className={styles.badge} aria-label={`${count} pending reminders`}>
      {count}
    </span>
  );
}
