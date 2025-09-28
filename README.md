# FitLife Frontend

Una aplicación web de fitness y nutrición construida con React, TypeScript, Vite y Tailwind CSS.

## Comandos básicos git

Traer los cambios de la rama principal: 

* git pull origin main

Hacer un pull request de tu rama a main:

* git add .
* git commit -m "Nombre de los cambios"
* git push origin Bruno

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
- `npm run build` - Construye la aplicación para producción (incluye verificación de tipos)
- `npm run preview` - Previsualiza la construcción de producción localmente
- `npm run type-check` - Verifica los tipos de TypeScript sin compilar
- `npm run lint` - Ejecuta verificación de tipos y linting

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
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción y servidor de desarrollo
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Librería de íconos SVG para React

## 🌟 Características

- **Seguimiento de Ejercicios** - Monitorea entrenamientos y progreso
- **Gestión de Nutrición** - Rastrea la ingesta nutricional diaria
- **Diseño Responsivo** - Enfoque mobile-first con Tailwind CSS
- **Arquitectura Basada en Componentes** - Componentes reutilizables y mantenibles
- **Desarrollo Moderno** - Desarrollo rápido con Vite HMR

## 🔧 Desarrollo

### Agregando Nuevos Componentes

1. Crea una nueva carpeta en la categoría apropiada (`common`, `exercises`, o `nutrition`)
2. Agrega tu archivo de componente (ej., `ComponentName.tsx`)
3. Define los tipos TypeScript para las props del componente
4. Exporta el componente desde el archivo

Ejemplo de componente TypeScript:

```tsx
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
    >
      {children}
    </button>
  )
}
```

### Estilos

Este proyecto usa Tailwind CSS para los estilos. Agrega clases directamente a tus componentes:

```jsx
<div className="bg-white p-6 rounded-lg shadow">
  <h3 className="text-xl font-semibold text-gray-900 mb-2">Título</h3>
</div>
```

### Íconos

El proyecto utiliza **Lucide React** para los íconos. Hay dos enfoques recomendados:

#### Opción 1: Importación directa (recomendado para pocos íconos)

```tsx
import { Heart, User, Settings } from 'lucide-react'

export const Header = () => {
  return (
    <header className="flex items-center gap-4">
      <Heart className="w-6 h-6 text-red-500" />
      <User className="w-6 h-6 text-blue-500" />
      <Settings className="w-6 h-6 text-gray-500" />
    </header>
  )
}
```

#### Opción 2: Archivo centralizado de íconos (recomendado para muchos íconos)

Crea un archivo `src/components/common/Icon/index.ts`:

```tsx
export { 
  Heart,
  User, 
  Settings,
  Home,
  Dumbbell,
  Apple,
  Calendar,
  TrendingUp,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'
```

Luego úsalos en tus componentes:

```tsx
import { Heart, User, Settings } from '@/components/common/Icon'

export const Header = () => {
  return (
    <header className="flex items-center gap-4">
      <Heart className="w-6 h-6 text-red-500" />
      <User className="w-6 h-6 text-blue-500" />
      <Settings className="w-6 h-6 text-gray-500" />
    </header>
  )
}
```

**Propiedades comunes de los íconos:**

- `size`: Tamaño del ícono (número o string)
- `color`: Color del ícono
- `strokeWidth`: Grosor del trazo
- `className`: Clases de Tailwind CSS

```tsx
<Heart 
  size={24} 
  color="red" 
  strokeWidth={2}
  className="hover:scale-110 transition-transform" 
/>
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
