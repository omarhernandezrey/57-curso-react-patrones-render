import React, { useState } from 'react';
import { useTodoStore } from '../store';
import { CATEGORIES } from '../constants';
import toast from 'react-hot-toast';
import '../styles/form.css';

export function AddTodoForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const { addTodo } = useTodoStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Por favor ingresa una descripción');
      return;
    }

    addTodo(title, category, priority, dueDate);
    toast.success('¡Tarea añadida!');
    setTitle('');
    setCategory('general');
    setPriority('medium');
    setDueDate('');
    setIsOpen(false);
  };

  return (
    <div className="add-todo-form">
      {!isOpen ? (
        <button
          className="add-todo-button"
          onClick={() => setIsOpen(true)}
        >
          <span className="material-symbols-rounded">add</span>
          <span>Añadir nueva tarea</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form-expanded">
          <div className="form-group">
            <input
              type="text"
              placeholder="¿Qué necesitas hacer hoy?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vencimiento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setIsOpen(false);
                setTitle('');
                setCategory('general');
                setPriority('medium');
                setDueDate('');
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              <span className="material-symbols-rounded">add</span>
              Crear tarea
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
