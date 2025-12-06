# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).


## Shadcn

- Components: https://ui.shadcn.com/docs/components

## React Router Dom

- [How to pick a mode](https://reactrouter.com/start/modes#picking-a-mode)
- Mode: **Data**

Use Data Mode if you: want data features but also want to have control over bundling, data, and server abstractions
started a data router in v6.4 and are happy with it


## Date
- Date library: date-fns
- !IMPORTANT!: the date returns from BE always in UTC format