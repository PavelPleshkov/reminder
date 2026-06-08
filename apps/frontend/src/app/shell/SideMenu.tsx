import { NavLink } from 'react-router-dom';
import { RemindersBadge } from './RemindersBadge';
import styles from './shell.module.css';

interface SideMenuProps {
  open: boolean;
  isMobile: boolean;
  pendingCount: number;
  onClose: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/journal', label: 'Journal' },
  { to: '/reminders', label: 'Reminders', showBadge: true },
  { to: '/categories', label: 'Categories & Aggregates' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/trash', label: 'Trash' },
  { to: '/settings', label: 'Settings' },
] as const;

export function SideMenu({ open, isMobile, pendingCount, onClose }: SideMenuProps) {
  if (!open) return null;

  const handleNavClick = () => {
    if (isMobile) onClose();
  };

  return (
    <>
      {isMobile && (
        <div className={styles.sideMenuOverlay} onClick={onClose} aria-hidden="true" />
      )}
      <nav className={styles.sideMenu} aria-label="Main navigation">
        <ul className={styles.menuList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className={styles.menuItem}>
              <NavLink
                to={item.to}
                end={'end' in item ? item.end : false}
                className={({ isActive }) =>
                  isActive ? `${styles.menuLink} ${styles.menuLinkActive}` : styles.menuLink
                }
                onClick={handleNavClick}
              >
                <span>{item.label}</span>
                {'showBadge' in item && item.showBadge && (
                  <RemindersBadge count={pendingCount} />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
