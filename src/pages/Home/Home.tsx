import React, { useState } from "react";
import { Flame, Clock } from "lucide-react";
import { motion } from "framer-motion";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import WeeklyProgress from "../../components/exercises/WeeklyProgress/WeeklyProgress";
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const consumed = 580;
    const total = 2000;
    const progress = (consumed / total) * 100;


    const [weekData] = useState([
            { day: 'L', completed: true },
            { day: 'M', completed: true },
            { day: 'M', completed: false, isToday: true },
            { day: 'J', completed: false },
            { day: 'V', completed: false },
            { day: 'S', completed: true },
            { day: 'D', completed: false }
        ]);

        const navigate = useNavigate();

    function onNavigateExercises(): void {
        throw new Error("Function not implemented.");
    }

    function onNavigateHome(): void {
        throw new Error("Function not implemented.");
    }

    function onNavigateNutrition(): void {
        throw new Error("Function not implemented.");
    }

    const handleBack = () => {
        navigate(-1);
    }

    function handleProfile(): void {
        navigate("/profile");
    }

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
            <div>
                <h1 className="text-lg font-bold mb-4">Actividad de hoy</h1>

                <div className="flex gap-6">
                    <div className="bg-[#2A2A2A] flex flex-col p-4 rounded-xl w-1/2">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="text-gray-300" />
                            <p className="text-lg text-gray-300">Ejercicio</p>
                        </div>
                        <p className="text-white font-bold text-md">10 Minutos</p>
                    </div>

                    <div className="bg-[#2A2A2A] flex flex-col p-4 rounded-xl w-1/2">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="text-orange-500" />
                            <p className="text-lg text-gray-300">Calorías</p>
                        </div>
                        <p className="text-white font-bold text-md">580 kcal</p>
                    </div>

                </div>
            </div>

            <div>
                <h1 className="text-lg font-bold mb-4">Progreso semanal</h1>
                <WeeklyProgress weekData={weekData} />
            </div>

            <div>
                <h1 className="text-lg font-bold mb-6">Comidas de hoy</h1>

    <div className="bg-[#2A2A2A] p-6 rounded-xl mb-24">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <Flame className="text-white" />
                <span>Calorías</span>
            </div>
            <span className="text-sm text-gray-300">{consumed}/{total}</span>
        </div>

        <div className="w-full bg-white rounded-full h-6 overflow-hidden">
            <motion.div
                className="bg-green-600 h-6 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            />
        </div>
    </div>
</div>
            <BottomNavigation
                onNavigateExercises={onNavigateExercises}
                onNavigateHome={onNavigateHome}
                onNavigateNutrition={onNavigateNutrition}
            />
        </div>
    );
};

export default Home;
