import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { useTodoStore } from '../store';
import { CATEGORIES, PRIORITY_COLORS, PRIORITY_LABELS } from '../constants';
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
    toast.success('Tarea eliminada');
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
      exit={{ opacity: 0, x: 100 }}
    >
      {/* Indicador de prioridad lateral */}
      <div
        className="todo-priority-bar"
        style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}
      />

      <div className="todo-checkbox">
        <button
          className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
          onClick={() => {
            toggleComplete(todo.id);
            toast.success(todo.completed ? 'Reactivada' : 'Completada');
          }}
          aria-label={todo.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          <span className="material-symbols-rounded">
            {todo.completed ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        </button>
      </div>

      <div className="todo-content" onClick={() => setIsExpanded(!isExpanded)}>
        {isEditing ? (
          <div className="edit-mode" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
            />
            <div className="edit-buttons">
              <button onClick={handleSaveEdit} className="btn-save">
                <span className="material-symbols-rounded">check</span>
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-cancel-edit">
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="todo-header">
              <p className="todo-title">{todo.title}</p>
            </div>

            <div className="todo-meta">
              <span
                className={`todo-priority-badge priority-${todo.priority}`}
              >
                {PRIORITY_LABELS[todo.priority]}
              </span>
              <span className="todo-category" style={{ backgroundColor: category?.color + '20', color: category?.color }}>
                {category?.icon} {category?.name}
              </span>
              {todo.dueDate && (
                <span className={`todo-date ${isOverdue ? 'overdue-badge' : ''}`}>
                  <span className="material-symbols-rounded todo-meta-icon">calendar_today</span>
                  {dayjs(todo.dueDate).format('DD MMM')}
                  {!isOverdue && (
                    <span className="todo-relative-date"> - {dayjs(todo.dueDate).fromNow()}</span>
                  )}
                </span>
              )}
              {isOverdue && (
                <span className="todo-overdue-badge">
                  <span className="material-symbols-rounded todo-meta-icon">warning</span>
                  Vencida
                </span>
              )}
              {subtasksProgress && (
                <span className="todo-subtasks-badge">
                  <span className="material-symbols-rounded todo-meta-icon">checklist</span>
                  {subtasksProgress}
                </span>
              )}
              {todo.tags && todo.tags.length > 0 && (
                <span className="todo-tags-badge">
                  <span className="material-symbols-rounded todo-meta-icon">sell</span>
                  {todo.tags.length}
                </span>
              )}
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="todo-expanded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={(e) => e.stopPropagation()}
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
        {!isEditing && (
          <>
            <button
              className="todo-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
              title={isExpanded ? 'Colapsar' : 'Expandir'}
            >
              <span className="material-symbols-rounded">
                {isExpanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            <button
              className="todo-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              aria-label="Editar tarea"
              title="Editar"
            >
              <span className="material-symbols-rounded">edit</span>
            </button>
            <button
              className="todo-action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              aria-label="Eliminar tarea"
              title="Eliminar"
            >
              <span className="material-symbols-rounded">delete</span>
            </button>
          </>
        )}
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
