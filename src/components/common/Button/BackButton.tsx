import type React from "react"
import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className = "", ariaLabel = "Regresar" }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-gray-800 rounded-lg transition-colors ${className}`}
      aria-label={ariaLabel}
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  )
}

export default BackButton