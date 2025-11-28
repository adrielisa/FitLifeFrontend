/**
 * DTOs (Data Transfer Objects) para la capa CQRS
 * 
 * Los DTOs optimizan la transferencia de datos:
 * - Incluyen solo los campos necesarios
 * - Mejoran seguridad (no exponen toda la entidad)
 * - Facilitan transformaciones de datos
 * - Permiten versioning de APIs
 */

/**
 * DTOs para Usuarios
 */
export interface UserProfileDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserHealthMetricsDTO {
    userId: string;
    weight: number; // kg
    height: number; // cm
    age: number;
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'high' | 'veryHigh';
    fitnessGoal: 'weightLoss' | 'maintenance' | 'muscleGain';
}

/**
 * DTOs para Entrenamientos
 */
export interface WorkoutSessionDTO {
    id: string;
    userId: string;
    planId: string;
    planName: string;
    startTime: Date;
    endTime: Date;
    duration: number; // minutos
    caloriesBurned: number;
    exercisesCompleted: number;
    exercisesTotal: number;
    notes?: string;
}

export interface ExerciseLogDTO {
    id: string;
    sessionId: string;
    exerciseName: string;
    setsCompleted: number;
    repsCompleted: number;
    weightUsed?: number; // kg
    intensity: 'low' | 'medium' | 'high';
    duration?: number; // minutos
    completed: boolean;
}

export interface WorkoutProgressDTO {
    userId: string;
    totalSessions: number;
    totalDuration: number; // minutos
    totalCaloriesBurned: number;
    weeklyAverage: number; // sesiones por semana
    currentStreak: number; // días consecutivos
    lastWorkout: Date | null;
}

/**
 * DTOs para Nutrición
 */
export interface MealLogDTO {
    id: string;
    userId: string;
    date: Date;
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
    foodName: string;
    quantity: number;
    unit: string;
    calories: number;
    macros: {
        proteins: number;
        carbohydrates: number;
        fats: number;
    };
    notes?: string;
}

export interface DailyNutritionDTO {
    date: Date;
    userId: string;
    totalCalories: number;
    target: number;
    balance: number; // target - consumed
    macros: {
        proteinConsumed: number;
        proteinTarget: number;
        carbConsumed: number;
        carbTarget: number;
        fatConsumed: number;
        fatTarget: number;
    };
    mealsLogged: number;
    waterIntake: number; // litros
}

export interface NutritionProgressDTO {
    userId: string;
    averageDailyCalories: number;
    totalMealsLogged: number;
    consistencyScore: number; // 0-100, qué tan consistente es
    currentDietStrategy: string;
    lastMeal: MealLogDTO | null;
}

/**
 * DTOs para Objetivos
 */
export interface GoalDTO {
    id: string;
    userId: string;
    name: string;
    description?: string;
    type: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline: Date;
    status: 'pending' | 'in_progress' | 'achieved' | 'failed';
    progress: number; // 0-100
    createdAt: Date;
}

export interface GoalProgressDTO {
    goalId: string;
    goalName: string;
    progress: number; // 0-100
    daysRemaining: number;
    milestone: boolean;
}

/**
 * DTOs para Logros
 */
export interface AchievementDTO {
    id: string;
    userId: string;
    name: string;
    description: string;
    type: string;
    icon?: string;
    points: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    unlockedAt: Date;
    isNew: boolean;
}

export interface AchievementsProgressDTO {
    userId: string;
    totalUnlocked: number;
    totalPoints: number;
    recentAchievements: AchievementDTO[];
    nextMilestone?: {
        name: string;
        pointsNeeded: number;
    };
}

/**
 * DTOs para Dashboard
 */
export interface DashboardSummaryDTO {
    user: UserProfileDTO;
    healthMetrics: UserHealthMetricsDTO;
    todayWorkout: WorkoutSessionDTO | null;
    todayNutrition: DailyNutritionDTO;
    activeGoals: GoalDTO[];
    recentAchievements: AchievementDTO[];
    weekProgress: WeekProgressDTO;
}

export interface WeekProgressDTO {
    weekStartDate: Date;
    totalWorkouts: number;
    targetWorkouts: number;
    totalCaloriesBurned: number;
    totalCaloriesConsumed: number;
    daysActive: number;
    streak: number;
}

/**
 * DTOs para Notificaciones
 */
export interface NotificationDTO {
    id: string;
    userId: string;
    type: 'success' | 'warning' | 'info' | 'error' | 'milestone';
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    action?: {
        label: string;
        url: string;
    };
}

/**
 * DTOs para Estadísticas
 */
export interface StatsDTO {
    userId: string;
    totalWorkouts: number;
    totalCaloriesBurned: number;
    totalMealsLogged: number;
    totalCaloriesConsumed: number;
    streak: number;
    goalsAchieved: number;
    achievements: number;
    averageWorkoutDuration: number;
}

/**
 * DTOs para Recomendaciones
 */
export interface RecommendationDTO {
    id: string;
    userId: string;
    type: 'workout' | 'nutrition' | 'goal' | 'lifestyle';
    title: string;
    description: string;
    priority: 'low' | 'normal' | 'high';
    createdAt: Date;
    expiresAt?: Date;
    dismissed: boolean;
}
