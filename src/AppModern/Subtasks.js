import React, { useState } from 'react';
import { useTodoStore } from '../store';
import '../styles/subtasks.css';

export function Subtasks({ todoId, subtasks }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const { addSubtask, toggleSubtask, deleteSubtask } = useTodoStore();

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(todoId, newSubtask);
      setNewSubtask('');
      setIsAdding(false);
    }
  };

  const completedCount = subtasks.filter((st) => st.completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <div className="subtasks-container">
      <div className="subtasks-header">
        <span className="subtasks-title">📋 Subtareas ({completedCount}/{subtasks.length})</span>
        {subtasks.length > 0 && (
          <div className="subtasks-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="subtasks-list">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
            <button
              className="subtask-checkbox"
              onClick={() => toggleSubtask(todoId, subtask.id)}
            >
              {subtask.completed ? '✓' : '○'}
            </button>
            <span className="subtask-text">{subtask.title}</span>
            <button
              className="subtask-delete"
              onClick={() => deleteSubtask(todoId, subtask.id)}
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="subtask-input-group">
          <input
            type="text"
            placeholder="Nueva subtarea..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
            autoFocus
            className="subtask-input"
          />
          <button className="btn-add" onClick={handleAddSubtask}>
            Añadir
          </button>
          <button
            className="btn-cancel"
            onClick={() => {
              setIsAdding(false);
              setNewSubtask('');
            }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button className="btn-add-subtask" onClick={() => setIsAdding(true)}>
          <span className="material-symbols-rounded">add</span> Añadir subtarea
        </button>
      )}
    </div>
  );
}
