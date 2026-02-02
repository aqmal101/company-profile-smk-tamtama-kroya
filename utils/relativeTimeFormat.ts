import dayjs from 'dayjs';

export function formatRelativeTime(date: string | number | Date | null | undefined): string {
  if (!date) return '';

  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffMinutes / 1440);

  if (diffDays === 0) { // Hari ini
    if (diffMinutes < 60) {
      return `${diffMinutes} Menit yang lalu`;
    } else if (diffHours <= 3) {
      return `${diffHours} Jam yang lalu`;
    } else {
      return `Hari Ini ${target.format('HH:mm')}`;
    }
//   } else if (diffDays === 1) { // Kemarin
//     return `Kemarin ${target.format('HH:mm')}`;
  } else {
    return `${diffDays} Hari yang lalu`;
  }
}