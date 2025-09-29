import { Clock, Flame } from "lucide-react";

interface ActivityData {
    exercise: {
        minutes: number;
        completed: boolean;
    };
    calories: {
        burned: number;
        completed: boolean;
    };
}

interface ActivityTrackerProps {
    data: ActivityData;
}

export default function ActivityTracker({ data }: ActivityTrackerProps) {
    return (
        <div className="px-4 mb-6">
            <h2 className="text-white text-xl font-bold mb-4">Actividad de hoy</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#262626] p-4 rounded-xl">
                    <div className="flex items-center mb-3">
                        <Clock className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-300 text-sm">Ejercicio</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white text-lg font-semibold">
                            {data.exercise.minutes} Minutos
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 ${data.exercise.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400'
                            }`}>
                            {data.exercise.completed && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-[#262626] p-4 rounded-xl">
                    <div className="flex items-center mb-3">
                        <Flame className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-300 text-sm">Calorías</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white text-lg font-semibold">
                            {data.calories.burned} kcal
                        </span>
                        <div className={`w-6 h-6 rounded-full border-2 ${data.calories.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400'
                            }`}>
                            {data.calories.completed && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
