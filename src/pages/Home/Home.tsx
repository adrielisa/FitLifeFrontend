import React from "react";
import { Flame, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Home: React.FC = () => {
    const consumed = 580;
    const total = 2000;
    const progress = (consumed / total) * 100;

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white p-10 space-y-10">
            <div>
                <h1 className="text-lg font-bold mb-4">Actividad de hoy</h1>

                <div className="flex gap-6">
                    <div className="bg-[#2A2A2A] flex flex-col items-left justify-left p-4 rounded-xl w-1/2">
                        <Clock className="text-gray-300 mb-2" />
                        <p className="text-lg text-gray-300">Ejercicio</p>
                        <p className="text-white font-bold text-md">10 Minutos</p>
                    </div>

                    <div className="bg-[#2A2A2A] flex flex-col items-left justify-left p-4 rounded-xl w-1/2">
                        <Flame className="text-orange-500 mb-2" />
                        <p className="text-lg text-gray-300">Calorías</p>
                        <p className="text-white font-bold text-md">580 kcal</p>
                    </div>
                </div>
            </div>

            <div>
                <h1 className="text-lg font-bold mb-4">Progreso semanal</h1>
                <div className="flex justify-between">
                    {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                        <div key={i} className="flex flex-col items-center space-y-2">
                            <span className="text-sm">{day}</span>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 || i === 1 || i === 5
                                    ? "bg-white text-black"
                                    : "bg-orange-500"
                                    }`}
                            >
                                {i === 0 || i === 1 || i === 5 ? "✓" : ""}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h1 className="text-lg font-bold mb-6">Comidas de hoy</h1>

                <div className="bg-[#2A2A2A] p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Flame className="text-green-600" />
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
    );
};

export default Home;
