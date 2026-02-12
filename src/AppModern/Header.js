import React from 'react';
import { FiMoon, FiSun, FiPlus } from 'react-icons/fi';
import { useTodoStore } from '../store';
import '../styles/header.css';

export function Header({ onThemeChange }) {
  const { theme, getStats } = useTodoStore();
  const stats = getStats();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <span className="title-icon">✓</span>
            TaskMaster Pro
          </h1>
          <p className="app-subtitle">Organiza tu vida, multiplica tu productividad</p>
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completadas</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Activas</span>
            <span className="stat-value">{stats.active}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Progreso</span>
            <span className="stat-value">{stats.completionRate}%</span>
          </div>
        </div>

        <button
          className="theme-toggle"
          onClick={onThemeChange}
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? (
            <FiMoon size={20} />
          ) : (
            <FiSun size={20} />
          )}
        </button>
      </div>
    </header>
  );
}
