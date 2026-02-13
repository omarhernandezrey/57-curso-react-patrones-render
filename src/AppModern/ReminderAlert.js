import React, { useState, useEffect, useRef } from 'react';
import '../styles/reminder-alert.css';

export function ReminderAlert({ todo, onDismiss }) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const soundIntervalRef = useRef(null);

  // Crear sonido de alerta usando Web Audio API
  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Crear oscilador para generar un tono de alerta
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Frecuencias para un sonido urgente (La agudo)
      oscillator.frequency.value = 880; // 880 Hz
      oscillator.type = 'sine';
      
      // Configurar volumen y duración
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Segundo tono después de 100ms
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.frequency.value = 1000; // 1000 Hz
        osc2.type = 'sine';
        
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.5);
      }, 100);
    } catch (error) {
      console.log('Error al reproducir sonido:', error);
    }
  };

  useEffect(() => {
    if (isSoundOn) {
      // Reproducir sonido cada 3 segundos
      playAlertSound();
      soundIntervalRef.current = setInterval(playAlertSound, 3000);
    } else if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
    }

    return () => {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    };
  }, [isSoundOn]);

  const handleDismiss = () => {
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
    }
    onDismiss();
  };

  return (
    <div className="reminder-alert-overlay">
      <div className="reminder-alert-modal">
        <div className="reminder-alert-header">
          <div className="reminder-alert-icon">🔔</div>
          <h2>¡RECORDATORIO!</h2>
          <button
            className="reminder-alert-close"
            onClick={handleDismiss}
            title="Descartar recordatorio"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div className="reminder-alert-content">
          <p className="reminder-alert-title">{todo.title}</p>
          {todo.category && (
            <p className="reminder-alert-category">
              Categoría: <strong>{todo.category}</strong>
            </p>
          )}
          {todo.description && (
            <p className="reminder-alert-description">{todo.description}</p>
          )}
        </div>

        <div className="reminder-alert-controls">
          <button
            className={`sound-toggle ${isSoundOn ? 'on' : 'off'}`}
            onClick={() => setIsSoundOn(!isSoundOn)}
            title={isSoundOn ? 'Silenciar sonido' : 'Activar sonido'}
          >
            {isSoundOn ? (
              <>
                <span className="material-symbols-rounded">volume_normal</span>
                <span>Sonido Activado</span>
              </>
            ) : (
              <>
                <span className="material-symbols-rounded">volume_off</span>
                <span>Sonido Silenciado</span>
              </>
            )}
          </button>

          <button
            className="dismiss-btn"
            onClick={handleDismiss}
          >
            ✓ Aceptar Recordatorio
          </button>
        </div>
      </div>
    </div>
  );
}
