# va360-todoist

Aplicación de tareas (to-do) sencilla, organizable por **proyectos**, **colores** y **fechas límite (deadlines)**.

Este proyecto es un ejemplo práctico de mi **curso de Claude Code**: muestra cómo pasar de una idea ("quiero una app de to-do") a una aplicación funcional usando Claude Code como asistente de desarrollo, desde el scaffolding inicial hasta la organización del código.

## Funcionalidades

- Crear, renombrar, recolorear y eliminar **proyectos** (cada uno con su color).
- Crear tareas con título, fecha límite y prioridad (baja / media / alta).
- Ver **todas las tareas** o filtrar por proyecto.
- Las tareas se agrupan automáticamente según su fecha límite: **Vencidas, Hoy, Próximos 3 días, Más adelante, Sin fecha**.
- Marcar tareas como completadas (sección colapsable aparte).
- Todo se guarda automáticamente en el navegador (`localStorage`) — no requiere backend ni conexión.

## Stack técnico

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/) — build rápido y HMR instantáneo.
- [Tailwind CSS v4](https://tailwindcss.com/) — estilos.
- [Zustand](https://github.com/pmndrs/zustand) — estado global con persistencia en `localStorage`.
- [lucide-react](https://lucide.dev/) — iconos.
- [date-fns](https://date-fns.org/) — manejo de fechas.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

Otros comandos disponibles:

```bash
npm run build    # compila para producción
npm run lint     # revisa el código con oxlint
npm run preview  # sirve el build de producción localmente
```
