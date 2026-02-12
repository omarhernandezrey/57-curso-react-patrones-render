import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTodoStore } from '../store';
import { Header } from './Header';
import { TodoContainer } from './TodoContainer';
import { Sidebar } from './Sidebar';
import '../styles/theme.css';
import '../styles/modern.css';

function App() {
  const { theme, setTheme } = useTodoStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="app" data-theme={theme}>
      <Toaster position="bottom-right" />
      <div className="app-layout">
        <Header onThemeChange={handleThemeChange} />
        <div className="app-content">
          <Sidebar />
          <TodoContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
