// Shared formatters for money and expiry dates.

export const PKR = (n) => `Rs ${Math.round(n).toLocaleString('en-PK')}`;

// "18 Jul 2026" from a YYYY-MM-DD string; em-dash when absent.
export function fmtDate(s) {
  if (!s) return '—';
  return new Date(`${s}T00:00:00`).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Classify a due date into a status the UI can badge.
export function expiryStatus(s) {
  if (!s) return { key: 'none', label: 'No date', tone: 'muted' };
  const DAY = 86400000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${s}T00:00:00`);
  const days = Math.round((due - today) / DAY);
  if (days < 0) return { key: 'expired', label: 'Expired', tone: 'brick' };
  if (days === 0) return { key: 'soon', label: 'Due today', tone: 'ochre' };
  if (days <= 30) return { key: 'soon', label: `${days}d left`, tone: 'ochre' };
  return { key: 'ok', label: 'In date', tone: 'pine' };
}
