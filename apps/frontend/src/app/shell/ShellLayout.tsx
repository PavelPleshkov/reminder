import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SideMenu } from './SideMenu';
import { useAppContext } from '../../App';
import styles from './shell.module.css';

export function ShellLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { pendingCount } = useAppContext();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(true);
  }, [isMobile]);

  return (
    <div className={styles.shell}>
      <Header onMenuToggle={() => setMenuOpen((o) => !o)} />
      <div className={styles.body}>
        <SideMenu
          open={menuOpen}
          isMobile={isMobile}
          pendingCount={pendingCount}
          onClose={() => setMenuOpen(false)}
        />
        <main
          className={`${styles.main} ${!isMobile && menuOpen ? styles.mainWithMenu : ''}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
