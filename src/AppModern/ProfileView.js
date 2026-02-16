import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTodoStore } from '../store';
import '../styles/profile.css';

const ACHIEVEMENTS = [
  { id: 'first', icon: 'star', label: 'Primera tarea', condition: (s) => s.totalTodos >= 1 },
  { id: 'five', icon: 'workspace_premium', label: '5 completadas', condition: (s) => s.completedTodos >= 5 },
  { id: 'ten', icon: 'emoji_events', label: '10 completadas', condition: (s) => s.completedTodos >= 10 },
  { id: 'twenty', icon: 'military_tech', label: '20 completadas', condition: (s) => s.completedTodos >= 20 },
  { id: 'half', icon: 'target', label: '50% completado', condition: (s) => s.completionRate >= 50 },
  { id: 'all', icon: 'verified', label: '100% completado', condition: (s) => s.completionRate === 100 && s.totalTodos > 0 },
  { id: 'pomodoro', icon: 'timer', label: 'Pomodoro master', condition: (s) => s.totalPomodoroTime >= 60 },
  { id: 'subtasker', icon: 'checklist', label: 'Sub-tasker', condition: (s) => s.totalSubtasks >= 10 },
];

export function ProfileView() {
  const { getAdvancedStats, todos, exportTodos } = useTodoStore();
  const stats = getAdvancedStats();

  const categoryStats = useMemo(() => {
    const cats = {};
    todos.forEach((todo) => {
      const cat = todo.category || 'Sin categoría';
      if (!cats[cat]) cats[cat] = { total: 0, completed: 0 };
      cats[cat].total++;
      if (todo.completed) cats[cat].completed++;
    });
    return Object.entries(cats).sort((a, b) => b[1].total - a[1].total);
  }, [todos]);

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.condition(stats)).length;

  const handleExport = () => {
    const data = exportTodos();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskmaster-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="profile-view">
      {/* Avatar Section */}
      <motion.div
        className="profile-avatar-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-avatar">
          <span className="material-symbols-rounded">person</span>
        </div>
        <h2>TaskMaster User</h2>
        <p className="profile-subtitle">
          {stats.totalTodos} tareas creadas
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="profile-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="profile-stat-item">
          <span className="profile-stat-value">{stats.totalTodos}</span>
          <span className="profile-stat-label">Creadas</span>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-value">{stats.completedTodos}</span>
          <span className="profile-stat-label">Completadas</span>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-value">{stats.completionRate}%</span>
          <span className="profile-stat-label">Progreso</span>
        </div>
        <div className="profile-stat-item">
          <span className="profile-stat-value">{stats.totalPomodoroTime}m</span>
          <span className="profile-stat-label">Pomodoro</span>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3>
          <span className="material-symbols-rounded">category</span>
          Resumen por Categoría
        </h3>
        {categoryStats.length === 0 ? (
          <p className="profile-empty">Sin tareas aún</p>
        ) : (
          <div className="category-list">
            {categoryStats.map(([cat, data]) => {
              const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              return (
                <div key={cat} className="category-row">
                  <div className="category-info">
                    <span className="category-name">{cat}</span>
                    <span className="category-count">
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3>
          <span className="material-symbols-rounded">emoji_events</span>
          Logros ({unlockedCount}/{ACHIEVEMENTS.length})
        </h3>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = achievement.condition(stats);
            return (
              <div
                key={achievement.id}
                className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <span className="material-symbols-rounded">
                  {achievement.icon}
                </span>
                <span className="achievement-label">{achievement.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3>
          <span className="material-symbols-rounded">settings</span>
          Preferencias
        </h3>
        <div className="preferences-list">
          <button className="preference-btn" onClick={handleExport}>
            <span className="material-symbols-rounded">download</span>
            Exportar tareas (JSON)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
