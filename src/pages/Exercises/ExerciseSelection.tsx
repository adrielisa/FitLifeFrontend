import type React from "react"
import BottomNavigation from "../../components/common/Navigation/BottomNavigation"
import { Check } from "lucide-react"
import { useState, useEffect } from "react"
import Header from "../../components/common/Header/Header"
import { useNavigate, useLocation } from "react-router-dom"
import exercisePlanService from "../../services/api/exercisePlanService"
import exerciseService, { Exercise } from "../../services/api/exerciseService"
import { getUserId } from "../../utils/userUtils"

const ExerciseSelection: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedMuscleGroups = location.state?.selectedMuscleGroups as string[] || []

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const userId = getUserId() || ''

  useEffect(() => {
    if (selectedMuscleGroups.length === 0) {
      alert('No hay grupos musculares seleccionados')
      navigate('/exercisesPlan')
      return
    }
    loadExercises()
  }, [selectedMuscleGroups])

  const loadExercises = async () => {
    try {
      setIsLoading(true)
      
      // Cargar todos los ejercicios del backend
      const allExercises = await exerciseService.getAll()
      
      // Filtrar por grupos musculares seleccionados
      const filteredExercises = allExercises.filter(ex => 
        selectedMuscleGroups.includes(ex.muscle_group)
      )
      
      // Si no hay ejercicios en el backend, mostrar mensaje
      if (filteredExercises.length === 0) {
        console.log('No hay ejercicios en el backend para estos grupos musculares')
        setExercises([])
      } else {
        setExercises(filteredExercises)
      }
    } catch (error) {
      console.error('Error loading exercises:', error)
      setExercises([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExerciseClick = (exerciseId: string) => {
    setSelectedExercises((prev) => {
      const newSelected = new Set(prev)

      if (newSelected.has(exerciseId)) {
        newSelected.delete(exerciseId)
      } else {
        // Permitir seleccionar hasta 10 ejercicios
        if (newSelected.size < 10) {
          newSelected.add(exerciseId)
        } else {
          alert('Puedes seleccionar máximo 10 ejercicios')
        }
      }

      return newSelected
    })
  }

  const handleCreatePlan = async () => {
    if (selectedExercises.size === 0) {
      alert('Por favor selecciona al menos un ejercicio')
      return
    }

    try {
      setIsCreating(true)

      if (!userId) {
        alert('Usuario no encontrado. Por favor inicia sesión nuevamente.')
        navigate('/login')
        return
      }

      // 1. Crear el plan de ejercicio con los IDs de ejercicios seleccionados
      const planName = `Plan ${selectedMuscleGroups.join(' + ')}`
      const selectedExerciseIds = Array.from(selectedExercises)
      
      console.log('📝 Creando plan con ejercicios:', selectedExerciseIds)
      
      const plan = await exercisePlanService.createPlan({
        user_id: userId,
        plan_name: planName,
        description: `Plan personalizado de ${selectedMuscleGroups.join(', ')}`,
        difficulty_level: 'intermediate',
        duration_weeks: 8,
        exercise_ids: selectedExerciseIds  // ✅ Enviar IDs de ejercicios
      })

      console.log('✅ Plan creado exitosamente:', plan)
      console.log('📋 Plan ID recibido:', plan.plan_id)

      // 2. Activar el plan automáticamente
      console.log('� Activando plan automáticamente...')
      console.log('👤 Para el usuario:', userId)
      try {
        await exercisePlanService.activatePlan(userId, plan.plan_id)
        console.log('✅ Plan activado correctamente')
      } catch (activationError: any) {
        console.error('❌ Error al activar plan:', activationError)
        console.error('📋 Detalles del error:', {
          status: activationError.response?.status,
          statusText: activationError.response?.statusText,
          data: activationError.response?.data,
          url: activationError.config?.url,
          method: activationError.config?.method
        })
        // Continuar aunque falle la activación
      }

      alert('Plan creado exitosamente')
      navigate('/exercises')
    } catch (error: any) {
      console.error('Error creating plan:', error)
      alert(error.response?.data?.message || 'Error al crear el plan. Por favor intenta nuevamente.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-20">
      <Header
        isActive={true}
        showBackButton={true}
        onBack={handleBack}
        showProfileButton={true}
        onProfile={() => navigate('/profile')}
        userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
      />

      <div className="px-4 mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Selecciona ejercicios para tu plan
        </h1>
        <p className="text-gray-400 text-center text-sm">
          {selectedMuscleGroups.join(', ')} • {selectedExercises.size} seleccionados
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="px-4 py-20 text-center">
          <p className="text-gray-400 mb-4">
            No hay ejercicios disponibles en el backend para los grupos musculares seleccionados.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contacta al administrador para agregar ejercicios o selecciona otros grupos musculares.
          </p>
          <button
            onClick={() => navigate('/exercisesPlan')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Volver a selección
          </button>
        </div>
      ) : (
        <>
          <div className="px-10 mb-8">
            <div className="grid grid-cols-2 gap-5">
              {exercises.map((exercise) => (
                <button
                  key={exercise.exercise_id}
                  onClick={() => handleExerciseClick(exercise.exercise_id!)}
                  className="relative aspect-square rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-200 bg-[#2d2d2d]"
                >
                  {selectedExercises.has(exercise.exercise_id!) && (
                    <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center z-10">
                      <Check className="w-5 h-5 text-gray-900" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-white font-bold text-lg text-center mb-2">
                      {exercise.name}
                    </span>
                    <span className="text-orange-400 text-sm">
                      {exercise.calories_per_minute} cal/min
                    </span>
                    <span className="text-gray-400 text-xs mt-1">
                      {exercise.difficulty_level}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-10">
            <button
              onClick={handleCreatePlan}
              disabled={isCreating || selectedExercises.size === 0}
              className={`w-full ${
                isCreating || selectedExercises.size === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white font-semibold py-4 rounded-xl transition-colors`}
            >
              {isCreating ? 'Creando plan...' : `Crear plan (${selectedExercises.size} ejercicios)`}
            </button>
          </div>
        </>
      )}

      <BottomNavigation />
    </div>
  )
}

export default ExerciseSelection
