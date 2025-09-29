import Header from "../../common/Header/Header";
import ExerciseCard from "../ExerciseCard/ExerciseCard";
import ExerciseControls from "../ExerciseControls/ExerciseControls";
import BottomNavigation from "../../common/Navigation/BottomNavigation";

interface ExerciseData {
    name: string;
    imageUrl: string;
    type: 'fuerza' | 'cardio';
    series?: string;
    restTime?: string;
    time?: string;
    exerciseType?: string;
    caloriesPerMinute?: number;
    musclesWorked?: string;
}

interface ExerciseViewProps {
    exercise: ExerciseData;
    onBack: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onComplete: () => void;
    onCancel: () => void;
    disablePrevious?: boolean;
    disableNext?: boolean;
}

export default function ExerciseView({
    exercise,
    onBack,
    onPrevious,
    onNext,
    onComplete,
    onCancel,
    disablePrevious,
    disableNext
}: ExerciseViewProps) {
    return (
        <div className="min-h-screen bg-[#2d2d2d] pb-40">
            <Header onBack={onBack} />

            <ExerciseCard exercise={exercise} />

            <ExerciseControls
                onPrevious={onPrevious}
                onNext={onNext}
                onComplete={onComplete}
                onCancel={onCancel}
                disablePrevious={disablePrevious}
                disableNext={disableNext}
            />

            <BottomNavigation />
        </div>
    );
}