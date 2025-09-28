import { useState } from "react"

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Accediendo con:\nCorreo: ${email}\nContraseña: ${password}`);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-6"
            style={{
                backgroundImage: "url('src/assets/images/Fondo.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="bg-[#262626] p-6 sm:p-8 rounded-xl w-full max-w-sm mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">
                    Iniciar Sesión
                </h2>
                <div>
                    <div className="mb-4">
                        <label className="block text-white text-sm mb-1">Correo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 rounded-md border border-orange-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white text-sm mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 rounded-md border border-orange-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(e as any);
                        }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md transition-colors touch-manipulation"
                    >
                        Ingresar
                    </button>
                </div>
                <p className="mt-4 text-center text-white text-sm">
                    ¿No tienes cuenta?{" "}
                    <a href="/Register" className="text-orange-500 hover:underline">
                        Crea una
                    </a>
                </p>
            </div>
        </div>
    )
};

export default Login;