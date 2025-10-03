import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import PlanHeader from "../../components/exercises/PlanHeader/PlanHeader";
import StartExerciseButton from "../../components/exercises/StartExerciseButton/StartExerciseButton";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import { useWorkoutSession } from "../../context/WorkoutSessionContext";
import exercisePlanService, { ExercisePlan } from "../../services/api/exercisePlanService";
import { Exercise } from "../../services/api/exerciseService";
import { getUserId } from "../../utils/userUtils";

export default function WorkoutPlan() {
    const navigate = useNavigate();
    const { startSession, weeklyStats, refreshWeeklyStats } = useWorkoutSession();
    const [activePlan, setActivePlan] = useState<ExercisePlan | null>(null);
    const [planExercises, setPlanExercises] = useState<Exercise[]>([]);
    const [isStarting, setIsStarting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = getUserId() || '';

    useEffect(() => {
        loadPlanData();
    }, []);

    const loadPlanData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('🔄 Cargando datos del plan...');
            console.log('👤 UserID:', userId);
            
            // Cargar plan activo
            const plan = await exercisePlanService.getActivePlan(userId);
            console.log('📋 Plan activo obtenido:', plan);
            
            if (!plan) {
                console.log('⚠️ No hay plan activo, redirigiendo a selección de plan');
                navigate('/exercisesPlan');
                return;
            }
            setActivePlan(plan);

            // Cargar ejercicios del plan (todos los días son iguales)
            console.log('📋 Cargando ejercicios para el plan:', plan.plan_id);
            
            try {
                const exercises = await exercisePlanService.getPlanExercises(plan.plan_id);
                console.log('✅ Ejercicios cargados:', exercises);
                setPlanExercises(exercises || []);
            } catch (exerciseError: any) {
                console.error('⚠️ Error al cargar ejercicios:', exerciseError);
                console.error('📋 Detalles:', exerciseError.response?.data);
                // No lanzar error, simplemente no hay ejercicios
                setPlanExercises([]);
            }

            // Cargar estadísticas (no crítico, puede fallar)
            try {
                await refreshWeeklyStats(userId);
                console.log('✅ Estadísticas cargadas');
            } catch (statsError: any) {
                console.error('⚠️ Error al cargar estadísticas:', statsError);
                // No es crítico, continuar
            }
        } catch (error: any) {
            console.error('❌ Error loading plan:', error);
            console.error('📋 Detalles completos:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(error.response?.data?.message || 'Error al cargar el plan de entrenamiento');
        } finally {
            setIsLoading(false);
        }
    };

    // Preparar datos de progreso semanal desde las estadísticas
    const getWeekData = () => {
        const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        const today = new Date().getDay();
        const adjustedToday = today === 0 ? 6 : today - 1;

        return days.map((day, index) => {
            const sessionsCount = weeklyStats?.sessionsPerDay 
                ? Object.entries(weeklyStats.sessionsPerDay).filter(([date]) => {
                    const dayOfWeek = new Date(date).getDay();
                    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                    return adjustedDay === index;
                }).length
                : 0;

            return {
                day,
                completed: sessionsCount > 0,
                isToday: index === adjustedToday
            };
        });
    };

    const weekData = getWeekData();

    const handleBack = () => {
        navigate('/exercises');
    };

    const handleProfile = () => {
        alert("Ir a perfil de usuario...");
        // navigate('/profile');
    };

    const handleStartExercise = async () => {
        if (!activePlan || planExercises.length === 0) {
            alert('No hay ejercicios programados para hoy');
            return;
        }

        try {
            setIsStarting(true);
            
            // Iniciar sesión de entrenamiento
            await startSession({
                user_id: userId,
                plan_id: activePlan.plan_id,
                exercises_total: planExercises.length
            });

            // Navegar a los detalles del ejercicio con los ejercicios cargados
            navigate('/exercise-detail', { 
                state: { 
                    planExercises,
                    planName: activePlan.plan_name 
                } 
            });
        } catch (error: any) {
            console.error('Error starting session:', error);
            alert(error.message || 'Error al iniciar sesión de entrenamiento');
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2d2d2d] pb-20">
            <Header
                isActive={true}
                showBackButton={true}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-gray-400">Cargando plan de entrenamiento...</p>
                </div>
            ) : error ? (
                <div className="px-4 py-20">
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 mb-4">
                        <h3 className="text-red-500 font-bold mb-2">Error</h3>
                        <p className="text-gray-300">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/exercisesPlan')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors"
                    >
                        Ir a selección de plan
                    </button>
                </div>
            ) : (
                <>
                    <PlanHeader planName={activePlan?.plan_name || "Plan de entrenamiento"} />

                    <div className="px-4 mb-8">
                        <div className="flex justify-between items-center">
                            {weekData.map((day, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <span className="text-gray-400 text-sm mb-3">{day.day}</span>
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${day.completed
                                            ? 'bg-white border-2 border-white'
                                            : 'bg-[#404040] border-2 border-[#404040]'
                                        }`}>
                                        {day.completed && (
                                            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {planExercises.length === 0 ? (
                        <div className="px-4 py-10">
                            <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6 mb-4">
                                <h3 className="text-yellow-500 font-bold mb-2">Sin ejercicios</h3>
                                <p className="text-gray-300">Este plan no tiene ejercicios asignados.</p>
                                <p className="text-gray-400 text-sm mt-2">Crea un nuevo plan o edita este plan para agregar ejercicios.</p>
                            </div>
                        </div>
                    ) : null}

                    <StartExerciseButton 
                        onStartExercise={handleStartExercise} 
                        disabled={isStarting || planExercises.length === 0}
                    />
                </>
            )}

            <BottomNavigation />
        </div>
    );
}