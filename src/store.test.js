import { useTodoStore } from './store';
import { act } from 'react';

// Helper para obtener el estado actual del store
const getState = () => useTodoStore.getState();

// Helper para ejecutar acciones del store
const run = (fn) => act(() => fn());

beforeEach(() => {
  // Limpiar el store antes de cada test
  act(() => {
    useTodoStore.setState({
      todos: [],
      filter: 'all',
      sortBy: 'date',
      theme: 'light',
      selectedCategory: null,
      activeReminders: [],
    });
  });
});

// ============================================
// CRUD BÁSICO
// ============================================

describe('CRUD de todos', () => {
  test('addTodo agrega una tarea con campos por defecto', () => {
    run(() => getState().addTodo('Mi tarea'));

    const todos = getState().todos;
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Mi tarea');
    expect(todos[0].completed).toBe(false);
    expect(todos[0].category).toBe('general');
    expect(todos[0].priority).toBe('medium');
    expect(todos[0].dueDate).toBeNull();
    expect(todos[0].description).toBe('');
    expect(todos[0].subtasks).toEqual([]);
    expect(todos[0].tags).toEqual([]);
    expect(todos[0].id).toBeDefined();
    expect(todos[0].createdAt).toBeDefined();
  });

  test('addTodo con parámetros personalizados', () => {
    run(() => getState().addTodo('Urgente', 'trabajo', 'high', '2026-03-01'));

    const todo = getState().todos[0];
    expect(todo.category).toBe('trabajo');
    expect(todo.priority).toBe('high');
    expect(todo.dueDate).toBe('2026-03-01');
  });

  test('deleteTodo elimina una tarea por id', () => {
    run(() => getState().addTodo('Tarea 1'));
    run(() => getState().addTodo('Tarea 2'));

    const id = getState().todos[0].id;
    run(() => getState().deleteTodo(id));

    expect(getState().todos).toHaveLength(1);
    expect(getState().todos[0].title).toBe('Tarea 2');
  });

  test('updateTodo actualiza campos específicos', () => {
    run(() => getState().addTodo('Original'));

    const id = getState().todos[0].id;
    run(() => getState().updateTodo(id, { title: 'Actualizada', priority: 'high' }));

    const todo = getState().todos[0];
    expect(todo.title).toBe('Actualizada');
    expect(todo.priority).toBe('high');
    expect(todo.category).toBe('general'); // sin cambio
  });

  test('toggleComplete cambia el estado de completado', () => {
    run(() => getState().addTodo('Tarea'));

    const id = getState().todos[0].id;
    expect(getState().todos[0].completed).toBe(false);

    run(() => getState().toggleComplete(id));
    expect(getState().todos[0].completed).toBe(true);

    run(() => getState().toggleComplete(id));
    expect(getState().todos[0].completed).toBe(false);
  });

  test('getTodoById encuentra una tarea', () => {
    run(() => getState().addTodo('Buscar esta'));

    const id = getState().todos[0].id;
    const found = getState().getTodoById(id);
    expect(found.title).toBe('Buscar esta');
  });

  test('getTodoById retorna undefined si no existe', () => {
    const found = getState().getTodoById('inexistente');
    expect(found).toBeUndefined();
  });
});

// ============================================
// FILTROS Y ORDENAMIENTO
// ============================================

describe('Filtros y ordenamiento', () => {
  beforeEach(() => {
    run(() => getState().addTodo('Tarea A', 'trabajo', 'low'));
    run(() => getState().addTodo('Tarea C', 'personal', 'high'));
    run(() => getState().addTodo('Tarea B', 'trabajo', 'medium'));

    // Completar la primera
    const id = getState().todos[0].id;
    run(() => getState().toggleComplete(id));
  });

  test('filtro "all" retorna todas', () => {
    run(() => getState().setFilter('all'));
    expect(getState().getFilteredTodos()).toHaveLength(3);
  });

  test('filtro "active" retorna solo las no completadas', () => {
    run(() => getState().setFilter('active'));
    expect(getState().getFilteredTodos()).toHaveLength(2);
  });

  test('filtro "completed" retorna solo las completadas', () => {
    run(() => getState().setFilter('completed'));
    const filtered = getState().getFilteredTodos();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Tarea A');
  });

  test('filtro por categoría', () => {
    run(() => getState().setSelectedCategory('trabajo'));
    const filtered = getState().getFilteredTodos();
    expect(filtered).toHaveLength(2);
    filtered.forEach((t) => expect(t.category).toBe('trabajo'));
  });

  test('ordenar por prioridad', () => {
    run(() => getState().setSortBy('priority'));
    const sorted = getState().getFilteredTodos();
    expect(sorted[0].priority).toBe('high');
    expect(sorted[2].priority).toBe('low');
  });

  test('ordenar alfabéticamente', () => {
    run(() => getState().setSortBy('alphabetic'));
    const sorted = getState().getFilteredTodos();
    expect(sorted[0].title).toBe('Tarea A');
    expect(sorted[1].title).toBe('Tarea B');
    expect(sorted[2].title).toBe('Tarea C');
  });
});

// ============================================
// SUBTAREAS
// ============================================

describe('Subtareas', () => {
  let todoId;

  beforeEach(() => {
    run(() => getState().addTodo('Con subtareas'));
    todoId = getState().todos[0].id;
  });

  test('addSubtask agrega una subtarea', () => {
    run(() => getState().addSubtask(todoId, 'Subtarea 1'));

    const subtasks = getState().todos[0].subtasks;
    expect(subtasks).toHaveLength(1);
    expect(subtasks[0].title).toBe('Subtarea 1');
    expect(subtasks[0].completed).toBe(false);
    expect(subtasks[0].id).toBeDefined();
  });

  test('toggleSubtask cambia estado de subtarea', () => {
    run(() => getState().addSubtask(todoId, 'Subtarea'));

    const subtaskId = getState().todos[0].subtasks[0].id;
    run(() => getState().toggleSubtask(todoId, subtaskId));

    expect(getState().todos[0].subtasks[0].completed).toBe(true);
  });

  test('deleteSubtask elimina una subtarea', () => {
    run(() => getState().addSubtask(todoId, 'Eliminar esta'));
    run(() => getState().addSubtask(todoId, 'Mantener esta'));

    const subtaskId = getState().todos[0].subtasks[0].id;
    run(() => getState().deleteSubtask(todoId, subtaskId));

    expect(getState().todos[0].subtasks).toHaveLength(1);
    expect(getState().todos[0].subtasks[0].title).toBe('Mantener esta');
  });
});

// ============================================
// TAGS
// ============================================

describe('Tags', () => {
  let todoId;

  beforeEach(() => {
    run(() => getState().addTodo('Con tags'));
    todoId = getState().todos[0].id;
  });

  test('addTag agrega un tag', () => {
    run(() => getState().addTag(todoId, 'urgente'));
    expect(getState().todos[0].tags).toEqual(['urgente']);
  });

  test('addTag no duplica tags', () => {
    run(() => getState().addTag(todoId, 'urgente'));
    run(() => getState().addTag(todoId, 'urgente'));
    expect(getState().todos[0].tags).toEqual(['urgente']);
  });

  test('removeTag elimina un tag', () => {
    run(() => getState().addTag(todoId, 'urgente'));
    run(() => getState().addTag(todoId, 'importante'));
    run(() => getState().removeTag(todoId, 'urgente'));

    expect(getState().todos[0].tags).toEqual(['importante']);
  });
});

// ============================================
// NOTAS Y RECORDATORIOS
// ============================================

describe('Notas y recordatorios', () => {
  let todoId;

  beforeEach(() => {
    run(() => getState().addTodo('Tarea'));
    todoId = getState().todos[0].id;
  });

  test('updateDescription actualiza la descripción', () => {
    run(() => getState().updateDescription(todoId, 'Notas importantes'));
    expect(getState().todos[0].description).toBe('Notas importantes');
  });

  test('setReminder establece un recordatorio', () => {
    const time = '2026-03-01T10:00:00.000Z';
    run(() => getState().setReminder(todoId, time));
    expect(getState().todos[0].reminder).toBe(time);
  });

  test('setPomodoroTime guarda tiempo pomodoro', () => {
    run(() => getState().setPomodoroTime(todoId, 25));
    expect(getState().todos[0].pomodoroTimeSpent).toBe(25);
  });
});

// ============================================
// ALERTAS ACTIVAS
// ============================================

describe('Alertas de recordatorio', () => {
  test('addActiveReminder y removeActiveReminder', () => {
    run(() => getState().addActiveReminder('todo-1'));

    expect(getState().activeReminders).toHaveLength(1);
    expect(getState().activeReminders[0].todoId).toBe('todo-1');

    run(() => getState().removeActiveReminder('todo-1'));
    expect(getState().activeReminders).toHaveLength(0);
  });
});

// ============================================
// OPERACIONES EN LOTE
// ============================================

describe('Operaciones en lote', () => {
  beforeEach(() => {
    run(() => getState().addTodo('Tarea 1'));
    run(() => getState().addTodo('Tarea 2'));
    run(() => getState().addTodo('Tarea 3'));

    const id1 = getState().todos[0].id;
    const id2 = getState().todos[1].id;
    run(() => getState().toggleComplete(id1));
    run(() => getState().toggleComplete(id2));
  });

  test('clearCompleted elimina solo las completadas', () => {
    run(() => getState().clearCompleted());

    expect(getState().todos).toHaveLength(1);
    expect(getState().todos[0].title).toBe('Tarea 3');
  });

  test('deleteAll elimina todas', () => {
    run(() => getState().deleteAll());
    expect(getState().todos).toHaveLength(0);
  });

  test('exportTodos retorna todas las tareas', () => {
    const exported = getState().exportTodos();
    expect(exported).toHaveLength(3);
  });

  test('importTodos agrega tareas existentes', () => {
    const nuevas = [
      { id: 'nuevo-1', title: 'Importada', completed: false, subtasks: [], tags: [] },
    ];
    run(() => getState().importTodos(nuevas));

    expect(getState().todos).toHaveLength(4);
    expect(getState().todos[3].title).toBe('Importada');
  });
});

// ============================================
// ESTADÍSTICAS
// ============================================

describe('Estadísticas', () => {
  beforeEach(() => {
    run(() => getState().addTodo('Alta', 'trabajo', 'high'));
    run(() => getState().addTodo('Media', 'personal', 'medium'));
    run(() => getState().addTodo('Baja', 'trabajo', 'low'));

    const id = getState().todos[0].id;
    run(() => getState().toggleComplete(id));

    // Agregar subtareas
    const id2 = getState().todos[1].id;
    run(() => getState().addSubtask(id2, 'Sub 1'));
    run(() => getState().addSubtask(id2, 'Sub 2'));
    const subId = getState().todos[1].subtasks[0].id;
    run(() => getState().toggleSubtask(id2, subId));

    // Agregar pomodoro
    run(() => getState().setPomodoroTime(id2, 50));
  });

  test('getStats retorna estadísticas básicas', () => {
    const stats = getState().getStats();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.active).toBe(2);
    expect(stats.completionRate).toBe(33);
  });

  test('getAdvancedStats retorna estadísticas detalladas', () => {
    const stats = getState().getAdvancedStats();
    expect(stats.totalTodos).toBe(3);
    expect(stats.completedTodos).toBe(1);
    expect(stats.activeTodos).toBe(2);
    expect(stats.highPriority).toBe(1);
    expect(stats.mediumPriority).toBe(1);
    expect(stats.lowPriority).toBe(1);
    expect(stats.totalSubtasks).toBe(2);
    expect(stats.completedSubtasks).toBe(1);
    expect(stats.totalPomodoroTime).toBe(50);
    expect(stats.completionRate).toBe(33);
  });

  test('getStats con 0 tareas no divide por cero', () => {
    run(() => getState().deleteAll());
    const stats = getState().getStats();
    expect(stats.completionRate).toBe(0);
  });

  test('getCategories retorna categorías únicas', () => {
    const cats = getState().getCategories();
    expect(cats).toContain('trabajo');
    expect(cats).toContain('personal');
    expect(cats).toHaveLength(2);
  });
});

// ============================================
// TEMA
// ============================================

describe('Tema', () => {
  test('setTheme cambia el tema', () => {
    run(() => getState().setTheme('dark'));
    expect(getState().theme).toBe('dark');
  });

  test('toggleTheme alterna entre light y dark', () => {
    expect(getState().theme).toBe('light');
    run(() => getState().toggleTheme());
    expect(getState().theme).toBe('dark');
    run(() => getState().toggleTheme());
    expect(getState().theme).toBe('light');
  });
});
