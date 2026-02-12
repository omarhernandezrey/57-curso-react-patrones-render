import create from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

export const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all', // all, active, completed
      sortBy: 'date', // date, priority, alphabetic
      theme: 'light', // light, dark
      selectedCategory: null,
      activeReminders: [], // {todoId, fireTime}

      // Acciones básicas
      addTodo: (title, category = 'general', priority = 'medium', dueDate = null) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: uuidv4(),
              title,
              completed: false,
              category,
              priority,
              dueDate,
              createdAt: new Date().toISOString(),
              description: '',
              subtasks: [],
              tags: [],
            },
          ],
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        })),

      toggleComplete: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed }
              : todo
          ),
        })),

      // Filtros
      setFilter: (filter) => set({ filter }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSortBy: (sortBy) => set({ sortBy }),

      // Tema
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // Obtener todos filtrados
      getFilteredTodos: () => {
        const state = get();
        let filtered = state.todos;

        // Filtrar por estado
        if (state.filter === 'active') {
          filtered = filtered.filter((t) => !t.completed);
        } else if (state.filter === 'completed') {
          filtered = filtered.filter((t) => t.completed);
        }

        // Filtrar por categoría
        if (state.selectedCategory) {
          filtered = filtered.filter((t) => t.category === state.selectedCategory);
        }

        // Ordenar
        if (state.sortBy === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (state.sortBy === 'alphabetic') {
          filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (state.sortBy === 'date') {
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }

        return filtered;
      },

      // Obtener estadísticas
      getStats: () => {
        const state = get();
        const total = state.todos.length;
        const completed = state.todos.filter((t) => t.completed).length;
        const active = total - completed;

        return {
          total,
          completed,
          active,
          completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
        };
      },

      // Obtener categorías únicas
      getCategories: () => {
        const state = get();
        const categories = new Set(state.todos.map((t) => t.category));
        return Array.from(categories);
      },

      // Subtareas
      addSubtask: (todoId, subtaskTitle) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: [
                    ...todo.subtasks,
                    {
                      id: uuidv4(),
                      title: subtaskTitle,
                      completed: false,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : todo
          ),
        })),

      toggleSubtask: (todoId, subtaskId) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: todo.subtasks.map((st) =>
                    st.id === subtaskId
                      ? { ...st, completed: !st.completed }
                      : st
                  ),
                }
              : todo
          ),
        })),

      deleteSubtask: (todoId, subtaskId) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: todo.subtasks.filter((st) => st.id !== subtaskId),
                }
              : todo
          ),
        })),

      // Tags
      addTag: (todoId, tag) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId && !todo.tags.includes(tag)
              ? { ...todo, tags: [...todo.tags, tag] }
              : todo
          ),
        })),

      removeTag: (todoId, tag) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? { ...todo, tags: todo.tags.filter((t) => t !== tag) }
              : todo
          ),
        })),

      // Notas
      updateDescription: (id, description) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, description } : todo
          ),
        })),

      // Recordatorios
      setReminder: (id, reminderTime) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, reminder: reminderTime } : todo
          ),
        })),

      // Pomodoro
      setPomodoroTime: (id, pomodoroMinutes) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, pomodoroTimeSpent: pomodoroMinutes }
              : todo
          ),
        })),

      // Operaciones en lote
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((t) => !t.completed),
        })),

      deleteAll: () => set({ todos: [] }),

      importTodos: (newTodos) =>
        set((state) => ({
          todos: [...state.todos, ...newTodos],
        })),

      exportTodos: () => {
        const state = get();
        return state.todos;
      },

      // Estadísticas avanzadas
      getAdvancedStats: () => {
        const state = get();
        const todos = state.todos;

        const totalTodos = todos.length;
        const completedTodos = todos.filter((t) => t.completed).length;
        const overdueTodos = todos.filter(
          (t) =>
            t.dueDate &&
            dayjs(t.dueDate).isBefore(dayjs(), 'day') &&
            !t.completed
        ).length;

        const highPriority = todos.filter((t) => t.priority === 'high').length;
        const mediumPriority = todos.filter(
          (t) => t.priority === 'medium'
        ).length;
        const lowPriority = todos.filter((t) => t.priority === 'low').length;

        const totalSubtasks = todos.reduce(
          (sum, t) => sum + t.subtasks.length,
          0
        );
        const completedSubtasks = todos.reduce(
          (sum, t) => sum + t.subtasks.filter((st) => st.completed).length,
          0
        );

        const totalPomodoroTime = todos.reduce(
          (sum, t) => sum + (t.pomodoroTimeSpent || 0),
          0
        );

        return {
          totalTodos,
          completedTodos,
          activeTodos: totalTodos - completedTodos,
          overdueTodos,
          completionRate:
            totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100),
          highPriority,
          mediumPriority,
          lowPriority,
          totalSubtasks,
          completedSubtasks,
          totalPomodoroTime,
          avgTodosPerDay: Math.ceil(totalTodos / 7),
        };
      },

      // Gestión de alertas activas
      addActiveReminder: (todoId) =>
        set((state) => ({
          activeReminders: [
            ...state.activeReminders,
            { todoId, fireTime: new Date().toISOString() },
          ],
        })),

      removeActiveReminder: (todoId) =>
        set((state) => ({
          activeReminders: state.activeReminders.filter((r) => r.todoId !== todoId),
        })),

      getTodoById: (id) => {
        const state = get();
        return state.todos.find((t) => t.id === id);
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);
