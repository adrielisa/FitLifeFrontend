/**
 * Endpoints centralizados de la API FitLife
 */
export const ENDPOINTS = {
    // 👥 Usuarios
    USERS: {
        REGISTER: '/users/register',
        LOGIN: '/users/login',
        REFRESH_TOKEN: '/users/refresh-token',
        LOGOUT: '/users/logout',
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        LIST: '/users',
        BY_ID: (id: string) => `/users/${id}`,
        UPDATE: (id: string) => `/users/${id}`,
        DELETE: (id: string) => `/users/${id}`,
    },

    // 💪 Ejercicios
    EXERCISES: {
        LIST: '/exercises',
        BY_ID: (id: string) => `/exercises/${id}`,
        BY_MUSCLE_GROUP: (group: string) => `/exercises/muscle-group/${group}`,
        BY_DIFFICULTY: (level: string) => `/exercises/difficulty/${level}`,
        CREATE: '/exercises',
        UPDATE: (id: string) => `/exercises/${id}`,
        DELETE: (id: string) => `/exercises/${id}`,
    },

    // 🍎 Alimentos
    FOODS: {
        LIST: '/foods',
        BY_ID: (id: string) => `/foods/${id}`,
        SEARCH: (name: string) => `/foods/search/name?name=${encodeURIComponent(name)}`,
        BY_BRAND: (brand: string) => `/foods/brand/${brand}`,
        CREATE: '/foods',
        UPDATE: (id: string) => `/foods/${id}`,
        DELETE: (id: string) => `/foods/${id}`,
    },

    // 📅 Planes de Ejercicio
    EXERCISE_PLANS: {
        LIST: '/exercise-plans',
        BY_ID: (id: string) => `/exercise-plans/${id}`,
        BY_USER: (userId: string) => `/exercise-plans/user/${userId}`,
        ACTIVE: (userId: string) => `/exercise-plans/user/${userId}/active`,
        ACTIVATE: (userId: string, planId: string) => `/exercise-plans/user/${userId}/active/${planId}`,
        CREATE: '/exercise-plans',
        UPDATE: (id: string) => `/exercise-plans/${id}`,
        DELETE: (id: string) => `/exercise-plans/${id}`,
    },

    // 🏋️ Ejercicios de Plan
    PLAN_EXERCISES: {
        LIST: '/plan-exercises',
        BY_ID: (id: string) => `/plan-exercises/${id}`,
        BY_PLAN: (planId: string) => `/plan-exercises/plan/${planId}`,
        BY_DAY: (planId: string, day: string) => `/plan-exercises/plan/${planId}/day/${day}`,
        CREATE: '/plan-exercises',
        UPDATE: (id: string) => `/plan-exercises/${id}`,
        DELETE: (id: string) => `/plan-exercises/${id}`,
        DELETE_ALL: (planId: string) => `/plan-exercises/plan/${planId}`,
    },

    // 🏃 Sesiones de Workout
    WORKOUT_SESSIONS: {
        LIST: '/workout-sessions',
        BY_ID: (id: string) => `/workout-sessions/${id}`,
        BY_USER: (userId: string) => `/workout-sessions/user/${userId}`,
        BY_DATE: (userId: string, date: string) => `/workout-sessions/user/${userId}/date/${date}`,
        BY_DATE_RANGE: (userId: string, startDate: string, endDate: string) =>
            `/workout-sessions/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`,
        BY_PLAN: (planId: string) => `/workout-sessions/plan/${planId}`,
        START: '/workout-sessions/start',
        COMPLETE: (sessionId: string) => `/workout-sessions/${sessionId}/complete`,
        CANCEL: (sessionId: string) => `/workout-sessions/${sessionId}/cancel`,
        HISTORY: (userId: string) => `/workout-sessions/user/${userId}/history`,
        STATS_WEEKLY: (userId: string) => `/workout-sessions/stats/weekly/${userId}`,
        CREATE: '/workout-sessions',
        UPDATE: (id: string) => `/workout-sessions/${id}`,
        DELETE: (id: string) => `/workout-sessions/${id}`,
    },

    // 📊 Registro Nutricional
    NUTRITION_LOGS: {
        LIST: '/nutrition-logs',
        BY_ID: (id: string) => `/nutrition-logs/${id}`,
        BY_USER: (userId: string) => `/nutrition-logs/user/${userId}`,
        BY_DATE: (userId: string, date: string) => `/nutrition-logs/user/${userId}/date/${date}`,
        BY_MEAL_TYPE: (userId: string, mealType: string) => `/nutrition-logs/user/${userId}/meal-type/${mealType}`,
        CALORIES_BY_DATE: (userId: string, date: string) => `/nutrition-logs/user/${userId}/calories/date/${date}`,
        CALORIES_BY_RANGE: (userId: string, startDate: string, endDate: string) =>
            `/nutrition-logs/user/${userId}/calories/date-range?startDate=${startDate}&endDate=${endDate}`,
        CREATE: '/nutrition-logs',
        UPDATE: (id: string) => `/nutrition-logs/${id}`,
        DELETE: (id: string) => `/nutrition-logs/${id}`,
    },
} as const