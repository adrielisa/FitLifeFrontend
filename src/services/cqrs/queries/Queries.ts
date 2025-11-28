/**
 * CQRS: Queries (Lectura)
 * 
 * Las queries representan peticiones de lectura de datos
 * Patrón: Query Object Pattern
 * 
 * Características:
 * - NO contienen lógica de negocio
 * - Retornan DTOs optimizados para lectura
 * - Pueden cachear resultados
 * - Pueden leer de réplicas o caches
 */

import type {
    UserProfileDTO,
    UserHealthMetricsDTO,
    WorkoutProgressDTO,
    DailyNutritionDTO,
    GoalDTO,
    AchievementDTO,
    DashboardSummaryDTO,
    StatsDTO,
} from '../DTOs';

export interface IQuery<TResult> {
    /**
     * Ejecuta la query y retorna el resultado
     */
    execute(): Promise<TResult>;
}

/**
 * ==================== USER QUERIES ====================
 */

export class GetUserProfileQuery implements IQuery<UserProfileDTO | null> {
    constructor(private userId: string, private userRepository: any) {}

    async execute(): Promise<UserProfileDTO | null> {
        return await this.userRepository.getUserById(this.userId);
    }
}

export class GetUserHealthMetricsQuery implements IQuery<UserHealthMetricsDTO | null> {
    constructor(private userId: string, private userRepository: any) {}

    async execute(): Promise<UserHealthMetricsDTO | null> {
        return await this.userRepository.getHealthMetrics(this.userId);
    }
}

/**
 * ==================== WORKOUT QUERIES ====================
 */

export class GetWorkoutProgressQuery implements IQuery<WorkoutProgressDTO | null> {
    constructor(private userId: string, private workoutRepository: any) {}

    async execute(): Promise<WorkoutProgressDTO | null> {
        return await this.workoutRepository.getWorkoutProgress(this.userId);
    }
}

export class GetUserWorkoutsQuery implements IQuery<any[]> {
    constructor(
        private userId: string,
        private startDate?: Date,
        private endDate?: Date,
        private workoutRepository?: any
    ) {}

    async execute(): Promise<any[]> {
        return await this.workoutRepository.getWorkoutsByDateRange(
            this.userId,
            this.startDate,
            this.endDate
        );
    }
}

/**
 * ==================== NUTRITION QUERIES ====================
 */

export class GetDailyNutritionQuery implements IQuery<DailyNutritionDTO | null> {
    constructor(private userId: string, private date: Date, private mealRepository: any) {}

    async execute(): Promise<DailyNutritionDTO | null> {
        return await this.mealRepository.getDailyNutrition(this.userId, this.date);
    }
}

export class GetNutritionProgressQuery implements IQuery<any | null> {
    constructor(
        private userId: string,
        private days: number = 30,
        private mealRepository?: any
    ) {}

    async execute(): Promise<any | null> {
        return await this.mealRepository.getNutritionProgress(this.userId, this.days);
    }
}

export class GetMealHistoryQuery implements IQuery<any[]> {
    constructor(
        private userId: string,
        private startDate: Date,
        private endDate: Date,
        private mealRepository?: any
    ) {}

    async execute(): Promise<any[]> {
        return await this.mealRepository.getMealsByDateRange(
            this.userId,
            this.startDate,
            this.endDate
        );
    }
}

/**
 * ==================== GOAL QUERIES ====================
 */

export class GetActiveGoalsQuery implements IQuery<GoalDTO[]> {
    constructor(private userId: string, private goalRepository: any) {}

    async execute(): Promise<GoalDTO[]> {
        return await this.goalRepository.getActiveGoals(this.userId);
    }
}

export class GetGoalByIdQuery implements IQuery<GoalDTO | null> {
    constructor(private goalId: string, private goalRepository: any) {}

    async execute(): Promise<GoalDTO | null> {
        return await this.goalRepository.getGoalById(this.goalId);
    }
}

export class GetGoalProgressQuery implements IQuery<any | null> {
    constructor(private goalId: string, private goalRepository: any) {}

    async execute(): Promise<any | null> {
        return await this.goalRepository.getGoalProgress(this.goalId);
    }
}

/**
 * ==================== ACHIEVEMENT QUERIES ====================
 */

export class GetUserAchievementsQuery implements IQuery<AchievementDTO[]> {
    constructor(private userId: string, private achievementRepository: any) {}

    async execute(): Promise<AchievementDTO[]> {
        return await this.achievementRepository.getUserAchievements(this.userId);
    }
}

export class GetRecentAchievementsQuery implements IQuery<AchievementDTO[]> {
    constructor(private userId: string, private count: number = 5, private achievementRepository?: any) {}

    async execute(): Promise<AchievementDTO[]> {
        return await this.achievementRepository.getRecentAchievements(this.userId, this.count);
    }
}

/**
 * ==================== STATISTICS QUERIES ====================
 */

export class GetUserStatsQuery implements IQuery<StatsDTO | null> {
    constructor(private userId: string, private statsRepository: any) {}

    async execute(): Promise<StatsDTO | null> {
        return await this.statsRepository.getUserStats(this.userId);
    }
}

export class GetDashboardSummaryQuery implements IQuery<DashboardSummaryDTO | null> {
    constructor(private userId: string, private dashboardRepository: any) {}

    async execute(): Promise<DashboardSummaryDTO | null> {
        return await this.dashboardRepository.getDashboardSummary(this.userId);
    }
}

export class GetWeekSummaryQuery implements IQuery<any | null> {
    constructor(
        private userId: string,
        private startOfWeek: Date,
        private dashboardRepository?: any
    ) {}

    async execute(): Promise<any | null> {
        const endOfWeek = new Date(this.startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        return await this.dashboardRepository.getWeekSummary(
            this.userId,
            this.startOfWeek,
            endOfWeek
        );
    }
}

/**
 * ==================== QUERY BUS ====================
 */

export class QueryBus {
    private cache: Map<string, { result: any; timestamp: number }> = new Map();
    private cacheTTL = 5 * 60 * 1000; // 5 minutos por defecto

    /**
     * Ejecuta una query con caching opcional
     */
    async execute<TResult>(query: IQuery<TResult>, cacheKey?: string): Promise<TResult> {
        // Verificar cache
        if (cacheKey) {
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
                console.log(`[QueryBus] Resultado obtenido del cache: ${cacheKey}`);
                return cached.result;
            }
        }

        // Ejecutar query
        const queryName = query.constructor.name;
        console.log(`[QueryBus] Ejecutando query: ${queryName}`);

        try {
            const result = await query.execute();

            // Guardar en cache si se proporciona clave
            if (cacheKey) {
                this.cache.set(cacheKey, {
                    result,
                    timestamp: Date.now(),
                });
            }

            return result;
        } catch (error) {
            console.error(`[QueryBus] Error ejecutando query: ${error}`);
            throw error;
        }
    }

    /**
     * Invalida una entrada del cache
     */
    invalidateCache(cacheKey: string): void {
        this.cache.delete(cacheKey);
        console.log(`[QueryBus] Cache invalidado: ${cacheKey}`);
    }

    /**
     * Invalida todas las entradas del cache
     */
    clearCache(): void {
        this.cache.clear();
        console.log('[QueryBus] Cache limpiado completamente');
    }

    /**
     * Configura el TTL del cache
     */
    setCacheTTL(ttlMs: number): void {
        this.cacheTTL = ttlMs;
    }
}
