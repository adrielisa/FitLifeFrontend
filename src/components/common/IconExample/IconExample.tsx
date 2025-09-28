import React from 'react'
import { Heart, User, Settings, Dumbbell, Apple } from '../Icon'

interface IconExampleProps {
  className?: string
}

export const IconExample: React.FC<IconExampleProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-4 p-4 ${className}`}>
      {/* Ejemplo de íconos con diferentes tamaños y colores */}
      <Heart 
        size={24} 
        className="text-red-500 hover:text-red-600 cursor-pointer transition-colors" 
      />
      
      <User 
        size={20} 
        className="text-blue-500 hover:scale-110 transition-transform cursor-pointer" 
      />
      
      <Settings 
        size={22} 
        strokeWidth={1.5}
        className="text-gray-500 hover:rotate-45 transition-transform cursor-pointer" 
      />
      
      <Dumbbell 
        size={26} 
        className="text-green-500 hover:text-green-600 cursor-pointer" 
      />
      
      <Apple 
        size={24} 
        className="text-orange-500 hover:text-orange-600 cursor-pointer" 
      />
    </div>
  )
}

export default IconExample