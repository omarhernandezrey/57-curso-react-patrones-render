import React, { useState } from 'react';
import { useTodoStore } from '../store';
import '../styles/notes.css';

export function Notes({ todoId, description }) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(description);
  const { updateDescription } = useTodoStore();

  const handleSave = () => {
    updateDescription(todoId, noteText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNoteText(description);
    setIsEditing(false);
  };

  return (
    <div className="notes-container">
      {isEditing ? (
        <div className="notes-edit">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Añade detalles sobre esta tarea..."
            className="notes-textarea"
            autoFocus
          />
          <div className="notes-buttons">
            <button className="btn-save" onClick={handleSave}>
              <span className="material-symbols-rounded">save</span> Guardar
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              <span className="material-symbols-rounded">close</span> Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="notes-view">
          {description ? (
            <>
              <div className="notes-text">{description}</div>
              <button
                className="btn-edit-note"
                onClick={() => setIsEditing(true)}
              >
                <span className="material-symbols-rounded">edit</span> Editar nota
              </button>
            </>
          ) : (
            <button
              className="btn-add-note"
              onClick={() => setIsEditing(true)}
            >
              <span className="material-symbols-rounded">edit</span> Añadir nota
            </button>
          )}
        </div>
      )}
    </div>
  );
}
