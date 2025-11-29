import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import PlanHeader from "../../components/exercises/PlanHeader/PlanHeader";
import StartExerciseButton from "../../components/exercises/StartExerciseButton/StartExerciseButton";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";

export default function WorkoutPlan() {
    const navigate = useNavigate();
    // Datos simulados para el progreso semanal
    const [weekData] = useState([
        { day: 'L', completed: true },
        { day: 'M', completed: true },
        { day: 'M', completed: false, isToday: false },
        { day: 'J', completed: false, isToday: false },
        { day: 'V', completed: false, isToday: false },
        { day: 'S', completed: true },
        { day: 'D', completed: false, isToday: false }
    ]);

    const handleBack = () => {
        navigate('/exercises');
    };

    const handleProfile = () => {
        alert("Ir a perfil de usuario...");
        // navigate('/profile');
    };

    const handleStartExercise = () => {
        navigate('/exercise-detail');
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

            <PlanHeader planName="Plan pro" />

            {/* Reutilizando el componente WeeklyProgress con un estilo más minimalista */}

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

            <StartExerciseButton onStartExercise={handleStartExercise} />

            <BottomNavigation />
        </div>
    );
}