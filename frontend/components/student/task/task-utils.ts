export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateRelative = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (date > now) {
    return `en ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  } else {
    return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  }
};

export interface TimeRemaining {
  overdue: boolean;
  text: string;
}

export const getTimeRemaining = (dueDateValue: string | null | undefined): TimeRemaining | null => {
  if (!dueDateValue) return null;

  const dueDate = new Date(dueDateValue);
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();

  if (diff <= 0) return { overdue: true, text: 'Retrasado' };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return { overdue: false, text: `${days}d ${hours}h restantes` };
  if (hours > 0) return { overdue: false, text: `${hours}h ${minutes}m restantes` };
  return { overdue: false, text: `${minutes}m restantes` };
};
