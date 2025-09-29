interface ProgressBarProps {
    percentage: number;
    sessions: {
        completed: number;
        total: number;
    };
    consecutiveWeeks: number;
}

export default function ProgressBar({ percentage, sessions, consecutiveWeeks }: ProgressBarProps) {
    return (
        <div className="px-4 mb-6">
            <h2 className="text-white text-xl font-bold mb-4">Progreso entrenamiento</h2>

            <div className="bg-[#262626] p-6 rounded-xl">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-lg font-semibold">Progreso</span>
                        <span className="text-white text-sm">
                            Sesiones: {sessions.completed}/{sessions.total}
                        </span>
                    </div>

                    <div className="mb-4">
                        <span className="text-white text-3xl font-bold">{percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-orange-600 h-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Semanas consecutivas de entrenamiento:</span>
                    <span className="text-white text-xl font-bold">{consecutiveWeeks}</span>
                </div>
            </div>
        </div>
    );
}