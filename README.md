# 📋 Gestor de Tareas Profesional - TODO App

Una aplicación moderna y completa de gestión de tareas construida con React 18, diseñada con patrones profesionales, animaciones suaves y todas las funcionalidades que necesitas para organizar tu trabajo.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Zustand](https://img.shields.io/badge/Zustand-4.4.6-302D2D?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.16-000?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🌟 Características Principales

### ✅ Gestión de Tareas
- **CRUD Completo**: Crear, leer, actualizar y eliminar tareas
- **Estados de Tarea**: Completadas, activas, atrasadas
- **Prioridades**: Alta, Media, Baja con indicadores visuales
- **Fechas de Vencimiento**: Con alertas para tareas atrasadas
- **Categorías**: Organiza tus tareas por categoría personalizada

### 🔔 Sistema Avanzado de Recordatorios
- **Recordatorios con Fecha/Hora**: Establece recordatorios precisos
- **Alerta Modal Profesional**: Interfaz visual impactante cuando llega el recordatorio
- **Sonido Persistente**: Web Audio API con sonido de alerta cada 3 segundos
- **Control de Sonido**: Toggle para silenciar sin cerrar la alerta
- **Auto-Descarte**: Permanece visible hasta que el usuario lo acepte

### 📊 Dashboard de Estadísticas
- **Estadísticas Generales**: Total, completadas, activas, atrasadas
- **Distribución por Prioridad**: Gráfico de barras con desglose
- **Progreso de Subtareas**: Visualización circular de progreso
- **Tiempo Total Pomodoro**: Acumulado de sesiones completadas
- **Datos en Tiempo Real**: Actualizaciones instantáneas

### 🏷️ Sistema de Etiquetas
- **Etiquetas Múltiples**: Asigna múltiples etiquetas por tarea
- **Códigos de Color**: 8 colores diferentes para categorizar
- **Gestión Rápida**: Agregar/eliminar etiquetas sin recargar

### ✏️ Notas y Descripciones
- **Texto Enriquecido**: Agregar descripciones largas a tareas
- **Edición Rápida**: Toggle entre vista y edición
- **Persistencia**: Guarda automáticamente en localStorage

### 📝 Sistema de Subtareas
- **Subtareas Anidadas**: Crea subtareas dentro de tareas
- **Progreso Visual**: Barra de progreso por tarea
- **Marcar Completadas**: Cada subtarea se puede marcar individual
- **Contador Automático**: Muestra progreso (2/5 completadas)

### ⏲️ Pomodoro Timer
- **Sesiones de 25 Minutos**: Timer estándar de Pomodoro
- **Pausa y Reanuda**: Controla el flujo de trabajo
- **Reiniciar**: Comienza una nueva sesión
- **Contadores**: Número de sesiones y tiempo total

### 🔍 Filtrado y Búsqueda
- **Filtros por Estado**: Todas, Activas, Completadas
- **Filtro por Categoría**: Búsqueda rápida de categorías
- **Ordenamiento**: Por fecha, prioridad, alfabético

### 🎨 Tema y Personalización
- **Modo Oscuro/Claro**: Toggle automático con persistencia
- **Sistema de Colores**: Paleta profesional con CSS variables
- **Responsive Design**: Funciona perfecto en móvil, tablet y desktop

### ⚠️ Alertas Profesionales
- **Diálogos de Confirmación**: Modal para acciones destructivas
- **Gradientes Animados**: Diseño visual profesional
- **Backdrop Blur**: Efecto overlay moderno
- **Animaciones**: Slide-up y bounce effects

### 💾 Persistencia
- **localStorage Automático**: Guarda todos los datos automáticamente
- **Sincronización**: Actualizaciones en tiempo real
- **Exportación e Importación**: JSON support

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI Library
- **React DOM 18.2.0** - Browser rendering
- **Zustand 4.4.6** - State management
- **Framer Motion 10.16.16** - Animations
- **React Icons 4.12.0** - Icons
- **React Hot Toast 2.4.1** - Notifications
- **dayjs 1.11.10** - Date manipulation
- **Web Audio API** - Sound generation

---

## 📦 Instalación

### Prerrequisitos
- Node.js v16+ y npm v7+
- Git

### Pasos

```bash
# Clonar
git clone https://github.com/omarhernandezrey/57-curso-react-patrones-render.git
cd 57-curso-react-patrones-render

# Instalar
npm install

# Iniciar
npm start

# Build
npm run build
```

---

## 🚀 Uso Rápido

### Crear Tarea
1. Escribe título en el formulario
2. Selecciona categoría, prioridad, fecha (opcional)
3. Presiona Enter

### Recordatorio
1. Expande tarea (▼)
2. Selecciona "🔔 Recordatorio"
3. Establece fecha/hora
4. Presiona "✓ Establecer"

### Subtareas
1. Expande tarea
2. Ve a "📋 Subtareas"
3. Agrega nueva subtarea

### Pomodoro
1. Expande tarea
2. Ve a "⏲️ Pomodoro"
3. Presiona "Iniciar"

### Estadísticas
- Haz clic en "📊 Estadísticas"

---

## 📁 Estructura

```
src/
├── AppModern/
│   ├── index.js (App)
│   ├── Header.js
│   ├── Sidebar.js
│   ├── TodoContainer.js
│   ├── AddTodoForm.js
│   ├── TodoItem.js
│   ├── Dashboard.js
│   ├── Subtasks.js
│   ├── Tags.js
│   ├── Notes.js
│   ├── Reminder.js
│   ├── ReminderAlert.js
│   ├── PomodoroTimer.js
│   ├── ConfirmDialog.js
│   └── EmptyState.js
├── styles/
│   └── [Archivos CSS modulares]
├── store.js (Zustand)
├── constants.js
└── index.js
```

---

## 🧠 State Management

Zustand store con persistencia automática en localStorage:

```javascript
// Métodos principales
addTodo(title, category, priority, dueDate)
toggleComplete(id)
deleteTodo(id)
updateTodo(id, updates)
getFilteredTodos()
getStats()
getAdvancedStats()

// Subtareas
addSubtask(todoId, title)
toggleSubtask(todoId, subtaskId)
deleteSubtask(todoId, subtaskId)

// Etiquetas
addTag(todoId, tagName)
removeTag(todoId, tagName)

// Recordatorios
setReminder(todoId, reminderDate)
addActiveReminder(todoId)
removeActiveReminder(todoId)
```

---

## 🎨 Temas

CSS variables para tema dinámico:
- `--bg-primary`, `--bg-secondary`: Fondos
- `--text-primary`, `--text-secondary`: Textos
- `--accent-blue`, `--accent-red`, `--accent-green`: Acentos
- `--border-color`: Bordes

---

## 🔊 Sonido

Web Audio API sin archivos externos:
- Dos tonos: 880Hz y 1000Hz
- Repite cada 3 segundos
- Silenciable sin cerrar alerta

Compatibilidad:
- ✅ Chrome, Firefox, Safari, Edge
- ❌ IE

---

## 🐛 Troubleshooting

**Sonido no funciona**
- Verifica que no esté silenciado el navegador
- Algunos navegadores requieren interacción del usuario primero

**Tareas no se guardan**
- Verifica localStorage en DevTools
- Limpia cache del navegador

**Animaciones lentas**
- Desactiva otros programas
- Intenta otro navegador

---

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [dayjs](https://day.js.org/)

---

## 🤝 Contribuciones

1. Fork el repositorio
2. Crea rama feature (`git checkout -b feature/NuevaFuncion`)
3. Commit (`git commit -m 'Add NuevaFuncion'`)
4. Push (`git push origin feature/NuevaFuncion`)
5. Pull Request

---

## 📄 Licencia

MIT License

---

## 👤 Autor

**Omar Hernández**
- GitHub: [@omarhernandezrey](https://github.com/omarhernandezrey)

---

<div align="center">

**Hecho con ❤️ por Omar Hernández**

¡Dale una ⭐ en GitHub si te gusta!

</div>
