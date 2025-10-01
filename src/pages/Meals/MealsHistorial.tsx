import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../../components/common/Navigation/BottomNavigation";

interface Meal {
    id: number;
    title: string;
    grams: number;
    kcal: number;
    image: string;
    quantity: number;
}

const MealsHistorial: React.FC = () => {
    const [date, setDate] = useState<Date | null>(new Date());

    const meals: Meal[] = [
        {
            id: 1,
            title: "Plátano",
            grams: 100,
            kcal: 140,
            image: "https://www.shutterstock.com/image-photo/banner-bananas-hard-shadows-pattern-600nw-2437962785.jpg",
            quantity: 2,
        },
        {
            id: 2,
            title: "Pizza (rebanada)",
            grams: 3500,
            kcal: 2100,
            image: "https://st4.depositphotos.com/3316741/22997/i/450/depositphotos_229976142-stock-photo-pizza-with-tomatoes-mozzarella-cheese.jpg",
            quantity: 7,
        },
        {
            id: 3,
            title: "Naranja",
            grams: 50,
            kcal: 50,
            image: "https://png.pngtree.com/thumb_back/fw800/background/20231019/pngtree-orange-color-and-fruit-background-image_13943341.jpg",
            quantity: 2,
        },
    ];

    // Calcular totales correctamente
    const totalCalories = meals.reduce(
        (acc, meal) => acc + meal.kcal * meal.quantity,
        0
    );


    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    function handleProfile(): void {
        navigate("/profile");
    }

    function onNavigateExercises(): void {
        throw new Error("Function not implemented.");
    }

    function onNavigateHome(): void {
        throw new Error("Function not implemented.");
    }

    function onNavigateNutrition(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white p-8 space-y-6">
            <Header
                isActive={true}
                showBackButton={true}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />
            <h2 className="font-bold mb-2">Historial de comidas</h2>

            <div className="p-2 mb-6 max-w-sm">
                <Calendar
                    value={date}
                    onChange={(value) => setDate(value as Date | null)}
                />
            </div>

            <h3 className="font-semibold mb-5">Comidas:</h3>

            <div className="space-y-7">
                {meals.map((meal) => (
                    <div
                        key={meal.id}
                        className="relative rounded-3xl overflow-hidden shadow-md"
                        style={{
                            backgroundImage: `url(${meal.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >

                        <div className="bg-black/70 p-5 flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold">{meal.title}</h4>
                                <p className="text-sm">{meal.grams} gramos</p>
                                <p className="text-sm">{meal.kcal} kcal</p>
                            </div>
                            <span className="text-xl font-bold">{meal.quantity}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-right mt-10 mb-20 text-2xl font-extralight text-white/60">
                Total calorías: {totalCalories.toLocaleString()}
            </div>
            <BottomNavigation
                onNavigateExercises={onNavigateExercises}
                onNavigateHome={onNavigateHome}
                onNavigateNutrition={onNavigateNutrition}
            />
        </div>
    );
};

export default MealsHistorial;
