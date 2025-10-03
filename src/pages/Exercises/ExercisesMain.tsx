import { useState, useEffect } from "react";
import Header from "../../components/common/Header/Header";
import WorkoutControls from "../../components/exercises/WorkoutControls/WorkoutControls";
import ActivityTracker from "../../components/exercises/ActivityTracker/ActivityTracker";
import WeeklyProgress from "../../components/exercises/WeeklyProgress/WeeklyProgress";
import ProgressBar from "../../components/common/ProgressBar/ProgressBar";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { useWorkoutSession } from "../../context/WorkoutSessionContext";
import exercisePlanService from "../../services/api/exercisePlanService";
import { getUserId } from "../../utils/userUtils";

export default function ExercisesMain() {
    const navigate = useNavigate();
    const { weeklyStats, refreshWeeklyStats, refreshActiveSession } = useWorkoutSession();
    const [activePlan, setActivePlan] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Obtener userId del localStorage
    const userId = getUserId() || '';

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        loadData();
    }, [userId]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            
            // 1. Verificar si el usuario tiene un plan activo
            const plan = await exercisePlanService.getActivePlan(userId);
            setActivePlan(plan);
            
            // 2. Cargar estadísticas semanales
            await refreshWeeklyStats(userId);
            
            // 3. Verificar si hay sesión activa
            await refreshActiveSession(userId);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/home');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    // Preparar datos de actividad desde las estadísticas
    const activityData = {
        exercise: {
            minutes: weeklyStats?.totalMinutes || 0,
            completed: false
        },
        calories: {
            burned: weeklyStats?.totalCalories || 0,
            completed: false
        }
    };

    // Preparar datos de progreso semanal
    const getWeekData = () => {
        const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
        const adjustedToday = today === 0 ? 6 : today - 1; // Ajustar para que Lunes = 0

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

    // Calcular progreso del entrenamiento
    const progressData = {
        percentage: weeklyStats?.completedSessions && weeklyStats?.totalSessions 
            ? Math.round((weeklyStats.completedSessions / weeklyStats.totalSessions) * 100)
            : 0,
        sessions: { 
            completed: weeklyStats?.completedSessions || 0, 
            total: weeklyStats?.totalSessions || 0 
        },
        consecutiveWeeks: 2 // Esto lo puedes calcular más adelante
    };

    const handleStartWorkout = () => {
        // Si no tiene plan activo, ir a selección de plan
        if (!activePlan) {
            navigate('/exercisesPlan');
        } else {
            // Si tiene plan activo, ir al plan de entrenamiento
            navigate('/workoutPlan');
        }
    };

    const handleChangePlan = () => {
        navigate('/exercisesPlan');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2d2d2d] pb-20">
            <Header
                isActive={true}
                showBackButton={false}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />

            {/* Mostrar información del plan activo si existe */}
            {activePlan && (
                <div className="px-4 mb-4">
                    <div className="bg-[#3d3d3d] rounded-xl p-4">
                        <h3 className="text-white font-bold mb-1">{activePlan.plan_name}</h3>
                        {activePlan.description && (
                            <p className="text-gray-400 text-sm">{activePlan.description}</p>
                        )}
                    </div>
                </div>
            )}

            <WorkoutControls
                onStartWorkout={handleStartWorkout}
                onChangePlan={handleChangePlan}
            />

            <ActivityTracker data={activityData} />

            <h1 className="text-xl font-bold mb-4 px-4 text-white">Progreso semanal</h1>
            <WeeklyProgress weekData={weekData} />

            <ProgressBar {...progressData} />

            <BottomNavigation />
        </div>
    );
}