import type React from "react"
import { Dumbbell, Home, Utensils } from "lucide-react"

// Interfaz para los elementos de navegación
interface NavigationItem {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  isActive?: boolean
}

// Props del componente
interface BottomNavigationProps {
  onNavigateExercises?: () => void
  onNavigateHome?: () => void
  onNavigateNutrition?: () => void
  activeTab?: "exercises" | "home" | "nutrition"
  className?: string
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onNavigateExercises,
  onNavigateHome,
  onNavigateNutrition,
  activeTab,
  className = "",
}) => {
  // Configuración de los elementos de navegación
  const navigationItems: NavigationItem[] = [
    {
      icon: <Dumbbell className="w-6 h-6" />,
      label: "Ejercicios",
      onClick: onNavigateExercises,
      isActive: activeTab === "exercises",
    },
    {
      icon: <Home className="w-6 h-6" />,
      label: "Inicio",
      onClick: onNavigateHome,
      isActive: activeTab === "home",
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      label: "Nutrición",
      onClick: onNavigateNutrition,
      isActive: activeTab === "nutrition",
    },
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-700 ${className}`}>
      <div className="flex justify-around items-center py-4">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`p-3 rounded-lg transition-colors ${
              item.isActive ? "bg-[#262626] text-white" : "hover:bg-[#262626] text-gray-300 hover:text-white"
            }`}
            aria-label={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BottomNavigation
