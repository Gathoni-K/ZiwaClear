export function expiresIn(isoString: string): string {
  const diffMs = new Date(isoString).getTime() - Date.now();

  if (diffMs <= 0) return "Expired";

  const hours = Math.floor(diffMs / (60 * 60_000));
  if (hours < 1) {
    const minutes = Math.floor(diffMs / 60_000);
    return `Expires in ${minutes}m`;
  }
  if (hours < 24) return `Expires in ${hours}h`;

  const days = Math.floor(hours / 24);
  return `Expires in ${days}d`;
}