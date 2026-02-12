import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTodoStore } from '../store';
import { AddTodoForm } from './AddTodoForm';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { Dashboard } from './Dashboard';
import { ReminderAlert } from './ReminderAlert';
import '../styles/container.css';

export function TodoContainer() {
  const { getFilteredTodos, filter, activeReminders, removeActiveReminder, getTodoById } = useTodoStore();
  const [showDashboard, setShowDashboard] = useState(false);
  const todos = getFilteredTodos();

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
        <div className="dashboard-toggle">
          <button
            className={`toggle-btn ${showDashboard ? 'active' : ''}`}
            onClick={() => setShowDashboard(!showDashboard)}
          >
            {showDashboard ? '📋' : '📊'} {showDashboard ? 'Tareas' : 'Estadísticas'}
          </button>
        </div>

        {showDashboard ? (
          <Dashboard />
        ) : (
          <>
            <AddTodoForm />

            {todos.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <motion.div
                className="todo-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {todos.map((todo) => (
                  <motion.div key={todo.id} variants={itemVariants}>
                    <TodoItem todo={todo} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
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
