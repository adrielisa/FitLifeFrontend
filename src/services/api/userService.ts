import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

/**
 * ==========================================
 * INTERFACES - Define la estructura de datos
 * ==========================================
 */

// Datos para registrar un nuevo usuario
export interface RegisterUserDTO {
    name: string
    email: string
    password: string
    age: number
    weight: number
    height: number
    fitness_goal: 'perder_peso' | 'mantener_peso' | 'ganar_peso' | 'ganar_musculo'
    activity_level: 'bajo' | 'moderado' | 'alto'
}

// Datos para login
export interface LoginUserDTO {
    email: string
    password: string
}

// Datos del usuario
export interface User {
    user_id: string
    name: string
    email: string
    age: number
    weight: number
    height: number
    fitness_goal: string
    activity_level: string
    created_at: string
    updated_at: string
}

// Tokens JWT
export interface Tokens {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: string
}

// Respuesta de autenticación
export interface AuthResponse {
    message: string
    user: User
    tokens: Tokens
}

// Respuesta de refresh token
export interface RefreshTokenResponse {
    tokens: Tokens
}

/**
 * ==========================================
 * SERVICIO DE USUARIOS
 * ==========================================
 */
export const userService = {
    /**
     * Registrar un nuevo usuario
     * POST /users/register
     */
    register: async (userData: RegisterUserDTO): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>(
                ENDPOINTS.USERS.REGISTER,
                userData
            )

            // Guardar tokens en localStorage
            if (response.data.tokens) {
                localStorage.setItem('accessToken', response.data.tokens.accessToken)
                localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
                localStorage.setItem('user', JSON.stringify(response.data.user))
            }

            return response.data
        } catch (error: any) {
            console.error('Error al registrar usuario:', error.response?.data || error.message)
            throw error
        }
    },

    /**
     * Iniciar sesión
     * POST /users/login
     */
    login: async (credentials: LoginUserDTO): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>(
                ENDPOINTS.USERS.LOGIN,
                credentials
            )

            // Guardar tokens en localStorage
            if (response.data.tokens) {
                localStorage.setItem('accessToken', response.data.tokens.accessToken)
                localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
                localStorage.setItem('user', JSON.stringify(response.data.user))
            }

            return response.data
        } catch (error: any) {
            console.error('Error al iniciar sesión:', error.response?.data || error.message)
            throw error
        }
    },

    /**
     * Renovar access token
     * POST /users/refresh-token
     */
    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        try {
            const response = await apiClient.post<RefreshTokenResponse>(
                ENDPOINTS.USERS.REFRESH_TOKEN,
                { refreshToken }
            )

            // Actualizar access token
            if (response.data.tokens.accessToken) {
                localStorage.setItem('accessToken', response.data.tokens.accessToken)
            }

            return response.data
        } catch (error: any) {
            console.error('Error al renovar token:', error.response?.data || error.message)
            throw error
        }
    },

    /**
     * Cerrar sesión
     * POST /users/logout
     */
    logout: async (): Promise<void> => {
        try {
            await apiClient.post(ENDPOINTS.USERS.LOGOUT)

            // Limpiar localStorage
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
        } catch (error: any) {
            console.error('Error al cerrar sesión:', error.response?.data || error.message)
            // Limpiar localStorage aunque falle la petición
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            throw error
        }
    },

    /**
     * Obtener perfil del usuario autenticado
     * GET /users/profile
     * Requiere: Token JWT
     */
    getProfile: async (): Promise<User> => {
        try {
            const response = await apiClient.get<User>(ENDPOINTS.USERS.PROFILE)

            // Actualizar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(response.data))

            return response.data
        } catch (error: any) {
            console.error('Error al obtener perfil:', error.response?.data || error.message)
            throw error
        }
    },

    /**
     * Actualizar perfil del usuario autenticado
     * PUT /users/profile
     * Requiere: Token JWT
     */
    updateProfile: async (userData: Partial<RegisterUserDTO>): Promise<User> => {
        try {
            const response = await apiClient.put<User>(
                ENDPOINTS.USERS.UPDATE_PROFILE,
                userData
            )

            // Actualizar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(response.data))

            return response.data
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error.response?.data || error.message)
            throw error
        }
    },

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('accessToken')
        return !!token
    },

    /**
     * Obtener usuario actual del localStorage
     */
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                return JSON.parse(userStr)
            } catch {
                return null
            }
        }
        return null
    },
}