export const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export const PRIORITY_LABELS = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const CATEGORIES = [
  { id: 'work', name: 'Trabajo', icon: '💼', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', icon: '🏠', color: '#8b5cf6' },
  { id: 'shopping', name: 'Compras', icon: '🛒', color: '#ec4899' },
  { id: 'health', name: 'Salud', icon: '🏃', color: '#14b8a6' },
  { id: 'education', name: 'Educación', icon: '📚', color: '#f97316' },
  { id: 'general', name: 'General', icon: '⭐', color: '#6366f1' },
];

export const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'active', label: 'Activas' },
  { id: 'completed', label: 'Completadas' },
];

export const SORT_OPTIONS = [
  { id: 'date', label: 'Fecha (Reciente)' },
  { id: 'priority', label: 'Prioridad' },
  { id: 'alphabetic', label: 'Alfabético' },
];
