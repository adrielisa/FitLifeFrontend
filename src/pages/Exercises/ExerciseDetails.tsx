import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import ExerciseCard from "../../components/exercises/ExerciseCard/ExerciseCard";
import ExerciseControls from "../../components/exercises/ExerciseControls/ExerciseControls";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import Modal from "../../components/common/Modal/Modal";
import { useWorkoutSession } from "../../context/WorkoutSessionContext";
import { Exercise } from "../../services/api/exerciseService";

interface ExerciseWithStatus extends Exercise {
    completed: boolean;
    skipped: boolean;
}

export default function ExerciseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentSession, completeSession } = useWorkoutSession();
    
    const [exercises, setExercises] = useState<ExerciseWithStatus[]>([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [totalCalories, setTotalCalories] = useState(0);

    useEffect(() => {
        // Cargar ejercicios desde el state de navegación
        const planExercises = location.state?.planExercises as Exercise[] || [];
        
        if (planExercises.length === 0) {
            alert('No hay ejercicios disponibles');
            navigate('/workoutPlan');
            return;
        }

        // Inicializar ejercicios con estado
        const exercisesWithStatus: ExerciseWithStatus[] = planExercises.map(ex => ({
            ...ex,
            completed: false,
            skipped: false
        }));
        
        setExercises(exercisesWithStatus);
    }, [location, navigate]);

    const currentExercise = exercises[currentExerciseIndex];
    const isFirstExercise = currentExerciseIndex === 0;
    const isLastExercise = currentExerciseIndex === exercises.length - 1;

    // Calcular calorías quemadas (estimado 5 min por ejercicio)
    const calculateCalories = (): number => {
        const estimatedMinutesPerExercise = 5;
        return exercises.reduce((total, exercise) => {
            if (exercise.completed) {
                const caloriesPerMin = exercise.calories_per_minute || 0;
                return total + (estimatedMinutesPerExercise * caloriesPerMin);
            }
            return total;
        }, 0);
    };

    // Preparar datos del ejercicio para ExerciseCard
    const getExerciseCardData = () => {
        if (!currentExercise) {
            return null;
        }

        const ex = currentExercise;
        // Por defecto: ejercicios de fuerza con 3 series de 12 reps

        return {
            name: ex.name,
            imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=400&fit=crop',
            type: 'fuerza' as const,
            series: `3 x 12`, // Valores por defecto
            restTime: `00:60`,  // 60 segundos de descanso
            exerciseType: 'Fuerza',
            caloriesPerMinute: ex.calories_per_minute,
            musclesWorked: ex.muscle_group
        };
    };

    const handleBack = () => {
        navigate('/workoutPlan');
    };

    const handleProfile = () => {
        alert("Ir a perfil de usuario...");
        // navigate('/profile');
    };

    const handlePrevious = () => {
        if (!isFirstExercise) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
        }
    };

    const handleNext = () => {
        if (!isLastExercise) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
        }
    };

    const handleComplete = () => {
        // Marcar ejercicio actual como completado
        const updatedExercises = [...exercises];
        updatedExercises[currentExerciseIndex].completed = true;
        updatedExercises[currentExerciseIndex].skipped = false;
        setExercises(updatedExercises);

        // Si es el último ejercicio, mostrar modal
        if (isLastExercise) {
            finishWorkout(updatedExercises);
        } else {
            // Ir al siguiente ejercicio
            setCurrentExerciseIndex(currentExerciseIndex + 1);
        }
    };

    const handleCancel = () => {
        // Marcar ejercicio actual como omitido
        const updatedExercises = [...exercises];
        updatedExercises[currentExerciseIndex].skipped = true;
        updatedExercises[currentExerciseIndex].completed = false;
        setExercises(updatedExercises);

        // Si es el último ejercicio, mostrar modal
        if (isLastExercise) {
            finishWorkout(updatedExercises);
        } else {
            // Ir al siguiente ejercicio
            setCurrentExerciseIndex(currentExerciseIndex + 1);
        }
    };

    const finishWorkout = async (finalExercises: ExerciseWithStatus[]) => {
        const completedCount = finalExercises.filter(ex => ex.completed).length;
        const calories = calculateCalories();
        
        setTotalCalories(calories);
        setShowCompletionModal(true);

        // Completar la sesión en el backend
        if (currentSession) {
            try {
                await completeSession(currentSession.session_id, {
                    exercises_completed: completedCount,
                    total_calories: calories,
                    notes: `Completados: ${completedCount}/${finalExercises.length}`
                });
            } catch (error) {
                console.error('Error completing session:', error);
            }
        }
    };

    const handleModalClose = () => {
        setShowCompletionModal(false);
        navigate('/exercises');
    };

    const exerciseCardData = getExerciseCardData();
    if (!exerciseCardData) {
        return <div className="min-h-screen bg-[#2d2d2d] text-white p-4">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-[#2d2d2d] pb-40">
            <Header
                isActive={true}
                showBackButton={true}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />

            <ExerciseCard exercise={exerciseCardData} />

            <ExerciseControls
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={handleComplete}
                onCancel={handleCancel}
                disablePrevious={isFirstExercise}
                disableNext={isLastExercise}
            />

            {/* Modal de entrenamiento completado */}
            <Modal
                isOpen={showCompletionModal}
                onClose={handleModalClose}
                title="¡Entrenamiento Completado! 🎉"
            >
                <div className="text-center py-4">
                    <p className="text-lg mb-4">
                        Has completado {exercises.filter(ex => ex.completed).length} de {exercises.length} ejercicios
                    </p>
                    <p className="text-2xl font-bold text-orange-500 mb-6">
                        {totalCalories} kcal quemadas
                    </p>
                    <button
                        onClick={handleModalClose}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
                    >
                        Ver mi progreso
                    </button>
                </div>
            </Modal>

            <BottomNavigation />
        </div>
    );
}