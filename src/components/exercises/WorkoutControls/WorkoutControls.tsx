import { ChevronRight } from "lucide-react";

interface WorkoutControlsProps {
    onStartWorkout: () => void;
    onChangePlan: () => void;
}

export default function WorkoutControls({ onStartWorkout, onChangePlan }: WorkoutControlsProps) {
    return (
        <div className="px-4 mb-6">
            <button
                onClick={onStartWorkout}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-between transition-colors mb-4"
            >
                <span className="text-lg">Acceder a mi entrenamiento</span>
                <ChevronRight className="w-6 h-6" />
            </button>

            <button
                onClick={onChangePlan}
                className="text-white hover:text-gray-300 transition-colors"
            >
                Cambiar de plan
            </button>
        </div>
    );
}