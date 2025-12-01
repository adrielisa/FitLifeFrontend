import type React from "react"
import BottomNavigation from "../../components/common/Navigation/BottomNavigation"
import { Check } from "lucide-react"
import { useState, useEffect } from "react"
import Header from "../../components/common/Header/Header"
import { useNavigate } from "react-router-dom"
import Modal from "../../components/common/Modal/Modal"
import exercisePlanService, { ExercisePlan } from "../../services/api/exercisePlanService"
import { getUserId } from "../../utils/userUtils"

// Interfaz para los datos de ejercicio
interface MuscleGroupOption {
  id: string
  name: string
  imageUrl: string
  muscleGroup: string
}

const ExercisePlanSelection: React.FC = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<'plans' | 'create'>('plans')
  const [existingPlans, setExistingPlans] = useState<ExercisePlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<ExercisePlan | null>(null)
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<Set<string>>(new Set())
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const userId = getUserId() || ''

  // Grupos musculares para crear plan personalizado
  const muscleGroupOptions: MuscleGroupOption[] = [
    { id: "brazos", name: "Brazos", imageUrl: "/img1.jpg", muscleGroup: "Brazos" },
    { id: "piernas", name: "Piernas", imageUrl: "/img2.jpg", muscleGroup: "Piernas" },
    { id: "abdominales", name: "Abdominales", imageUrl: "/img3.jpg", muscleGroup: "Abdomen" },
    { id: "espalda", name: "Espalda", imageUrl: "/img4.jpg", muscleGroup: "Espalda" },
    { id: "pecho", name: "Pecho", imageUrl: "/img5.jpg", muscleGroup: "Pecho" },
    { id: "cardio", name: "Cardio", imageUrl: "/img6.jpg", muscleGroup: "Cardio" },
  ]

  useEffect(() => {
    loadExistingPlans()
  }, [])

  const loadExistingPlans = async () => {
    try {
      setIsLoading(true)
      const plans = await exercisePlanService.getUserPlans(userId)
      setExistingPlans(plans)
      
      // Si no hay planes, ir directo a crear
      if (plans.length === 0) {
        setView('create')
      }
    } catch (error) {
      console.error('Error loading plans:', error)
      setView('create')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlanSelect = (plan: ExercisePlan) => {
    setSelectedPlan(plan)
    setShowConfirmModal(true)
  }

  const handleConfirmPlanSelection = async () => {
    if (!selectedPlan) return

    try {
      setIsLoading(true)
      
      console.log('🔄 Intentando activar plan:', selectedPlan.plan_id)
      console.log('📋 Datos del plan:', selectedPlan)
      console.log('👤 UserID:', userId)
      
      await exercisePlanService.activatePlan(userId, selectedPlan.plan_id)
      
      console.log('✅ Plan activado correctamente')
      navigate('/exercises')
    } catch (error: any) {
      console.error('❌ Error al activar plan:', error)
      console.error('📋 Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      })
      
      alert(error.response?.data?.message || error.response?.data?.error || 'Error al activar el plan')
    } finally {
      setIsLoading(false)
      setShowConfirmModal(false)
    }
  }

  const handleMuscleGroupClick = (groupId: string) => {
    setSelectedMuscleGroups((prev) => {
      const newSelected = new Set(prev)
      
      if (newSelected.has(groupId)) {
        newSelected.delete(groupId)
      } else {
        if (newSelected.size < 3) {
          newSelected.add(groupId)
        }
      }
      
      return newSelected
    })
  }

  const handleCreatePlanClick = () => {
    if (selectedMuscleGroups.size === 0) {
      alert('Por favor selecciona al menos un grupo muscular')
      return
    }
    
    const selectedGroups = Array.from(selectedMuscleGroups).map(id => {
      const group = muscleGroupOptions.find(g => g.id === id)
      return group?.muscleGroup || id
    })
    
    navigate('/exercise-selection', { 
      state: { selectedMuscleGroups: selectedGroups } 
    })
  }

  const handleBack = () => {
    if (view === 'create' && existingPlans.length > 0) {
      setView('plans')
      setSelectedMuscleGroups(new Set())
    } else {
      navigate('/exercises')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500'
      case 'intermediate': return 'bg-yellow-500'
      case 'advanced': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante'
      case 'intermediate': return 'Intermedio'
      case 'advanced': return 'Avanzado'
      default: return difficulty
    }
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

      {/* Vista de planes existentes */}
      {view === 'plans' && (
        <>
          <div className="px-4 mb-6">
            <h1 className="text-2xl font-bold text-center mb-2">
              Selecciona un plan
            </h1>
            <p className="text-gray-400 text-center text-sm">
              Elige uno de tus planes o crea uno nuevo
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {existingPlans.length > 0 && (
                <div className="px-4 mb-6">
                  <div className="space-y-4">
                    {existingPlans.map((plan) => (
                      <button
                        key={plan.plan_id}
                        onClick={() => handlePlanSelect(plan)}
                        className="w-full bg-[#2d2d2d] rounded-xl p-4 hover:bg-[#3d3d3d] transition-colors text-left"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold">{plan.plan_name}</h3>
                          {plan.is_active && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Activo
                            </span>
                          )}
                        </div>
                        {plan.description && (
                          <p className="text-gray-400 text-sm mb-3">{plan.description}</p>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <span className={`${getDifficultyColor(plan.difficulty_level)} text-white text-xs px-2 py-1 rounded-full`}>
                            {getDifficultyText(plan.difficulty_level)}
                          </span>
                          <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                            {plan.duration_weeks} semanas
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-10">
                <button
                  onClick={() => setView('create')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
                >
                  Crear plan personalizado
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Vista de creación de plan */}
      {view === 'create' && (
        <>
          <div className="px-4 mb-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              Crea tu plan personalizado
            </h1>
            <p className="text-gray-400 text-center text-sm">
              Selecciona hasta 3 grupos musculares
            </p>
          </div>

          <div className="px-10 mb-8">
            <div className="grid grid-cols-2 gap-5">
              {muscleGroupOptions.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleMuscleGroupClick(group.id)}
                  className="relative aspect-square rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={group.imageUrl || "/placeholder.svg"}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />

                  {selectedMuscleGroups.has(group.id) && (
                    <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-gray-900" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#262626]/40 group-hover:bg-black/30 transition-colors" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg text-center px-2">
                      {group.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-10">
            <button
              onClick={handleCreatePlanClick}
              disabled={selectedMuscleGroups.size === 0}
              className={`w-full ${
                selectedMuscleGroups.size === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white font-semibold py-4 rounded-xl transition-colors`}
            >
              Continuar
            </button>
          </div>
        </>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar selección de plan"
      >
        <div className="py-4">
          {selectedPlan && (
            <>
              <h3 className="text-xl font-bold mb-2">{selectedPlan.plan_name}</h3>
              {selectedPlan.description && (
                <p className="text-gray-400 mb-4">{selectedPlan.description}</p>
              )}
              <div className="flex gap-2 mb-6">
                <span className={`${getDifficultyColor(selectedPlan.difficulty_level)} text-white text-xs px-2 py-1 rounded-full`}>
                  {getDifficultyText(selectedPlan.difficulty_level)}
                </span>
                <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                  {selectedPlan.duration_weeks} semanas
                </span>
              </div>
              <p className="text-center mb-6">
                ¿Deseas activar este plan como tu plan principal?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPlanSelection}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Activando...' : 'Confirmar'}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <BottomNavigation />
    </div>
  )
}

export default ExercisePlanSelection
