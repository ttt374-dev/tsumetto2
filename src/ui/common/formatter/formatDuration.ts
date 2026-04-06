export function formatDuration(ms: number): string {
    const sign = ms < 0 ? "-" : "";
    const sec = Math.abs(ms) / 1000;

    if (sec >= 60 * 60 * 24 * 7) return `${sign}${(sec / (60 * 60 * 24 * 7)).toFixed(0)}w`;
    if (sec >= 60 * 60 * 24) return `${sign}${(sec / (60 * 60 * 24)).toFixed(0)}d`;
    if (sec >= 60 * 60) return `${sign}${(sec / (60 * 60)).toFixed(0)}h`;
    if (sec >= 60) return `${sign}${(sec / 60).toFixed(0)}m`;

    return `${sign}${Math.floor(sec)}s`;
}