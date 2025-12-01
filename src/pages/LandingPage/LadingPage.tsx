import React from "react";
import hombre from "../../assets/images/hombrecorriendo.png";
import mujer from "../../assets/images/mujercorriendo.png";
import { Link } from "react-router-dom";



const LandingPage: React.FC = () => {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-between px-6 py-10 text-white"
            style={{
                backgroundImage: "url('src/assets/images/Fondo.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <h1 className="text-5xl font-bold mb-6">FitLife</h1>

            <div className="flex items-end justify-center gap-4 mb-6">
                <img
                    src={hombre}
                    alt="Hombre corriendo"
                    className="w-46 md:w-72 lg:w-80"
                />
                <img
                    src={mujer}
                    alt="Mujer corriendo"
                    className="w-35 md:w-56 lg:w-64"
                />
            </div>
            
            <div className="text-center max-w-md">
                <h2 className="text-4xl font-semibold mb-4">¿Listo para ser fit?</h2>
                <p className="text-gray-200 text-lg py-5 px-6">
                    Empieza tu era fitness, tu era pilates y atrévete a presumir ese
                    cuerpo que tanto deseas y tanto ves en TikTok
                </p>
            </div>

            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-30 py-3 rounded-2xl">
                <Link to="/login">Comenzar</Link>
            </button>
        </div>
    );
};

export default LandingPage;
