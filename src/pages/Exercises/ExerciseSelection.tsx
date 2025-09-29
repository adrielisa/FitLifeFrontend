import type React from "react"
import BottomNavigation from "../../components/common/Navigation/BottomNavigation"
import { Check } from "lucide-react"
import { useState } from "react"
import Header from "../../components/common/Header/Header"
import { useNavigate } from "react-router-dom"

// Interfaz para los datos de ejercicio
interface ExerciseOption {
  id: string
  name: string
  imageUrl: string
}

// Props del componente
interface ExerciseSelectionProps {
  onBack?: () => void
  onNavigateExercises?: () => void
  onNavigateHome?: () => void
  onNavigateNutrition?: () => void
  onSelectExercise?: (exerciseId: string) => void
  onCreateCustomPlan?: () => void
  exerciseOptions?: ExerciseOption[]
  userAvatar?: string
}

const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({
  onNavigateExercises,
  onNavigateHome,
  onNavigateNutrition,
  onSelectExercise,
  onCreateCustomPlan,
  exerciseOptions,
  userAvatar,
}) => {

    const navigate = useNavigate()

  // Datos mock de ejercicios
  const defaultExerciseOptions: ExerciseOption[] = [
    {
      id: "lagartijas",
      name: "Lagartijas",
      imageUrl: "/img1.jpg",
    },
    {
      id: "abdominales",
      name: "Abdominales",
      imageUrl: "/img2.jpg",
    },
    {
      id: "plancha",
      name: "Plancha",
      imageUrl: "/img3.jpg",
    },
    {
      id: "sentadillas",
      name: "Sentadillas",
      imageUrl: "/img4.jpg",
    },
    {
      id: "correr",
      name: "Correr",
      imageUrl: "/img5.jpg",
    },
    {
      id: "saltar la cuerda",
      name: "Saltar la cuerda",
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
      // Solo permitir mas de 6 selecciones
      if (newSelected.size <= 6) {
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

  const handleProfileClick = () => {
    // Lógica para navegar al perfil
    navigate('/profile')
    console.log("Navegando al perfil...")
  }

  const handleBack = () => {
    navigate(-1) // Esto regresa a la página anterior
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-20">
     {/* Header */}
      <Header
        isActive={true}
        showBackButton={true}
        onBack={handleBack}
        showProfileButton={true}
        onProfile={handleProfileClick}
        userAvatar={userAvatar}
      />

      {/* Título */}
      <div className="px-4 mb-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center">
  Selecciona ejercicios para tu plan
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
          Crear
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

export default ExerciseSelection
