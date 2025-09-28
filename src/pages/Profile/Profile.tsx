import type React from "react"
import BackButton from "../../components/common/Button/BackButton"
import BottomNavigation from "../../components/common/Navigation/BottomNavigation"
// Interfaz para los datos del perfil
interface DatosPerfil {
  nombre: string
  correo: string
  edad: number
  peso: string
  estatura: string
  nivelActividad: string
  meta: string
  urlAvatar?: string
}

// Props del componente
interface ProfileProps {
  profileData?: DatosPerfil
  onBack?: () => void
  onNavigateHome?: () => void
  onNavigateExercises?: () => void
  onNavigateNutrition?: () => void
}

// Datos mock para ejemplo (reemplazar con datos reales del backend)
const datosMock: DatosPerfil = {
  nombre: "Adriel Isai",
  correo: "adrielelmaspro@gmail",
  edad: 42,
  peso: "34 kg",
  estatura: "170 cm",
  nivelActividad: "Alto",
  meta: "Ganar masa muscular",
}

const Profile: React.FC<ProfileProps> = ({
  profileData = datosMock,
  onBack,
  onNavigateHome,
  onNavigateExercises,
  onNavigateNutrition,
}) => {
  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header con botón de regreso */}
      <div className="flex items-center justify-start p-4">
        <BackButton onClick={onBack} />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center px-6 pb-24">
        {/* Avatar */}
        <div className="mb-6">
          {profileData.urlAvatar ? (
            <img
              src={profileData.urlAvatar || "/placeholder.svg"}
              alt={`Foto de perfil de ${profileData.nombre}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold border-4 border-gray-600">
              {getInitials(profileData.nombre)}
            </div>
          )}
        </div>

        {/* Nombre */}
        <h1 className="text-2xl font-bold mb-8 text-center">{profileData.nombre}</h1>

        {/* Información del perfil */}
        <div className="w-full max-w-sm space-y-4">
          {/* Correo */}
          <div className="bg-[#262626] rounded-lg p-3 flex justify-between items-center">
            <span className="text-gray-300 font-medium">Correo:</span>
            <span className="text-white">{profileData.correo}</span>
          </div>

          {/* Edad */}
          <div className="bg-[#262626] rounded-lg p-3 flex justify-between items-center">
            <span className="text-gray-300 font-medium">Edad:</span>
            <span className="text-white">{profileData.edad}</span>
          </div>

          {/* Peso */}
          <div className="bg-[#262626] rounded-lg p-3 flex justify-between items-center">
            <span className="text-gray-300 font-medium">Peso:</span>
            <span className="text-white">{profileData.peso}</span>
          </div>

          {/* Estatura */}
          <div className="bg-[#262626] rounded-lg p-3 flex justify-between items-center">
            <span className="text-gray-300 font-medium">Estatura:</span>
            <span className="text-white">{profileData.estatura}</span>
          </div>

          {/* Nivel de actividad */}
          <div className="bg-[#262626] rounded-lg p-3 flex justify-between items-center">
            <span className="text-gray-300 font-medium">Nivel de actividad:</span>
            <span className="text-white">{profileData.nivelActividad}</span>
          </div>

          {/* Meta */}
          <div className="bg-[#262626] rounded-lg p-3 flex justify-between items-center">
            <span className="text-gray-300 font-medium">Meta:</span>
            <span className="text-white">{profileData.meta}</span>
          </div>
        </div>
      </div>

      {/* Navegación inferior */}
      <BottomNavigation
        onNavigateExercises={onNavigateExercises}
        onNavigateHome={onNavigateHome}
        onNavigateNutrition={onNavigateNutrition}
      />
    </div>
  )
}

export default Profile