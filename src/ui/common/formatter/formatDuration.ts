

export function formatDuration(ms: number): string {
  const sec = ms / 1000;

  if (sec >= 60 * 60 * 24 * 7) return `${(sec / (60 * 60 * 24 * 7)).toFixed(1)}w`;
  if (sec >= 60 * 60 * 24) return `${(sec / (60 * 60 * 24)).toFixed(1)}d`;
  if (sec >= 60 * 60) return `${(sec / (60 * 60)).toFixed(1)}h`;
  if (sec >= 60) return `${(sec / 60).toFixed(1)}m`;

  return `${Math.floor(sec)}s`;
}