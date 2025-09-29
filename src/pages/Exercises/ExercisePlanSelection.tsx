{/*Prueba*/}

import type React from "react"
import BackButton from "../../components/common/Button/BackButton"
import BottomNavigation from "../../components/common/Navigation/BottomNavigation"
import { Check } from "lucide-react"
import { useState } from "react"

// Interfaz para los datos de ejercicio
interface ExerciseOption {
  id: string
  name: string
  imageUrl: string
}

// Props del componente
interface ExercisePlanSelectionProps {
  onBack?: () => void
  onNavigateExercises?: () => void
  onNavigateHome?: () => void
  onNavigateNutrition?: () => void
  onSelectExercise?: (exerciseId: string) => void
  onCreateCustomPlan?: () => void
  exerciseOptions?: ExerciseOption[]
  userAvatar?: string
}

const ExercisePlanSelection: React.FC<ExercisePlanSelectionProps> = ({
  onBack,
  onNavigateExercises,
  onNavigateHome,
  onNavigateNutrition,
  onSelectExercise,
  onCreateCustomPlan,
  exerciseOptions,
  userAvatar,
}) => {
  // Datos mock de ejercicios
  const defaultExerciseOptions: ExerciseOption[] = [
    {
      id: "brazos",
      name: "Brazos",
      imageUrl: "/img1.jpg",
    },
    {
      id: "piernas",
      name: "Piernas",
      imageUrl: "/img2.jpg",
    },
    {
      id: "abdominales",
      name: "Abdominales",
      imageUrl: "/img3.jpg",
    },
    {
      id: "espalda",
      name: "Espalda",
      imageUrl: "/img4.jpg",
    },
    {
      id: "pecho",
      name: "Pecho",
      imageUrl: "/img5.jpg",
    },
    {
      id: "cardio",
      name: "Cardio",
      imageUrl: "/img6.jpg",
    },
  ]

  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set())

  const exercises = exerciseOptions || defaultExerciseOptions

  const handleExerciseClick = (exerciseId: string) => {
  setSelectedExercises((prev) => {
    const newSelected = new Set(prev)

    if (newSelected.has(exerciseId)) {
      // Si ya está seleccionado, lo quitamos
      newSelected.delete(exerciseId)
    } else {
      // Solo permitir máximo 2 selecciones
      if (newSelected.size < 2) {
        newSelected.add(exerciseId)
      }
    }

    return newSelected
  })

  if (onSelectExercise) {
    onSelectExercise(exerciseId)
  }
}

  const handleCustomPlanClick = () => {
    if (onCreateCustomPlan) {
      onCreateCustomPlan()
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <BackButton onClick={onBack} className="text-white" />

        {/* Avatar del usuario */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
          {userAvatar ? (
            <img
              src={userAvatar || "/placeholder.svg"}
              alt="Avatar del usuario"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br flex items-center justify-center">
              <span className="text-white font-semibold text-sm">U</span>
            </div>
          )}
        </div>
      </div>

      {/* Título */}
      <div className="px-4 mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center">
  Selecciona un plan de tu interés
</h1>
      </div>

      {/* Grid de opciones de ejercicios */}
      <div className="px-10 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => handleExerciseClick(exercise.id)}
              className="relative aspect-square rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-200"
            >
              {/* Imagen de fondo */}
              <img
                src={exercise.imageUrl || "/placeholder.svg"}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />

              {selectedExercises.has(exercise.id) && (
                <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-gray-900" />
                </div>
              )}

              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-[#262626]/40 group-hover:bg-black/30 transition-colors" />

              {/* Texto del ejercicio */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-base md:text-lg lg:text-xl text-center px-2">{exercise.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botón de crear plan personalizado */}
      <div className="px-10 mb-8">
        <button
          onClick={handleCustomPlanClick}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-colors duration-200 text-sm md:text-base lg:text-lg"
        >
          Crear plan personalizado
        </button>
      </div>

      {/* Navegación inferior */}
      <BottomNavigation
        onNavigateExercises={onNavigateExercises}
        onNavigateHome={onNavigateHome}
        onNavigateNutrition={onNavigateNutrition}
        activeTab="exercises"
      />
    </div>
  )
}

export default ExercisePlanSelection
