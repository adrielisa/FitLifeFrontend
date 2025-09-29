import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

interface ExerciseControlsProps {
    onPrevious: () => void;
    onNext: () => void;
    onComplete: () => void;
    onCancel: () => void;
    disablePrevious?: boolean;
    disableNext?: boolean;
}

export default function ExerciseControls({
    onPrevious,
    onNext,
    onComplete,
    onCancel,
    disablePrevious = false,
    disableNext = false
}: ExerciseControlsProps) {
    return (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4">
            <div className="flex justify-center items-center gap-4">
                {/* Botón Anterior */}
                <button
                    onClick={onPrevious}
                    disabled={disablePrevious}
                    className={`bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl transition-colors ${disablePrevious ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Botón Completar */}
                <button
                    onClick={onComplete}
                    className="bg-orange-600 hover:bg-orange-700 text-white p-5 rounded-full transition-colors"
                >
                    <Check className="w-8 h-8" />
                </button>

                {/* Botón Cancelar */}
                <button
                    onClick={onCancel}
                    className="bg-orange-600 hover:bg-orange-700 text-white p-5 rounded-full transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Botón Siguiente */}
                <button
                    onClick={onNext}
                    disabled={disableNext}
                    className={`bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl transition-colors ${disableNext ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
