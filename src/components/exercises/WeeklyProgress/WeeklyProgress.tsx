import { Check } from "lucide-react";

interface WeeklyProgressProps {
    weekData: {
        day: string;
        completed: boolean;
        isToday?: boolean;
    }[];
}

export default function WeeklyProgress({ weekData }: WeeklyProgressProps) {
    return (
        <div className="px-4 mb-6">

            <div className="flex justify-between items-center">
                {weekData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <span className="text-gray-400 text-sm mb-2">{day.day}</span>
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${day.completed
                                ? 'bg-white border-2 border-white'
                                : day.isToday
                                    ? 'bg-orange-600 border-2 border-orange-600'
                                    : 'bg-orange-600 border-2 border-orange-600'
                            }`}>
                            {day.completed ? (
                                <Check className="w-6 h-6 text-black" />
                            ) : (
                                <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}