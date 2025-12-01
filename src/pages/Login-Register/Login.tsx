import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { userService, type LoginUserDTO } from "../../services/api/userService"

const Login: React.FC = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!email || !password) {
            alert("Por favor completa todos los campos")
            return
        }

        setIsLoading(true)

        try {
            // Preparar datos de login
            const credentials: LoginUserDTO = {
                email,
                password
            }

            // Llamar al servicio de login
            const response = await userService.login(credentials)
            
            alert(`¡Bienvenido de nuevo, ${response.user.name}!`)
            
            // Redirigir a home
            navigate('/home')
        } catch (error: any) {
            console.error('Error en login:', error)
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.'
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
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
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6">
                    Iniciar Sesión
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm mb-1">Correo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full p-3 rounded-md border border-orange-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base disabled:opacity-50"
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
                            disabled={isLoading}
                            className="w-full p-3 rounded-md border border-orange-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base disabled:opacity-50"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md transition-colors touch-manipulation"
                    >
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
                <p className="mt-4 text-center text-white text-sm">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-orange-500 hover:underline">
                        Crea una
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login