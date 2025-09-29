"use client"

import type React from "react"
import BackButton from "../Button/BackButton"

// Props del componente Header
interface HeaderProps {
  // Control de visibilidad del header
  isActive?: boolean

  // Props para el botón de regreso
  showBackButton?: boolean
  onBack?: () => void

  // Props para el botón de perfil
  showProfileButton?: boolean
  onProfile?: () => void
  userAvatar?: string

  // Personalización
  className?: string
}

const Header: React.FC<HeaderProps> = ({
  isActive = true,
  showBackButton = true,
  onBack,
  showProfileButton = true,
  onProfile,
  userAvatar,
  className = "",
}) => {
  // Si no está activo, no renderizar nada
  if (!isActive) {
    return null
  }

  return (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      {/* Botón de regreso */}
      <div className="flex-1">
        {showBackButton ? (
          <BackButton onClick={onBack} className="text-white" />
        ) : (
          <div className="w-10 h-10" /> // Espaciador para mantener el layout
        )}
      </div>

      {/* Espacio central (vacío para mantener el diseño) */}
      <div className="flex-1" />

      {/* Botón de perfil */}
      <div className="flex-1 flex justify-end">
        {showProfileButton ? (
          <button
            onClick={onProfile}
            className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 hover:ring-2 hover:ring-white/20 transition-all duration-200"
            aria-label="Perfil de usuario"
          >
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
          </button>
        ) : (
          <div className="w-12 h-12" /> // Espaciador para mantener el layout
        )}
      </div>
    </div>
  )
}

export default Header
