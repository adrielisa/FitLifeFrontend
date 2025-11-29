import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import ExerciseCard from "../../components/exercises/ExerciseCard/ExerciseCard";
import ExerciseControls from "../../components/exercises/ExerciseControls/ExerciseControls";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";

// Mock data de ejercicios
const mockExercises = [
    {
        name: "Sentadillas",
        imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=400&fit=crop",
        type: 'fuerza' as const,
        series: "2 x 20",
        restTime: "00:30",
        exerciseType: "Fuerza",
        caloriesPerMinute: 50,
        musclesWorked: "Glúteos, cuadriceps"
    },
    {
        name: "Caminadora",
        imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=400&fit=crop",
        type: 'cardio' as const,
        time: "10 minutos",
        exerciseType: "Cardio",
        caloriesPerMinute: 50,
        musclesWorked: "Glúteos, cuadriceps"
    },
    {
        name: "Flexiones",
        imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop",
        type: 'fuerza' as const,
        series: "3 x 15",
        restTime: "00:45",
        exerciseType: "Fuerza",
        caloriesPerMinute: 45,
        musclesWorked: "Pecho, tríceps, hombros"
    }
];

export default function ExerciseDetail() {
    const navigate = useNavigate();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

    const currentExercise = mockExercises[currentExerciseIndex];
    const isFirstExercise = currentExerciseIndex === 0;
    const isLastExercise = currentExerciseIndex === mockExercises.length - 1;

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
        alert(`Ejercicio "${currentExercise.name}" completado!`);
        // Aquí marcarías el ejercicio como completado
    };

    const handleCancel = () => {
        const confirmCancel = window.confirm("¿Estás seguro de que deseas cancelar este ejercicio?");
        if (confirmCancel) {
            navigate('/workout-plan');
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white p-10 space-y-10">
            <Header
                isActive={true}
                showBackButton={true}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />

            <ExerciseCard exercise={currentExercise} />

            <ExerciseControls
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={handleComplete}
                onCancel={handleCancel}
                disablePrevious={isFirstExercise}
                disableNext={isLastExercise}
            />

            <BottomNavigation />
        </div>
    );
}