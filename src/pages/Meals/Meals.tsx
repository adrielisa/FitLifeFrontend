import { ChevronRight, Flame, Plus, RefreshCcw } from "lucide-react";
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";

const Meals: React.FC = () => {
    const navigate = useNavigate();

    const consumed = 580;
    const total = 2000;
    const progress = (consumed / total) * 100;

    const handleBack = () => {
        navigate(-1);
    };

    const recommendations = [
        {
            title: "Ensalada de verduras",
            img: "https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/a66e2d26e98cb65d8be4eb89e48ff8d6.jpg"
        },
        {
            title: "Huevos hervidos",
            img: "https://cocina-casera.com/wp-content/uploads/2023/01/como-cocer-huevo-cocido-770x485.jpg"
        },
        {
            title: "Calabacitas",
            img: "https://www.muydelish.com/wp-content/uploads/2020/02/calabacitas.jpg"
        }
    ];

    function handleProfile(): void {
        navigate("/profile");
    }

    function onNavigateExercises(): void {
        throw new Error("Function not implemented.");
    }

    function onNavigateHome(): void {
        throw new Error("Function not implemented.");
    }

    function onNavigateNutrition(): void {
        throw new Error("Function not implemented.");
    }

    const handleClick = () => {
        navigate("/meals-select"); // Aquí defines la ruta a la que quieres ir
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white">
            <Header
                isActive={true}
                showBackButton={true}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />

            <div className="p-11 space-y-8">
                <button className="w-full flex items-center justify-between bg-[#55A91D] text-white font-semibold py-3 px-4 rounded-xl shadow-md">
                    Ver historial de comidas
                    <span className="text-2xl"><ChevronRight /></span>
                </button>

                <div>
                    <h2 className="text-lg font-semibold mb-3">Comidas de hoy</h2>

                    <button onClick={handleClick} className="w-full flex items-center justify-between bg-[#55A91D] text-white font-semibold py-3 px-4 rounded-xl shadow-md">
                        Añadir comidas
                        <span className="text-2xl"><Plus /></span>
                    </button>

                    <div className="mt-10">
                        <div className="bg-[#2A2A2A] rounded-xl p-2 text-sm text-gray-400 text-center">
                            <div className="bg-[#2A2A2A] p-2 rounded-xl mb-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
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
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {recommendations.map((item, index) => (
                        <div
                            key={index}
                            className="relative rounded-xl overflow-hidden shadow-md"
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-28 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50" />
                            <div className="absolute bottom-2 left-2 text-white p-2 text-sm font-medium leading-tight max-w-[70%] inline-block">
                                {item.title}
                            </div>
                        </div>
                    ))}
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

export default Meals;
