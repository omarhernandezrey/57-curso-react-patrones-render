import React, { useState, useEffect, useRef } from 'react';
import { useTodoStore } from '../store';
import toast from 'react-hot-toast';
import '../styles/reminder.css';

export function Reminder({ todoId, title, reminder }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [displayTime, setDisplayTime] = useState('');
  const { setReminder, addActiveReminder } = useTodoStore();
  const reminderTimeoutRef = useRef(null);
  const reminderCheckRef = useRef(null);

  // Efecto para mostrar la hora del recordatorio actual
  useEffect(() => {
    if (reminder) {
      setDisplayTime(formatReminderTime(reminder));
    }
  }, [reminder]);

  // Efecto para configurar el recordatorio
  useEffect(() => {
    if (reminder) {
      // Limpiar timeouts previos
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
      if (reminderCheckRef.current) {
        clearInterval(reminderCheckRef.current);
      }

      const checkAndNotify = () => {
        const now = new Date().getTime();
        const reminderTime = new Date(reminder).getTime();
        const timeDiff = reminderTime - now;

        // Si la hora del recordatorio ha llegado (con margen de 1 minuto después)
        if (timeDiff <= 0 && timeDiff > -60000) {
          addActiveReminder(todoId);
          setReminder(todoId, null);
          if (reminderCheckRef.current) {
            clearInterval(reminderCheckRef.current);
          }
          return;
        }

        // Si falta más de un minuto, configurar un timeout exacto
        if (timeDiff > 60000) {
          if (reminderTimeoutRef.current) {
            clearTimeout(reminderTimeoutRef.current);
          }
          reminderTimeoutRef.current = setTimeout(checkAndNotify, timeDiff - 1000);
        }
      };

      // Verificar cada 5 segundos
      reminderCheckRef.current = setInterval(checkAndNotify, 5000);
      checkAndNotify(); // Verificar inmediatamente

      return () => {
        if (reminderTimeoutRef.current) clearTimeout(reminderTimeoutRef.current);
        if (reminderCheckRef.current) clearInterval(reminderCheckRef.current);
      };
    }
  }, [reminder, todoId, title, setReminder, addActiveReminder]);

  const handleSetReminder = () => {
    if (selectedTime) {
      const reminderDate = new Date(selectedTime);
      const now = new Date();

      // Validar que el recordatorio sea en el futuro
      if (reminderDate <= now) {
        toast.error('El recordatorio debe ser en una fecha/hora futura');
        return;
      }

      setReminder(todoId, reminderDate.toISOString());
      setShowPicker(false);
      setSelectedTime('');
      toast.success('✅ Recordatorio establecido correctamente');
    } else {
      toast.error('Por favor selecciona una fecha y hora');
    }
  };

  const handleRemoveReminder = () => {
    setReminder(todoId, null);
    setShowPicker(false);
    if (reminderTimeoutRef.current) clearTimeout(reminderTimeoutRef.current);
    if (reminderCheckRef.current) clearInterval(reminderCheckRef.current);
    toast.success('Recordatorio eliminado');
  };

  const formatReminderTime = (time) => {
    if (!time) return '';
    try {
      const date = new Date(time);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const getMinDatetime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="reminder-container">
      {showPicker ? (
        <div className="reminder-picker">
          <div className="reminder-picker-content">
            <label className="reminder-label">Fecha y hora del recordatorio:</label>
            <input
              type="datetime-local"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min={getMinDatetime()}
              className="reminder-input"
              autoFocus
            />
          </div>
          <div className="reminder-buttons">
            <button
              className="btn-confirm"
              onClick={handleSetReminder}
              disabled={!selectedTime}
            >
              ✓ Establecer
            </button>
            <button
              className="btn-cancel"
              onClick={() => {
                setShowPicker(false);
                setSelectedTime('');
              }}
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`reminder-btn ${reminder ? 'active' : ''}`}
          onClick={() => setShowPicker(true)}
          title={reminder ? `Recordatorio: ${displayTime}` : 'Establecer recordatorio'}
        >
          <span className="material-symbols-rounded">notifications</span>
          {reminder ? (
            <>
              <span>{displayTime}</span>
              <button
                className="reminder-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveReminder();
                }}
                title="Eliminar recordatorio"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </>
          ) : (
            <span>🔔 Recordatorio</span>
          )}
        </button>
      )}
    </div>
  );
}
