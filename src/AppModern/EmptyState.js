import React from 'react';
import { motion } from 'framer-motion';
import '../styles/empty-state.css';

export function EmptyState({ filter }) {
  const getEmptyMessage = () => {
    switch (filter) {
      case 'active':
        return {
          emoji: '🎉',
          title: '¡Todo completado!',
          message: 'No tienes tareas activas. ¡Excelente trabajo!',
        };
      case 'completed':
        return {
          emoji: '📭',
          title: 'Sin tareas completadas',
          message: 'Aún no has completado ninguna tarea.',
        };
      default:
        return {
          emoji: '🚀',
          title: 'Comienza tu día',
          message: 'No hay tareas. ¡Añade una para empezar!',
        };
    }
  };

  const { emoji, title, message } = getEmptyMessage();

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="empty-icon">{emoji}</div>
      <h2 className="empty-title">{title}</h2>
      <p className="empty-message">{message}</p>
    </motion.div>
  );
}
