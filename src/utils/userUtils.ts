/**
 * Utilidades para manejo de usuario en localStorage
 */

export interface User {
    user_id: string;
    name: string;
    email: string;
    age: number;
    weight: number;
    height: number;
    fitness_goal: string;
    activity_level: string;
}

/**
 * Obtener el userId del usuario actual del localStorage
 * @returns userId o null si no existe
 */
export const getUserId = (): string | null => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        return null;
    }
    
    try {
        const user = JSON.parse(userStr) as User;
        return user.user_id || null;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

/**
 * Obtener el objeto user completo del localStorage
 * @returns User object o null si no existe
 */
export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        return null;
    }
    
    try {
        return JSON.parse(userStr) as User;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

/**
 * Verificar si el usuario está autenticado
 * @returns true si hay un token y usuario válidos
 */
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('accessToken');
    const user = getCurrentUser();
    return !!token && !!user;
};

/**
 * Limpiar datos de sesión del localStorage
 */
export const clearSession = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};
