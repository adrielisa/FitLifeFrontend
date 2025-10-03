import BottomNavigation from "../../components/common/Navigation/BottomNavigation";
import Header from "../../components/common/Header/Header";
import { Minus, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const mealsData = [
    {
        id: 1,
        name: "Platano",
        grams: 50,
        kcal: 70,
        image: "https://www.shutterstock.com/image-photo/banner-bananas-hard-shadows-pattern-600nw-2437962785.jpg",
    },
    {
        id: 2,
        name: "Manzana",
        grams: 100,
        kcal: 70,
        image: "https://images.unsplash.com/photo-1579247289081-dc2a9832539c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cm9kYWphJTIwZGUlMjBtYW56YW5hfGVufDB8fDB8fHww",
    },
    {
        id: 3,
        name: "Pizza",
        grams: 500,
        kcal: 300,
        image: "https://st4.depositphotos.com/3316741/22997/i/450/depositphotos_229976142-stock-photo-pizza-with-tomatoes-mozzarella-cheese.jpg",
    },
    {
        id: 4,
        name: "Pera",
        grams: 50,
        kcal: 50,
        image: "https://www.frotzfruits.com/wp-content/uploads/2022/06/PERA-FROTZ-ETIQUETA.jpg",
    },
    {
        id: 5,
        name: "Naranja",
        grams: 50,
        kcal: 50,
        image: "https://png.pngtree.com/thumb_back/fw800/background/20231019/pngtree-orange-color-and-fruit-background-image_13943341.jpg",
    },
    {
        id: 6,
        name: "Sandía",
        grams: 50,
        kcal: 50,
        image: "https://img.freepik.com/fotos-premium/trozos-sandia-roja-madura-estan-sobre-plancha-madera-sobre-fondo-verde-follaje-comida-verano-dia-verano-horario-verano_271580-29.jpg",
    },
];

const MealsSelect: React.FC = () => {
    const [search, setSearch] = useState("");
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

    const filteredMeals = mealsData.filter((meal) =>
        meal.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleQuantityChange = (id: number, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) + delta, 1),
        }));
    };

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
        <div className="bg-[#1A1A1A] min-h-screen text-white px-5">
            <Header
                isActive={true}
                showBackButton={true}
                onBack={handleBack}
                showProfileButton={true}
                onProfile={handleProfile}
                userAvatar="https://avatarfiles.alphacoders.com/326/thumb-1920-326022.jpg"
            />
            <h2 className="text-md mb-8 w-full font-bold">Selecciona que comiste</h2>
            <div className="relative w-full mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className="w-full p-4 pl-13 rounded-full bg-[#262626] text-white placeholder-gray-400"
                />
                <span className="absolute left-4 top-4"><Search /></span>
            </div>

            <div className="space-y-8 overflow-y-auto max-h-[530px] w-full mt-8 mb-5 p-4">
                {filteredMeals.map((meal) => {
                    const qty = quantities[meal.id] || 1;
                    return (
                        <div
                            key={meal.id}
                            className="relative rounded-4xl overflow-hidden shadow bg-black/30"
                        >
                            <img
                                src={meal.image}
                                alt={meal.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-25"
                            />
                            <div className="relative p-8 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{meal.name}</p>
                                    <p className="text-sm">{meal.grams * qty} gramos</p>
                                </div>
                                <div className="text-right">
                                    <p>{meal.kcal * qty} kcal</p>
                                    <div className="flex items-center gap-3 mt-5 justify-end">
                                        <button
                                            onClick={() => handleQuantityChange(meal.id, -1)}
                                            className="px-2 rounded-full"
                                        >
                                            <Minus />
                                        </button>
                                        <span>{qty}</span>
                                        <button
                                            onClick={() => handleQuantityChange(meal.id, 1)}
                                            className="px-2 rounded-full"
                                        >
                                            <Plus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="mt-4 w-full bg-[#55A91D] p-3 rounded-2xl font-semibold">
                Añadir
            </button>
            <BottomNavigation
                onNavigateExercises={onNavigateExercises}
                onNavigateHome={onNavigateHome}
                onNavigateNutrition={onNavigateNutrition}
            />
        </div>
    );
};

export default MealsSelect;
