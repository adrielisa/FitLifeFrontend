import type React from "react"
import { Dumbbell, Home, Utensils } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

// Interfaz para los elementos de navegación
interface NavigationItem {
  icon: React.ReactNode
  label: string
  path: string
}

// Props del componente (simplificadas)
interface BottomNavigationProps {
  className?: string
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  className = "",
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Configuración de los elementos de navegación
  const navigationItems: NavigationItem[] = [
    {
      icon: <Dumbbell className="w-6 h-6" />,
      label: "Ejercicios",
      path: "/exercises",
    },
    {
      icon: <Home className="w-6 h-6" />,
      label: "Inicio",
      path: "/home",
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      label: "Nutrición",
      path: "/meals",
    },
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-700 ${className}`}>
      <div className="flex justify-around items-center py-4">
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`p-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-[#262626] text-white" 
                  : "hover:bg-[#262626] text-gray-300 hover:text-white"
              }`}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation