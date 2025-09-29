import { ChevronRight } from "lucide-react";

interface StartExerciseButtonProps {
    onStartExercise: () => void;
}

export default function StartExerciseButton({ onStartExercise }: StartExerciseButtonProps) {
    return (
        <div className="px-4 mt-8">
            <button
                onClick={onStartExercise}
                className="w-full bg-[#262626] hover:bg-[#363636] text-white font-semibold py-6 px-6 rounded-2xl flex items-center justify-between transition-colors"
            >
                <span className="text-lg">Comenzar ejercicios</span>
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}