import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format ISO date to Indonesian readable format.
 */
export function formatDate(isoString, pattern = 'd MMM yyyy, HH:mm') {
  if (!isoString) return '-';
  return format(parseISO(isoString), pattern, { locale: id });
}

/**
 * Format as relative time in Indonesian (e.g., "5 menit lalu").
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '-';
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true, locale: id });
}
