import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { useTodoStore } from '../store';
import { CATEGORIES, PRIORITY_COLORS } from '../constants';
import { Subtasks } from './Subtasks';
import { Tags } from './Tags';
import { Notes } from './Notes';
import { Reminder } from './Reminder';
import { PomodoroTimer } from './PomodoroTimer';
import { ConfirmDialog } from './ConfirmDialog';
import toast from 'react-hot-toast';
import '../styles/todo-item.css';

dayjs.extend(relativeTime);
dayjs.locale('es');

export function TodoItem({ todo }) {
  const { toggleComplete, deleteTodo, updateTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const category = CATEGORIES.find((c) => c.id === todo.category);
  const isOverdue = todo.dueDate && dayjs(todo.dueDate).isBefore(dayjs(), 'day') && !todo.completed;

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteTodo(todo.id);
    toast.success('✓ Tarea eliminada');
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      toast.error('La descripción no puede estar vacía');
      return;
    }
    updateTodo(todo.id, { title: editTitle });
    setIsEditing(false);
    toast.success('Tarea actualizada');
  };

  const completedSubtasks = todo.subtasks.filter((st) => st.completed).length;
  const subtasksProgress = todo.subtasks.length > 0
    ? `${completedSubtasks}/${todo.subtasks.length}`
    : '';

  return (
    <motion.div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      whileHover={{ scale: 1.02 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className="todo-checkbox">
        <button
          className="checkbox-btn"
          onClick={() => {
            toggleComplete(todo.id);
            toast.success(todo.completed ? 'Marcado como incompleto' : 'Marcado como completado');
          }}
        >
          {todo.completed ? (
            <span className="material-symbols-rounded">check_circle</span>
          ) : (
            <span className="material-symbols-rounded">radio_button_unchecked</span>
          )}
        </button>
      </div>

      <div className="todo-content">
        {isEditing ? (
          <div className="edit-mode">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <div className="edit-buttons">
              <button onClick={handleSaveEdit} className="btn-save">
                Guardar
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="todo-header">
              <p className="todo-title">{todo.title}</p>
              <button
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <span className="material-symbols-rounded">expand_less</span>
                ) : (
                  <span className="material-symbols-rounded">expand_more</span>
                )}
              </button>
            </div>
            
            <div className="todo-meta">
              <span className="todo-category" style={{ backgroundColor: category?.color }}>
                {category?.icon} {category?.name}
              </span>
              {todo.dueDate && (
                <span className={`todo-date ${isOverdue ? 'overdue-badge' : ''}`}>
                  📅 {dayjs(todo.dueDate).format('DD MMM')}
                </span>
              )}
              {todo.dueDate && !isOverdue && (
                <span className="todo-relative-date">
                  {dayjs(todo.dueDate).fromNow()}
                </span>
              )}
              {isOverdue && <span className="todo-overdue">⚠️ Vencida</span>}
              {subtasksProgress && (
                <span className="todo-subtasks-badge">✓ {subtasksProgress}</span>
              )}
              {todo.tags && todo.tags.length > 0 && (
                <span className="todo-tags-badge">🏷️ {todo.tags.length}</span>
              )}
            </div>
            
            <div className="todo-priority">
              <div
                className="priority-indicator"
                style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}
                title={`Prioridad: ${todo.priority}`}
              />
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="todo-expanded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Notes todoId={todo.id} description={todo.description} />
                  <Tags todoId={todo.id} tags={todo.tags} />
                  <Reminder todoId={todo.id} title={todo.title} reminder={todo.reminder} />
                  <Subtasks todoId={todo.id} subtasks={todo.subtasks} />
                  <PomodoroTimer todoId={todo.id} initialTime={todo.pomodoroTimeSpent} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="todo-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => setIsEditing(!isEditing)}
          title="Editar"
        >
          <span className="material-symbols-rounded">edit</span>
        </button>
        <button
          className="action-btn delete-btn"
          onClick={handleDelete}
          title="Eliminar"
        >
          <span className="material-symbols-rounded">close</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="¿Eliminar tarea?"
        message={`¿Estás seguro de que quieres eliminar "${todo.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDanger={true}
      />
    </motion.div>
  );
}
