import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodoStore } from '../store';
import { AddTodoForm } from './AddTodoForm';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { ReminderAlert } from './ReminderAlert';
import '../styles/container.css';

export function TodoContainer() {
  const { getFilteredTodos, getStats, filter, setFilter, activeReminders, removeActiveReminder, getTodoById } = useTodoStore();
  const todos = getFilteredTodos();
  const stats = getStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="todo-container">
      <div className="todo-main">
        <AddTodoForm />

        {/* Header de sección con stats y filtros */}
        <div className="task-list-header">
          <div className="task-list-title-row">
            <h2 className="task-list-title">
              <span className="material-symbols-rounded">checklist</span>
              Mis Tareas
            </h2>
            <span className="task-count-badge">
              {stats.active} {stats.active === 1 ? 'pendiente' : 'pendientes'}
            </span>
          </div>

          {/* Barra de progreso */}
          {stats.total > 0 && (
            <div className="task-progress-section">
              <div className="task-progress-bar">
                <div
                  className="task-progress-fill"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="task-progress-text">
                {stats.completed}/{stats.total} completadas ({stats.completionRate}%)
              </span>
            </div>
          )}

          {/* Filtros rápidos */}
          <div className="task-quick-filters">
            <button
              className={`quick-filter ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
              <span className="filter-count">{stats.total}</span>
            </button>
            <button
              className={`quick-filter ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Activas
              <span className="filter-count">{stats.active}</span>
            </button>
            <button
              className={`quick-filter ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Hechas
              <span className="filter-count">{stats.completed}</span>
            </button>
          </div>
        </div>

        {todos.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <motion.div
            className="todo-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.div key={todo.id} variants={itemVariants} layout>
                  <TodoItem todo={todo} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Renderizar alertas de recordatorio activos */}
      {activeReminders.map((reminder) => {
        const todo = getTodoById(reminder.todoId);
        return (
          todo && (
            <ReminderAlert
              key={reminder.todoId}
              todo={todo}
              onDismiss={() => removeActiveReminder(reminder.todoId)}
            />
          )
        );
      })}
    </div>
  );
}
