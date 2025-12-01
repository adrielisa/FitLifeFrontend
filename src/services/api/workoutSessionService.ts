import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';

/**
 * Tipos para las sesiones de entrenamiento
 */
export interface WorkoutSession {
    session_id: string;
    user_id: string;
    plan_id: string;
    session_date: string;
    start_time: string;
    end_time?: string;
    duration_minutes?: number;
    completed: boolean;
    exercises_completed: number;
    exercises_total: number;
    total_calories: number;
    notes?: string;
}

export interface StartSessionRequest {
    user_id: string;
    plan_id: string;
    exercises_total: number;
}

export interface CompleteSessionRequest {
    exercises_completed: number;
    total_calories: number;
    notes?: string;
}

export interface WeeklyStats {
    totalSessions: number;
    completedSessions: number;
    totalMinutes: number;
    totalCalories: number;
    averageDuration: number;
    sessionsPerDay: Record<string, number>;
}

/**
 * Servicio para manejar sesiones de entrenamiento
 */
class WorkoutSessionService {
    /**
     * Iniciar una nueva sesión de entrenamiento
     */
    async startSession(data: StartSessionRequest): Promise<WorkoutSession> {
        const response = await apiClient.post<{ session: WorkoutSession }>(
            ENDPOINTS.WORKOUT_SESSIONS.START,
            data
        );
        return response.data.session;
    }

    /**
     * Completar una sesión de entrenamiento
     */
    async completeSession(
        sessionId: string,
        data: CompleteSessionRequest
    ): Promise<WorkoutSession> {
        const response = await apiClient.put<{ session: WorkoutSession }>(
            ENDPOINTS.WORKOUT_SESSIONS.COMPLETE(sessionId),
            data
        );
        return response.data.session;
    }

    /**
     * Cancelar una sesión de entrenamiento
     */
    async cancelSession(sessionId: string): Promise<void> {
        await apiClient.put(ENDPOINTS.WORKOUT_SESSIONS.CANCEL(sessionId));
    }

    /**
     * Obtener historial de entrenamientos del usuario
     */
    async getHistory(userId: string): Promise<WorkoutSession[]> {
        const response = await apiClient.get<{ sessions: WorkoutSession[] }>(
            ENDPOINTS.WORKOUT_SESSIONS.HISTORY(userId)
        );
        return response.data.sessions;
    }

    /**
     * Obtener estadísticas semanales
     */
    async getWeeklyStats(userId: string): Promise<WeeklyStats> {
        const response = await apiClient.get<{ stats: WeeklyStats }>(
            ENDPOINTS.WORKOUT_SESSIONS.STATS_WEEKLY(userId)
        );
        return response.data.stats;
    }

    /**
     * Obtener sesión activa del usuario (si existe)
     */
    async getActiveSession(userId: string): Promise<WorkoutSession | null> {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await apiClient.get<{ session: WorkoutSession }>(
                ENDPOINTS.WORKOUT_SESSIONS.BY_DATE(userId, today)
            );
            
            const session = response.data.session;
            // Retornar solo si está en progreso (no completada)
            return session && !session.completed ? session : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Obtener todas las sesiones por rango de fechas
     */
    async getSessionsByDateRange(
        userId: string,
        startDate: string,
        endDate: string
    ): Promise<WorkoutSession[]> {
        const response = await apiClient.get<{ sessions: WorkoutSession[] }>(
            ENDPOINTS.WORKOUT_SESSIONS.BY_DATE_RANGE(userId, startDate, endDate)
        );
        return response.data.sessions;
    }
}

export default new WorkoutSessionService();
