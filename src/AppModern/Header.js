import React from 'react';
import { useTodoStore } from '../store';
import '../styles/header.css';

export function Header({ onThemeChange }) {
  const { theme, getStats } = useTodoStore();
  const stats = getStats();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-top">
          <div className="header-left">
            <h1 className="app-title">
              <span className="title-icon">✓</span>
              TaskMaster Pro
            </h1>
            <p className="app-subtitle">Organiza tu vida, multiplica tu productividad</p>
          </div>

          <button
            className="theme-toggle"
            onClick={onThemeChange}
            aria-label="Cambiar tema"
          >
            {theme === 'light' ? (
              <span className="material-symbols-rounded">dark_mode</span>
            ) : (
              <span className="material-symbols-rounded">light_mode</span>
            )}
          </button>
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
      </div>
    </header>
  );
}
