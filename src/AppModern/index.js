import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTodoStore } from '../store';
import { Header } from './Header';
import { TodoContainer } from './TodoContainer';
import { Sidebar } from './Sidebar';
import '../styles/theme.css';
import '../styles/modern.css';
import '../styles/navigation.css';

function App() {
  const { theme, setTheme } = useTodoStore();
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="app">
      <Toaster position="bottom-right" />
      <div className="app-layout">
        <Header onThemeChange={handleThemeChange} />
        <div className="app-content">
          <Sidebar />
          <TodoContainer />
        </div>
      </div>

      {/* Bottom Navigation with FAB */}
      <nav className="bottom-nav">
        <div 
          className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveNav('dashboard')}
        >
          <span className="material-symbols-rounded">dashboard</span>
          <span>Dashboard</span>
        </div>
        <div 
          className={`nav-item ${activeNav === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveNav('tasks')}
        >
          <span className="material-symbols-rounded">list_alt</span>
          <span>Tareas</span>
        </div>
        <div style={{ width: '60px' }}></div> {/* Spacer para FAB */}
        <div 
          className={`nav-item ${activeNav === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveNav('calendar')}
        >
          <span className="material-symbols-rounded">calendar_month</span>
          <span>Calendario</span>
        </div>
        <div 
          className={`nav-item ${activeNav === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveNav('profile')}
        >
          <span className="material-symbols-rounded">person</span>
          <span>Perfil</span>
        </div>
        
        {/* FAB Button */}
        <button className="fab-button" title="Agregar tarea">
          <span className="material-symbols-rounded">add</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
