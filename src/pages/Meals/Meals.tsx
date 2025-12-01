import { ChevronRight, Flame, HandPlatter, Plus, X } from "lucide-react";
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import { useState } from "react";

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
            img: "https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/a66e2d26e98cb65d8be4eb89e48ff8d6.jpg",
            grams: "150g",
            kcal: 120,
            desc: "Una ensalada fresca y ligera, rica en fibra, vitaminas y minerales."
        },
        {
            title: "Huevos hervidos",
            img: "https://cocina-casera.com/wp-content/uploads/2023/01/como-cocer-huevo-cocido-770x485.jpg",
            grams: "100g",
            kcal: 155,
            desc: "Huevos cocidos que aportan proteína de alta calidad y grasas saludables."
        },
        {
            title: "Calabacitas",
            img: "https://www.muydelish.com/wp-content/uploads/2020/02/calabacitas.jpg",
            grams: "120g",
            kcal: 90,
            desc: "Calabacitas al vapor, bajas en calorías y ricas en antioxidantes."
        }
    ];

    const [selectedMeal, setSelectedMeal] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);

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
        navigate("/meals-select");
    };

    const handleClick2 = () => {
        navigate("/meals-historial");
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white">
            <Header
                isActive={true}
                showBackButton={false}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />

            <div className="p-11 space-y-8">
                <button onClick={handleClick2} className="w-full flex items-center justify-between bg-[#55A91D] text-white font-semibold py-3 px-4 rounded-xl shadow-md">
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
                            onClick={() => { setSelectedMeal(item); setQuantity(1); }}
                            className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
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

            <AnimatePresence>
                {selectedMeal && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center p-5 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#2A2A2A] rounded-3xl p-9 w-full max-w-md text-white relative"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                        >
                            <button
                                onClick={() => setSelectedMeal(null)}
                                className="absolute top-6 right-5 text-gray-300 hover:text-white"
                            >
                                <X />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <HandPlatter className="text-white" />
                                <h2 className="text-xl font-semibold">{selectedMeal.title}</h2>
                            </div>

                            <div className="flex justify-between items-center text-gray-300 mb-3">
                                <span>{selectedMeal.grams}</span>
                                <span>{selectedMeal.kcal} kcal</span>
                            </div>

                            <p className="text-sm text-gray-400 mb-5">{selectedMeal.desc}</p>

                            <div className="flex flex-wrap gap-2 mb-4 w-full">
                                <button className="bg-green-600 py-2 px-10 rounded-xl font-semibold flex-1 min-w-[120px]">
                                    Añadir
                                </button>
                                <div className="flex items-center gap-3 flex-1 min-w-[120px] justify-center">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="bg-[#444] px-3 py-1 rounded-lg"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="bg-[#55A91D] px-3 py-1 rounded-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNavigation/>
        </div>
    );
};

export default Meals;
