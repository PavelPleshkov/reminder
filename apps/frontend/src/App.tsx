import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { JournalRepository } from '@reminder/shared';
import { DexieJournalRepository } from './data/repositories/DexieJournalRepository';
import { buildFiveEntries } from './data/seed/demoJournalSeed';
import { countPendingReminderWorks } from './domain/pendingReminders';
import { AppRoutes } from './app/routes';

const repository = new DexieJournalRepository();

interface AppContextValue {
  repository: JournalRepository;
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
  hasSeededData: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within App');
  return ctx;
}

export function App() {
  const [pendingCount, setPendingCount] = useState(0);
  const [hasSeededData, setHasSeededData] = useState(false);
  const [ready, setReady] = useState(false);

  const refreshPendingCount = useCallback(async () => {
    const entries = await repository.listActive();
    setPendingCount(countPendingReminderWorks(entries));
  }, []);

  useEffect(() => {
    async function bootstrap() {
      const empty = await repository.isStorageEmpty();
      const seeded = await repository.hasSeeded();

      if (empty && !seeded) {
        const entries = buildFiveEntries();
        for (const entry of entries) {
          await repository.save(entry);
        }
        await repository.markSeeded();
        setHasSeededData(true);
      } else if (seeded) {
        setHasSeededData(true);
      }

      await refreshPendingCount();
      setReady(true);
    }
    bootstrap();
  }, [refreshPendingCount]);

  if (!ready) {
    return <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>Loading…</div>;
  }

  return (
    <AppContext.Provider
      value={{ repository, pendingCount, refreshPendingCount, hasSeededData }}
    >
      <AppRoutes />
    </AppContext.Provider>
  );
}
