import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// URL base de la API desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos
})

// Interceptor para agregar el token JWT automáticamente a cada petición
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Obtener access token del localStorage
        const token = localStorage.getItem('accessToken')

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Si el token expiró (401) y no es un retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Intentar renovar el token
                const refreshToken = localStorage.getItem('refreshToken')

                if (refreshToken) {
                    const response = await axios.post<{ tokens: { accessToken: string } }>(
                        `${API_BASE_URL}/users/refresh-token`,
                        { refreshToken }
                    )

                    const { accessToken } = response.data.tokens

                    // Guardar nuevo token
                    localStorage.setItem('accessToken', accessToken)

                    // Reintentar la petición original con el nuevo token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    }
                    return apiClient(originalRequest)
                }
            } catch (refreshError) {
                // Si falla el refresh, cerrar sesión
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient