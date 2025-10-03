import { ChevronRight } from "lucide-react";

interface StartExerciseButtonProps {
    onStartExercise: () => void;
    disabled?: boolean;
}

export default function StartExerciseButton({ onStartExercise, disabled = false }: StartExerciseButtonProps) {
    return (
        <div className="px-4 mt-8">
            <button
                onClick={onStartExercise}
                disabled={disabled}
                className={`w-full ${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#262626] hover:bg-[#363636]'} text-white font-semibold py-6 px-6 rounded-2xl flex items-center justify-between transition-colors`}
            >
                <span className="text-lg">{disabled ? 'Iniciando...' : 'Comenzar ejercicios'}</span>
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}