import { useAppContext } from '../../App';

export function RemindersPlaceholder() {
  const { pendingCount } = useAppContext();

  return (
    <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
      <h2 style={{ margin: '0 0 var(--space-md)' }}>Reminders</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Full reminders functionality will be available in a future release.
      </p>
      {pendingCount > 0 && (
        <p>
          You have <strong>{pendingCount}</strong> pending reminder
          {pendingCount === 1 ? '' : 's'}.
        </p>
      )}
    </div>
  );
}
