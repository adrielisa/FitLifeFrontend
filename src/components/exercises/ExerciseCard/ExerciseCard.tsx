import { Flame, Dumbbell, Play } from "lucide-react";

type ExerciseType = 'fuerza' | 'cardio';

interface ExerciseData {
    name: string;
    imageUrl: string;
    type: ExerciseType;
    // Para ejercicios de fuerza
    series?: string;
    restTime?: string;
    // Para ejercicios de cardio
    time?: string;
    // Común
    exerciseType?: string;
    caloriesPerMinute?: number;
    musclesWorked?: string;
}

interface ExerciseCardProps {
    exercise: ExerciseData;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
    return (
        <div className="px-4">
            {/* Título del ejercicio */}
            <h1 className="text-white text-2xl font-bold mb-4">{exercise.name}</h1>

            {/* Imagen del ejercicio */}
            <div className="mb-6 rounded-2xl overflow-hidden">
                <img
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="w-full h-64 object-cover"
                />
            </div>

            {/* Grid de información según tipo de ejercicio */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {exercise.type === 'fuerza' ? (
                    <>
                        {/* Series y repeticiones */}
                        <div className="bg-[#262626] p-4 rounded-xl">
                            <div className="flex items-center mb-2">
                                <Dumbbell className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-300 text-sm">Series y repeticiones</span>
                            </div>
                            <span className="text-white text-lg font-semibold">
                                {exercise.series || '2 x 20'}
                            </span>
                        </div>

                        {/* Tipo de ejercicio */}
                        <div className="bg-[#262626] p-4 rounded-xl">
                            <span className="text-gray-300 text-sm block mb-2">Tipo de ejercicio</span>
                            <span className="text-white text-lg font-semibold">
                                {exercise.exerciseType || 'Fuerza'}
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Tiempo */}
                        <div className="bg-[#262626] p-4 rounded-xl">
                            <span className="text-gray-300 text-sm block mb-2">Tiempo</span>
                            <span className="text-white text-lg font-semibold">
                                {exercise.time || '10 minutos'}
                            </span>
                        </div>

                        {/* Tipo de ejercicio */}
                        <div className="bg-[#262626] p-4 rounded-xl">
                            <span className="text-gray-300 text-sm block mb-2">Tipo de ejercicio</span>
                            <span className="text-white text-lg font-semibold">
                                {exercise.exerciseType || 'Cardio'}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Botón de descanso (solo para fuerza) */}
            {exercise.type === 'fuerza' && (
                <div className="bg-[#262626] p-4 rounded-xl mb-4 flex items-center justify-between">
                    <span className="text-white text-lg">{exercise.restTime || '00:30'} Descanso</span>
                    <Play className="w-6 h-6 text-white" />
                </div>
            )}

            {/* Grid de información adicional */}
            <div className="grid grid-cols-2 gap-4">
                {/* Calorías por minuto */}
                <div className="bg-[#262626] p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                        <Flame className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-300 text-sm">Calorías x minuto</span>
                    </div>
                    <span className="text-white text-lg font-semibold">
                        {exercise.caloriesPerMinute || 50} kcal
                    </span>
                </div>

                {/* Músculos trabajados */}
                <div className="bg-[#262626] p-4 rounded-xl">
                    <span className="text-gray-300 text-sm block mb-2">Músculos trabajados</span>
                    <span className="text-white text-lg font-semibold">
                        {exercise.musclesWorked || 'Glúteos, cuadriceps'}
                    </span>
                </div>
            </div>
        </div>
    );
}
