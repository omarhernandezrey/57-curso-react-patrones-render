import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { motion } from 'framer-motion';
import { useTodoStore } from '../store';
import '../styles/calendar.css';

dayjs.locale('es');

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export function CalendarView() {
  const { todos } = useTodoStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const startOfWeek = useMemo(
    () => dayjs().startOf('week').add(1, 'day').add(weekOffset, 'week'),
    [weekOffset]
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day')),
    [startOfWeek]
  );

  const { tasksByDay, unscheduled } = useMemo(() => {
    const byDay = {};
    const noDate = [];

    weekDays.forEach((day) => {
      byDay[day.format('YYYY-MM-DD')] = [];
    });

    todos.forEach((todo) => {
      if (!todo.dueDate) {
        noDate.push(todo);
        return;
      }
      const key = dayjs(todo.dueDate).format('YYYY-MM-DD');
      if (byDay[key]) {
        byDay[key].push(todo);
      }
    });

    return { tasksByDay: byDay, unscheduled: noDate };
  }, [todos, weekDays]);

  const today = dayjs().format('YYYY-MM-DD');

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>
          <span className="material-symbols-rounded">calendar_month</span>
          Calendario
        </h2>
        <div className="calendar-nav">
          <button
            className="cal-nav-btn"
            onClick={() => setWeekOffset((o) => o - 1)}
          >
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
          <span className="calendar-period">
            {startOfWeek.format('D MMM')} -{' '}
            {startOfWeek.add(6, 'day').format('D MMM YYYY')}
          </span>
          <button
            className="cal-nav-btn"
            onClick={() => setWeekOffset((o) => o + 1)}
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
          {weekOffset !== 0 && (
            <button
              className="cal-nav-btn cal-today-btn"
              onClick={() => setWeekOffset(0)}
            >
              Hoy
            </button>
          )}
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day, i) => {
          const key = day.format('YYYY-MM-DD');
          const isToday = key === today;
          const tasks = tasksByDay[key] || [];

          return (
            <div
              key={key}
              className={`calendar-day ${isToday ? 'today' : ''}`}
            >
              <div className="day-header">
                <span className="day-name">{WEEKDAYS[i]}</span>
                <span className={`day-number ${isToday ? 'today' : ''}`}>
                  {day.format('D')}
                </span>
              </div>
              <div className="day-tasks">
                {tasks.length === 0 ? (
                  <span className="no-tasks">Sin tareas</span>
                ) : (
                  tasks.map((todo) => (
                    <motion.div
                      key={todo.id}
                      className={`cal-task ${todo.completed ? 'completed' : ''}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span
                        className="cal-task-priority"
                        style={{
                          backgroundColor:
                            priorityColors[todo.priority] || '#94a3b8',
                        }}
                      />
                      <div className="cal-task-info">
                        <span className="cal-task-title">{todo.title}</span>
                        {todo.category && (
                          <span className="cal-task-category">
                            {todo.category}
                          </span>
                        )}
                      </div>
                      {todo.completed && (
                        <span className="material-symbols-rounded cal-task-check">
                          check_circle
                        </span>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {unscheduled.length > 0 && (
        <div className="calendar-unscheduled">
          <h3>
            <span className="material-symbols-rounded">event_busy</span>
            Sin fecha asignada ({unscheduled.length})
          </h3>
          <div className="unscheduled-list">
            {unscheduled.map((todo) => (
              <div
                key={todo.id}
                className={`cal-task ${todo.completed ? 'completed' : ''}`}
              >
                <span
                  className="cal-task-priority"
                  style={{
                    backgroundColor:
                      priorityColors[todo.priority] || '#94a3b8',
                  }}
                />
                <div className="cal-task-info">
                  <span className="cal-task-title">{todo.title}</span>
                  {todo.category && (
                    <span className="cal-task-category">{todo.category}</span>
                  )}
                </div>
                {todo.completed && (
                  <span className="material-symbols-rounded cal-task-check">
                    check_circle
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
