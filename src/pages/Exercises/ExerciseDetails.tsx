import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExerciseView from "../../components/exercises/ExerciseView/ExerciseView";

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
        navigate('/workout-plan');
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
        <ExerciseView
            exercise={currentExercise}
            onBack={handleBack}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onComplete={handleComplete}
            onCancel={handleCancel}
            disablePrevious={isFirstExercise}
            disableNext={isLastExercise}
        />
    );
}