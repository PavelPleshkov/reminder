import styles from './shell.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Reminder</h1>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuToggle}
        aria-label="Toggle menu"
        aria-expanded="false"
      >
        ☰
      </button>
    </header>
  );
}
