import React, { useState } from 'react';
import { FiSettings, FiTrash2, FiDownload, FiUpload } from 'react-icons/fi';
import { useTodoStore } from '../store';
import { FILTERS, SORT_OPTIONS, CATEGORIES } from '../constants';
import { ConfirmDialog } from './ConfirmDialog';
import toast from 'react-hot-toast';
import '../styles/sidebar.css';

export function Sidebar() {
  const {
    filter,
    setFilter,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    clearCompleted,
    deleteAll,
    exportTodos,
    getStats,
  } = useTodoStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const handleClearCompleted = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClearCompleted = () => {
    clearCompleted();
    toast.success('✓ Tareas completadas eliminadas');
    setShowClearConfirm(false);
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirm(true);
  };

  const handleConfirmDeleteAll = () => {
    deleteAll();
    toast.success('✓ Todas las tareas han sido eliminadas');
    setShowDeleteAllConfirm(false);
  };

  const handleExport = () => {
    const todos = exportTodos();
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tareas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Tareas exportadas');
  };

  return (
    <aside className="sidebar">
      {/* Filtros */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Filtros</h3>
        <div className="filter-buttons">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ordenar */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Ordenar por</h3>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categorías */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Categorías</h3>
        <div className="category-list">
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span>📋</span>
            <span>Todas</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ borderLeftColor: cat.color }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Acciones</h3>
        <div className="action-buttons">
          <button
            className="action-btn export-btn"
            onClick={handleExport}
            title="Descargar tareas"
          >
            <FiDownload size={16} />
            <span>Exportar</span>
          </button>
          <button
            className="action-btn clear-btn"
            onClick={handleClearCompleted}
            title="Eliminar completadas"
          >
            <FiTrash2 size={16} />
            <span>Limpiar</span>
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDeleteAll}
            title="Eliminar todo"
          >
            <FiSettings size={16} />
            <span>Borrar todo</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="¿Limpiar tareas completadas?"
        message="Esto eliminarà todas las tareas que ya has completado. Esta acción no se puede deshacer."
        confirmText="Limpiar"
        cancelText="Cancelar"
        onConfirm={handleConfirmClearCompleted}
        onCancel={() => setShowClearConfirm(false)}
        isDanger={true}
      />

      <ConfirmDialog
        isOpen={showDeleteAllConfirm}
        title="⚠️ ¿Eliminar TODO?"
        message="Esta acción eliminará TODAS tus tareas. No se puede deshacer. ¿Realmente quieres continuar?"
        confirmText="Sí, eliminar todo"
        cancelText="Cancelar"
        onConfirm={handleConfirmDeleteAll}
        onCancel={() => setShowDeleteAllConfirm(false)}
        isDanger={true}
      />
    </aside>
  );
}
