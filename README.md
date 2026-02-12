# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Frontend - Instalación y Ejecución
Este proyecto corresponde al frontend de la aplicación, desarrollado en React usando Vite, con Node.js 20.
Requisitos
•	Es obligatorio contar con:
•	Node.js v20.x
•	npm (incluido con Node.js)
Verificar la versión instalada:
node -v
npm -v
La salida debe mostrar una versión v20.x.x. En caso contrario, instalar la versión LTS correspondiente desde https://nodejs.org.
Instalación del Proyecto
1. Clonar el repositorio:
git clone https://github.com/LincolnHdz/Front_MovilidadAcademica
cd Front_MovilidadAcademica

2. Instalar dependencias:
npm install
Este comando instalará todas las dependencias definidas en el archivo package.json.
Ejecución
Modo desarrollo:
npm run dev
Vite mostrará la URL local del servidor de desarrollo en la terminal.
Compilar para producción:
npm run build
Previsualizar el build de producción localmente:
npm run preview
Scripts esperados en package.json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
