import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import '../styles/confirm-dialog.css';

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Eliminar', cancelText = 'Cancelar', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className={`confirm-header ${isDanger ? 'danger' : 'warning'}`}>
          <div className="confirm-icon">
            <FiAlertTriangle size={32} />
          </div>
          <button
            className="confirm-close"
            onClick={onCancel}
            title="Cancelar"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="confirm-content">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="confirm-buttons">
          <button
            className="confirm-btn cancel"
            onClick={onCancel}
          >
            ✕ {cancelText}
          </button>
          <button
            className={`confirm-btn ${isDanger ? 'danger' : 'warning'}`}
            onClick={onConfirm}
          >
            ⚠ {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
