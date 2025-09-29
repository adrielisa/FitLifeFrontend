interface PlanHeaderProps {
    planName: string;
}

export default function PlanHeader({ planName }: PlanHeaderProps) {
    return (
        <div className="px-4 py-6">
            <h1 className="text-white text-2xl font-bold">{planName}</h1>
        </div>
    );
}