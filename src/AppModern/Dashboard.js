import React from 'react';
import { motion } from 'framer-motion';
import { useTodoStore } from '../store';
import '../styles/dashboard.css';

export function Dashboard() {
  const { getAdvancedStats } = useTodoStore();
  const stats = getAdvancedStats();

  const StatCard = ({ icon, label, value, color, trend }) => (
    <motion.div
      className="stat-card"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-number">{value}</span>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </motion.div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Panel de Productividad</h2>
      </div>

      <div className="dashboard-grid">
        <StatCard
          icon="📋"
          label="Total de Tareas"
          value={stats.totalTodos}
          color="#3b82f6"
        />
        <StatCard
          icon="✅"
          label="Completadas"
          value={stats.completedTodos}
          color="#10b981"
          trend={`${stats.completionRate}%`}
        />
        <StatCard
          icon="⚡"
          label="Activas"
          value={stats.activeTodos}
          color="#f59e0b"
        />
        <StatCard
          icon="⏰"
          label="Vencidas"
          value={stats.overdueTodos}
          color="#ef4444"
        />
      </div>

      <div className="dashboard-section">
        <h3>🎯 Distribución por Prioridad</h3>
        <div className="priority-bars">
          <div className="priority-bar">
            <span className="priority-label">🔴 Alta</span>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${
                    stats.totalTodos > 0
                      ? (stats.highPriority / stats.totalTodos) * 100
                      : 0
                  }%`,
                  backgroundColor: '#ef4444',
                }}
              />
            </div>
            <span className="bar-value">{stats.highPriority}</span>
          </div>
          <div className="priority-bar">
            <span className="priority-label">🟡 Media</span>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${
                    stats.totalTodos > 0
                      ? (stats.mediumPriority / stats.totalTodos) * 100
                      : 0
                  }%`,
                  backgroundColor: '#f59e0b',
                }}
              />
            </div>
            <span className="bar-value">{stats.mediumPriority}</span>
          </div>
          <div className="priority-bar">
            <span className="priority-label">🟢 Baja</span>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${
                    stats.totalTodos > 0
                      ? (stats.lowPriority / stats.totalTodos) * 100
                      : 0
                  }%`,
                  backgroundColor: '#10b981',
                }}
              />
            </div>
            <span className="bar-value">{stats.lowPriority}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="dashboard-card">
          <h3>✓ Subtareas</h3>
          <div className="progress-circle">
            <svg viewBox="0 0 36 36" className="progress-ring">
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray={`${
                  stats.totalSubtasks > 0
                    ? (stats.completedSubtasks / stats.totalSubtasks) * 100
                    : 0
                } 100`}
                className="progress-ring-fill"
              />
            </svg>
            <div className="progress-text">
              <span className="progress-number">
                {stats.completedSubtasks}/{stats.totalSubtasks}
              </span>
              <span className="progress-label">Completadas</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>⏱️ Pomodoro Total</h3>
          <div className="pomodoro-time">
            <span className="time-value">{stats.totalPomodoroTime}</span>
            <span className="time-unit">minutos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
