import React, { useState, useEffect } from 'react';
import { useTodoStore } from '../store';
import toast from 'react-hot-toast';
import '../styles/pomodoro.css';

export function PomodoroTimer({ todoId, initialTime = 0 }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos por defecto
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(initialTime * 60);
  const { setPomodoroTime } = useTodoStore();

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalTimeSpent((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setSessionsCompleted((prev) => prev + 1);
      toast.success('¡Sesión Pomodoro completada!');
      setPomodoroTime(todoId, Math.round(totalTimeSpent / 60));
      setTimeLeft(25 * 60);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, todoId, totalTimeSpent, setPomodoroTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-display">
        <div className="pomodoro-time">{formatTime(timeLeft)}</div>
        <div className="pomodoro-sessions">
          Sesiones: {sessionsCompleted} | Tiempo total: {Math.round(totalTimeSpent / 60)}m
        </div>
      </div>

      <div className="pomodoro-controls">
        <button
          className={`btn-control ${isRunning ? 'running' : ''}`}
          onClick={handleToggle}
        >
          {isRunning ? <span className="material-symbols-rounded">pause</span> : <span className="material-symbols-rounded">play_arrow</span>}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button className="btn-control" onClick={handleReset}>
          <span className="material-symbols-rounded">refresh</span> Reiniciar
        </button>
      </div>
    </div>
  );
}
