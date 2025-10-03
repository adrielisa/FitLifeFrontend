import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { userService, type RegisterUserDTO } from "../../services/api/userService"

const Register: React.FC = () => {
    const navigate = useNavigate()
    
    // Estados para el primer formulario
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [confirmarContrasena, setConfirmarContrasena] = useState("")
    
    // Estados para el segundo formulario
    const [edad, setEdad] = useState("")
    const [peso, setPeso] = useState("")
    const [estatura, setEstatura] = useState("")
    const [nivelActividad, setNivelActividad] = useState("Bajo/Medio/Alto")
    const [meta, setMeta] = useState("")
    
    // Estado para controlar qué paso mostrar
    const [currentStep, setCurrentStep] = useState(1)
    
    // Estado de carga
    const [isLoading, setIsLoading] = useState(false)

    const handleSiguiente = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre || !correo || !contrasena || !confirmarContrasena) {
            alert("Por favor completa todos los campos")
            return
        }
        if (contrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden")
            return
        }
        setCurrentStep(2)
    }

    const handleConfirmar = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!edad || !peso || !estatura || !meta || nivelActividad === "Bajo/Medio/Alto") {
            alert("Por favor completa todos los campos")
            return
        }

        setIsLoading(true)

        try {
            // Mapear los valores del formulario al formato de la API
            const userData: RegisterUserDTO = {
                name: nombre,
                email: correo,
                password: contrasena,
                age: parseInt(edad),
                weight: parseFloat(peso),
                height: parseFloat(estatura),
                fitness_goal: mapFitnessGoal(meta),
                activity_level: mapActivityLevel(nivelActividad),
            }

            // Llamar al servicio para registrar usuario
            const response = await userService.register(userData)
            
            alert(`¡Registro exitoso! Bienvenido ${response.user.name}`)
            
            // Redirigir a home después de registro exitoso
            navigate('/home')
        } catch (error: any) {
            console.error('Error en registro:', error)
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al registrar usuario'
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // Funciones auxiliares para mapear valores del formulario a la API
    const mapFitnessGoal = (goal: string): RegisterUserDTO['fitness_goal'] => {
        const goalMap: Record<string, RegisterUserDTO['fitness_goal']> = {
            'Perder peso': 'perder_peso',
            'Mantener peso': 'mantener_peso',
            'Ganar peso': 'ganar_peso',
            'Ganar músculo': 'ganar_musculo',
        }
        return goalMap[goal] || 'mantener_peso'
    }

    const mapActivityLevel = (level: string): RegisterUserDTO['activity_level'] => {
        const levelMap: Record<string, RegisterUserDTO['activity_level']> = {
            'Bajo': 'bajo',
            'Medio': 'moderado',
            'Alto': 'alto',
        }
        return levelMap[level] || 'moderado'
    }

    const handleVolver = () => {
        setCurrentStep(1)
    }

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
                {/* Header con botón de volver solo en paso 2 */}
                <div className="flex items-center justify-center mb-6 relative">
                    {currentStep === 2 && (
                        <button
                            onClick={handleVolver}
                            className="absolute left-0 text-white hover:text-gray-300 transition-colors"
                            disabled={isLoading}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                        Registro
                    </h2>
                </div>

                {/* Primer paso */}
                {currentStep === 1 && (
                    <div>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-1">Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                                placeholder="Tu nombre completo"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-1">Correo</label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-1">
                                Contraseña <span className="text-gray-400 text-xs">(min 8 caracteres)</span>
                            </label>
                            <input
                                type="password"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                                placeholder="********"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-white text-sm mb-1">Confirmar contraseña</label>
                            <input
                                type="password"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                                placeholder="********"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSiguiente}
                            className="w-full bg-[#55A91D] hover:bg-[#4a8f1a] text-white font-bold py-3 rounded-md transition-colors touch-manipulation"
                        >
                            Siguiente
                        </button>
                        <p className="mt-4 text-center text-white text-sm">
                            ¿Ya tienes una cuenta?{" "}
                            <a href="/login" className="text-[#55A91D] hover:underline">
                                Iniciar Sesión
                            </a>
                        </p>
                    </div>
                )}

                {/* Segundo paso */}
                {currentStep === 2 && (
                    <div>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-1">Edad</label>
                            <input
                                type="number"
                                value={edad}
                                onChange={(e) => setEdad(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                                placeholder="25"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-1">Peso (kg)</label>
                            <input
                                type="number"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                                placeholder="70"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-1">Estatura (cm)</label>
                            <input
                                type="number"
                                value={estatura}
                                onChange={(e) => setEstatura(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                                placeholder="175"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm mb-1">Nivel de actividad</label>
                            <select
                                value={nivelActividad}
                                onChange={(e) => setNivelActividad(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-[#262626] text-white focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                            >
                                <option value="Bajo/Medio/Alto" disabled>Selecciona nivel</option>
                                <option value="Bajo">Bajo</option>
                                <option value="Medio">Medio</option>
                                <option value="Alto">Alto</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-white text-sm mb-1">Meta</label>
                            <select
                                value={meta}
                                onChange={(e) => setMeta(e.target.value)}
                                required
                                className="w-full p-3 rounded-md border border-[#55A91D] bg-[#262626] text-white focus:outline-none focus:ring-2 focus:ring-[#55A91D] text-base"
                            >
                                <option value="" disabled>Selecciona tu meta</option>
                                <option value="Perder peso">Perder peso</option>
                                <option value="Mantener peso">Mantener peso</option>
                                <option value="Ganar peso">Ganar peso</option>
                                <option value="Ganar músculo">Ganar músculo</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleConfirmar}
                            disabled={isLoading}
                            className="w-full bg-[#55A91D] hover:bg-[#4a8f1a] disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md transition-colors touch-manipulation"
                        >
                            {isLoading ? 'Registrando...' : 'Confirmar'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Register