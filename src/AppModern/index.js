import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTodoStore } from '../store';
import { Header } from './Header';
import { TodoContainer } from './TodoContainer';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { CalendarView } from './CalendarView';
import { ProfileView } from './ProfileView';
import '../styles/theme.css';
import '../styles/modern.css';
import '../styles/navigation.css';
import '../styles/desktop-nav.css';
import { Footer } from './Footer';

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { id: 'tasks', icon: 'list_alt', label: 'Tareas' },
  { id: 'calendar', icon: 'calendar_month', label: 'Calendario' },
  { id: 'profile', icon: 'person', label: 'Perfil' },
];

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

  const handleFabClick = () => {
    setActiveNav('tasks');
  };

  const renderView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return (
          <>
            <Sidebar />
            <TodoContainer />
          </>
        );
      case 'calendar':
        return <CalendarView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Toaster position="bottom-right" />
      <div className="app-layout">
        <Header onThemeChange={handleThemeChange} />

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`desktop-nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="material-symbols-rounded">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="app-content">
          {renderView()}
        </div>

        <Footer />
      </div>

      {/* Bottom Navigation with FAB */}
      <nav className="bottom-nav">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            <span className="material-symbols-rounded">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div style={{ width: '60px' }}></div> {/* Spacer para FAB */}
        {NAV_ITEMS.slice(2).map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            <span className="material-symbols-rounded">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {/* FAB Button */}
        <button className="fab-button" title="Agregar tarea" onClick={handleFabClick}>
          <span className="material-symbols-rounded">add</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
