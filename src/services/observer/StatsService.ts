/**
 * StatsService - Observador concreto
 * 
 * Responsabilidades:
 * - Escucha eventos de logros y progreso
 * - Actualiza estadísticas del usuario
 * - Calcula métricas de rendimiento
 * - Mantiene historial de progreso
 */

import type { IObserver, ObservableEvent } from './IObserver';
import { EventType } from './IObserver';

export interface UserStats {
    totalWorkoutsCompleted: number;
    totalCaloriesBurned: number;
    totalMealsLogged: number;
    totalCaloriesConsumed: number;
    currentStreak: number; // días consecutivos de actividad
    totalAchievementsUnlocked: number;
    goalsAchieved: number;
    averageWorkoutDuration: number; // minutos
    lastActivityDate: Date | null;
    startDate: Date;
}

export interface ActivityHistory {
    date: Date;
    type: 'workout' | 'meal' | 'goal' | 'achievement';
    details: Record<string, any>;
    value: number; // kcal, minutos, etc.
}

export class StatsService implements IObserver {
    private stats: UserStats;
    private activityHistory: ActivityHistory[] = [];
    private maxHistorySize = 1000;

    constructor() {
        this.stats = {
            totalWorkoutsCompleted: 0,
            totalCaloriesBurned: 0,
            totalMealsLogged: 0,
            totalCaloriesConsumed: 0,
            currentStreak: 0,
            totalAchievementsUnlocked: 0,
            goalsAchieved: 0,
            averageWorkoutDuration: 0,
            lastActivityDate: null,
            startDate: new Date(),
        };
    }

    /**
     * Implementación de IObserver.update()
     */
    update(event: ObservableEvent): void {
        switch (event.type) {
            case EventType.WORKOUT_COMPLETED:
                this.handleWorkoutCompleted(event.data);
                break;

            case EventType.MEAL_LOGGED:
                this.handleMealLogged(event.data);
                break;

            case EventType.GOAL_ACHIEVED:
                this.handleGoalAchieved(event.data);
                break;

            case EventType.ACHIEVEMENT_UNLOCKED:
                this.handleAchievementUnlocked(event.data);
                break;

            case EventType.STATS_UPDATED:
                this.handleStatsUpdate(event.data);
                break;

            default:
                console.log(`[StatsService] Evento ignorado: ${event.type}`);
        }

        // Registrar en historial
        this.addToHistory(event);
        this.updateStreak(event.timestamp);
    }

    /**
     * Procesa un entrenamiento completado
     */
    private handleWorkoutCompleted(data: Record<string, any>): void {
        this.stats.totalWorkoutsCompleted++;
        const duration = data.duration || 0;
        this.stats.totalCaloriesBurned += data.caloriesBurned || 0;

        // Calcular nuevo promedio
        this.stats.averageWorkoutDuration =
            (this.stats.averageWorkoutDuration * (this.stats.totalWorkoutsCompleted - 1) +
                duration) /
            this.stats.totalWorkoutsCompleted;

        console.log(
            `[StatsService] Entrenamiento completado. Total: ${this.stats.totalWorkoutsCompleted}`
        );
    }

    /**
     * Procesa una comida registrada
     */
    private handleMealLogged(data: Record<string, any>): void {
        this.stats.totalMealsLogged++;
        this.stats.totalCaloriesConsumed += data.calories || 0;

        console.log(
            `[StatsService] Comida registrada. Total: ${this.stats.totalMealsLogged}`
        );
    }

    /**
     * Procesa un objetivo alcanzado
     */
    private handleGoalAchieved(data: Record<string, any>): void {
        this.stats.goalsAchieved++;

        console.log(`[StatsService] Objetivo alcanzado: ${data.goalName}`);
    }

    /**
     * Procesa un logro desbloqueado
     */
    private handleAchievementUnlocked(data: Record<string, any>): void {
        this.stats.totalAchievementsUnlocked++;

        console.log(`[StatsService] Logro desbloqueado: ${data.achievementName}`);
    }

    /**
     * Actualiza estadísticas manualmente
     */
    private handleStatsUpdate(data: Record<string, any>): void {
        // Permitir actualizaciones manuales de cualquier campo
        Object.assign(this.stats, data);

        console.log('[StatsService] Estadísticas actualizadas manualmente');
    }

    /**
     * Añade un evento al historial de actividades
     */
    private addToHistory(event: ObservableEvent): void {
        const history: ActivityHistory = {
            date: event.timestamp,
            type: this.mapEventTypeToActivityType(event.type),
            details: event.data,
            value: event.data.value || 0,
        };

        this.activityHistory.unshift(history);

        // Limitar tamaño del historial
        if (this.activityHistory.length > this.maxHistorySize) {
            this.activityHistory = this.activityHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Mapea tipos de eventos a tipos de actividad
     */
    private mapEventTypeToActivityType(
        eventType: EventType
    ): 'workout' | 'meal' | 'goal' | 'achievement' {
        switch (eventType) {
            case EventType.WORKOUT_STARTED:
            case EventType.WORKOUT_COMPLETED:
                return 'workout';

            case EventType.MEAL_LOGGED:
                return 'meal';

            case EventType.GOAL_ACHIEVED:
            case EventType.GOAL_CREATED:
                return 'goal';

            case EventType.ACHIEVEMENT_UNLOCKED:
                return 'achievement';

            default:
                return 'activity' as any;
        }
    }

    /**
     * Actualiza la racha de días consecutivos
     */
    private updateStreak(newActivityDate: Date): void {
        if (!this.stats.lastActivityDate) {
            this.stats.currentStreak = 1;
            this.stats.lastActivityDate = newActivityDate;
            return;
        }

        const lastDate = new Date(this.stats.lastActivityDate);
        const newDate = new Date(newActivityDate);

        // Comparar solo las fechas (sin tiempo)
        const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const newDay = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());

        const diffTime = newDay.getTime() - lastDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Mismo día, no cambiar racha
        } else if (diffDays === 1) {
            // Día consecutivo, incrementar racha
            this.stats.currentStreak++;
        } else {
            // Racha rota, reiniciar
            this.stats.currentStreak = 1;
        }

        this.stats.lastActivityDate = newActivityDate;
    }

    /**
     * Obtiene las estadísticas actuales
     */
    getStats(): UserStats {
        return { ...this.stats };
    }

    /**
     * Obtiene el historial de actividades
     */
    getActivityHistory(limit?: number): ActivityHistory[] {
        if (limit) {
            return this.activityHistory.slice(0, limit);
        }
        return [...this.activityHistory];
    }

    /**
     * Calcula balance calórico (consumidas - quemadas)
     */
    getCalorieBalance(): number {
        return this.stats.totalCaloriesConsumed - this.stats.totalCaloriesBurned;
    }

    /**
     * Obtiene progreso estimado (0-100)
     * Basado en actividades completadas
     */
    getOverallProgress(): number {
        // Fórmula simple: considera entrenamientos y metas
        const maxExpectedWorkouts = 30; // Meta mensual
        const workoutProgress = Math.min(
            (this.stats.totalWorkoutsCompleted / maxExpectedWorkouts) * 50,
            50
        );
        const goalsProgress = Math.min(this.stats.goalsAchieved * 10, 50);

        return Math.min(workoutProgress + goalsProgress, 100);
    }

    /**
     * Obtiene resumen estadístico semanal
     */
    getWeeklySummary(): {
        workouts: number;
        caloriesBurned: number;
        mealsLogged: number;
        caloriesConsumed: number;
    } {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const weeklyHistory = this.activityHistory.filter(h => h.date >= oneWeekAgo);

        return {
            workouts: weeklyHistory.filter(h => h.type === 'workout').length,
            caloriesBurned: weeklyHistory
                .filter(h => h.type === 'workout')
                .reduce((sum, h) => sum + h.value, 0),
            mealsLogged: weeklyHistory.filter(h => h.type === 'meal').length,
            caloriesConsumed: weeklyHistory
                .filter(h => h.type === 'meal')
                .reduce((sum, h) => sum + h.value, 0),
        };
    }

    /**
     * Resetea todas las estadísticas
     */
    resetStats(): void {
        this.stats = {
            totalWorkoutsCompleted: 0,
            totalCaloriesBurned: 0,
            totalMealsLogged: 0,
            totalCaloriesConsumed: 0,
            currentStreak: 0,
            totalAchievementsUnlocked: 0,
            goalsAchieved: 0,
            averageWorkoutDuration: 0,
            lastActivityDate: null,
            startDate: new Date(),
        };
        this.activityHistory = [];

        console.log('[StatsService] Estadísticas reseteadas');
    }
}
