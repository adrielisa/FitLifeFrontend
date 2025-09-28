# FitLife Frontend

Una aplicación web de fitness y nutrición construida con React, Vite y Tailwind CSS.

## 🚀 Comenzando

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:

```bash
git clone <url-de-tu-repositorio>
cd fitlifefrontend
```

2. Instala las dependencias:

```bash
npm install
```

### Ejecutar la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción localmente

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── common/              # Componentes compartidos
│   │   ├── Header/
│   │   ├── Navigation/
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── ProgressBar/
│   ├── exercises/           # Componentes relacionados con ejercicios
│   │   ├── ExerciseCard/
│   │   ├── ExerciseVideo/
│   │   ├── WeeklyProgress/
│   │   ├── ExerciseSelector/
│   │   └── WorkoutControls/
│   └── nutrition/           # Componentes relacionados con nutrición
│       ├── FoodItem/
│       ├── CalorieTracker/
│       ├── FoodRecommendation/
│       ├── FoodHistory/
│       └── Calendar/
├── pages/                   # Componentes de páginas principales
│   ├── Home/
│   ├── Exercises/
│   └── Nutrition/
├── services/                # Servicios de API y almacenamiento
│   ├── api/                 # Comunicación con API del backend
│   └── storage/             # Utilidades de almacenamiento local
├── hooks/                   # Hooks personalizados de React
├── context/                 # Proveedores de contexto de React
├── utils/                   # Funciones de utilidad
└── assets/                  # Recursos estáticos
    └── images/
```

## 🛠 Stack Tecnológico

- **React 19** - Librería de interfaz de usuario
- **Vite** - Herramienta de construcción y servidor de desarrollo
- **Tailwind CSS** - Framework CSS utility-first
- **JavaScript** - Lenguaje de programación

## 🌟 Características

- **Seguimiento de Ejercicios** - Monitorea entrenamientos y progreso
- **Gestión de Nutrición** - Rastrea la ingesta nutricional diaria
- **Diseño Responsivo** - Enfoque mobile-first con Tailwind CSS
- **Arquitectura Basada en Componentes** - Componentes reutilizables y mantenibles
- **Desarrollo Moderno** - Desarrollo rápido con Vite HMR

## 🔧 Desarrollo

### Agregando Nuevos Componentes

1. Crea una nueva carpeta en la categoría apropiada (`common`, `exercises`, o `nutrition`)
2. Agrega tu archivo de componente (ej., `ComponentName.jsx`)
3. Exporta el componente desde el archivo

### Estilos

Este proyecto usa Tailwind CSS para los estilos. Agrega clases directamente a tus componentes:

```jsx
<div className="bg-white p-6 rounded-lg shadow">
  <h3 className="text-xl font-semibold text-gray-900 mb-2">Título</h3>
</div>
```

### Integración con API

Los servicios de API están ubicados en `src/services/api/`. Cada archivo de servicio corresponde a un dominio específico:

- `exerciseService.js` - Llamadas API relacionadas con ejercicios
- `nutritionService.js` - Llamadas API relacionadas con nutrición
- `userService.js` - Llamadas API de gestión de usuarios
- `workoutService.js` - Llamadas API relacionadas con entrenamientos
- `recommendationService.js` - Llamadas API de recomendaciones de IA

## 📱 Integración con Backend

Este frontend está diseñado para trabajar con una API backend separada. Actualiza los endpoints de la API en `src/services/api/endpoints.js` para que coincidan con la URL de tu backend.

## 🤝 Contribuyendo

1. Crea una nueva rama para tu característica
2. Realiza tus cambios
3. Prueba tus cambios
4. Envía un pull request
