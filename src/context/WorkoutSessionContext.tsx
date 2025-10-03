import React, { createContext, useContext, useState, ReactNode } from 'react';
import workoutSessionService, { 
    WorkoutSession, 
    WeeklyStats,
    StartSessionRequest,
    CompleteSessionRequest 
} from '../services/api/workoutSessionService';

interface WorkoutSessionContextType {
    currentSession: WorkoutSession | null;
    weeklyStats: WeeklyStats | null;
    isLoading: boolean;
    error: string | null;
    startSession: (data: StartSessionRequest) => Promise<WorkoutSession>;
    completeSession: (sessionId: string, data: CompleteSessionRequest) => Promise<void>;
    cancelSession: (sessionId: string) => Promise<void>;
    refreshWeeklyStats: (userId: string) => Promise<void>;
    refreshActiveSession: (userId: string) => Promise<void>;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextType | undefined>(undefined);

export const WorkoutSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startSession = async (data: StartSessionRequest): Promise<WorkoutSession> => {
        try {
            setIsLoading(true);
            setError(null);
            const session = await workoutSessionService.startSession(data);
            setCurrentSession(session);
            return session;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const completeSession = async (sessionId: string, data: CompleteSessionRequest): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            await workoutSessionService.completeSession(sessionId, data);
            setCurrentSession(null);
            
            // Refrescar estadísticas después de completar
            if (currentSession) {
                await refreshWeeklyStats(currentSession.user_id);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al completar sesión';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelSession = async (sessionId: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            await workoutSessionService.cancelSession(sessionId);
            setCurrentSession(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cancelar sesión';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshWeeklyStats = async (userId: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const stats = await workoutSessionService.getWeeklyStats(userId);
            setWeeklyStats(stats);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar estadísticas';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshActiveSession = async (userId: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const session = await workoutSessionService.getActiveSession(userId);
            setCurrentSession(session);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar sesión activa';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WorkoutSessionContext.Provider
            value={{
                currentSession,
                weeklyStats,
                isLoading,
                error,
                startSession,
                completeSession,
                cancelSession,
                refreshWeeklyStats,
                refreshActiveSession,
            }}
        >
            {children}
        </WorkoutSessionContext.Provider>
    );
};

export const useWorkoutSession = (): WorkoutSessionContextType => {
    const context = useContext(WorkoutSessionContext);
    if (!context) {
        throw new Error('useWorkoutSession must be used within a WorkoutSessionProvider');
    }
    return context;
};
