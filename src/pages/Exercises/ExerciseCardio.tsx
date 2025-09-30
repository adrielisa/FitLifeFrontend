import type React from "react"
import { useState } from "react"
import { Flame } from "lucide-react"
import Header from "../../components/common/Header/Header"
import BottomNavigation from "../../components/common/Navigation/BottomNavigation"
import { useNavigate } from "react-router-dom"

// Interfaz para la información del ejercicio
interface ExerciseInfo {
  name: string
  image: string
  series: string
  repetitions: string
  type: string
  restTime: string
  musclesWorked: string
  caloriesPerMinute: number
}

// Props del componente
interface ExerciseCardioProps {
  exercise?: ExerciseInfo
  onBack?: () => void
  onProfile?: () => void
  onAdd?: () => void
  onNavigateExercises?: () => void
  onNavigateHome?: () => void
  onNavigateNutrition?: () => void
  userAvatar?: string
}

const ExerciseCardio: React.FC<ExerciseCardioProps> = ({
  exercise,
  onAdd,
  onNavigateExercises,
  onNavigateHome,
  onNavigateNutrition,
  userAvatar
}) => {
  // Datos de ejemplo (mock data)
  const [exerciseData] = useState<ExerciseInfo>(
    exercise || {
      name: "Caminadora",
      image: "/mujer corriendose en la caminadora.jpg",
      series: "2 x 20",
      repetitions: "20",
      type: "Cardio",
      restTime: "10 minutos",
      musclesWorked: "Glúteos, cuadriceps",
      caloriesPerMinute: 50,
    },
  )

  const navigate = useNavigate()

   const handleProfileClick = () => {
    // Lógica para navegar al perfil
    navigate('/profile')
    console.log("Navegando al perfil...")
  }

  const handleBack = () => {
    navigate(-1) // Esto regresa a la página anterior
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-24">
      {/* Header con botón de regreso y perfil */}
      <Header
        isActive={true}
        showBackButton={true}
        onBack={handleBack}
        showProfileButton={true}
        onProfile={handleProfileClick}
        userAvatar={userAvatar}
      />

      {/* Contenido principal */}
      <div className="px-6 space-y-6">
        {/* Título del ejercicio */}
        <h1 className="text-2xl font-bold">{exerciseData.name}</h1>

        {/* Imagen/Video del ejercicio */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[#262626]">
          <img
            src={exerciseData.image || "/placeholder.svg"}
            alt={exerciseData.name}
            className="w-full h-full p-2 object-cover"
          />
        </div>

        {/* Grid de información - Primera fila */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tiempo */}
          <div className="bg-[#262626] rounded-2xl p-3 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Tiempo</h3>
            <div className="flex items-center gap-3">
              
              <span className="text-lg text-gray-400">{exerciseData.restTime}</span>
            </div>
          </div>

          {/* Tipo de ejercicio */}
          <div className="bg-[#262626] rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Tipo de ejercicio</h3>
            <span className="text-lg font-semibold">{exerciseData.type}</span>
          </div>
        </div>

        {/* Grid de información - Segunda fila */}
        <div className="grid grid-cols-2 gap-4">
          {/* Músculos trabajados */}
          <div className="bg-[#262626] rounded-2xl p-3 space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Músculos trabajados</h3>
            <p className="text-base">{exerciseData.musclesWorked}</p>
          </div>

          {/* Calorías por minuto */}
          <div className="bg-[#262626] rounded-2xl p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-medium text-gray-300">Calorías x minuto</h3>
            </div>
            <p className="text-2xl font-bold">{exerciseData.caloriesPerMinute} kcal</p>
          </div>
        </div>

        {/* Botón de añadir */}
        <button
          onClick={onAdd}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-2xl transition-colors duration-200 text-lg mt-4"
        >
          Añadir
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

export default ExerciseCardio
