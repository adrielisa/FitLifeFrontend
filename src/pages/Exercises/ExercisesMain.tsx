import { useState } from "react";
import WorkoutControls from "../../components/exercises/WorkoutControls/WorkoutControls";
import ActivityTracker from "../../components/exercises/ActivityTracker/ActivityTracker";
import WeeklyProgress from "../../components/exercises/WeeklyProgress/WeeklyProgress";
import ProgressBar from "../../components/common/ProgressBar/ProgressBar";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import { useNavigate } from "react-router-dom";

export default function ExercisesMain() {
    const navigate = useNavigate();

    const [activityData] = useState({
        exercise: {
            minutes: 10,
            completed: false
        },
        calories: {
            burned: 580,
            completed: false
        }
    });

    const [weekData] = useState([
        { day: 'L', completed: true },
        { day: 'M', completed: true },
        { day: 'M', completed: false, isToday: true },
        { day: 'J', completed: false },
        { day: 'V', completed: false },
        { day: 'S', completed: true },
        { day: 'D', completed: false }
    ]);

    const [progressData] = useState({
        percentage: 17,
        sessions: { completed: 3, total: 10 },
        consecutiveWeeks: 2
    });

    const handleStartWorkout = () => {
        navigate('/workoutPlan');
    };

    const handleChangePlan = () => {
        alert("Cambiando plan de entrenamiento...");
    };

    return (
        <div className="min-h-screen bg-[#2d2d2d] pb-20">
            <WorkoutControls
                onStartWorkout={handleStartWorkout}
                onChangePlan={handleChangePlan}
            />

            <ActivityTracker data={activityData} />

            <WeeklyProgress weekData={weekData} />

            <ProgressBar {...progressData} />

            <BottomNavigation />
        </div>
    );
}