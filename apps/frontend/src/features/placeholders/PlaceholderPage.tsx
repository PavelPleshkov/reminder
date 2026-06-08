interface PlaceholderPageProps {
  title: string;
  message: string;
}

export function PlaceholderPage({ title, message }: PlaceholderPageProps) {
  return (
    <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
      <h2 style={{ margin: '0 0 var(--space-md)' }}>{title}</h2>
      {message && <p style={{ color: 'var(--color-text-muted)' }}>{message}</p>}
    </div>
  );
}
