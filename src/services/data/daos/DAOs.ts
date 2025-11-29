export interface IUserDAO {
    getUserById(userId: string): Promise<any>;
    createUser(userData: any): Promise<string>;
    updateUser(userId: string, userData: any): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    getHealthMetrics(userId: string): Promise<any>;
    updateHealthMetrics(userId: string, metrics: any): Promise<void>;
    getAllUsers(): Promise<any[]>;
}

export interface IWorkoutDAO {
    saveWorkoutSession(sessionData: any): Promise<string>;
    getWorkoutSession(sessionId: string): Promise<any>;
    updateWorkoutSession(sessionId: string, sessionData: any): Promise<void>;
    deleteWorkoutSession(sessionId: string): Promise<void>;
    getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]>;
    getWorkoutProgress(userId: string): Promise<any>;
    saveExerciseLog(logData: any): Promise<string>;
    getExerciseLogs(sessionId: string): Promise<any[]>;
}

export interface IMealDAO {
    saveMealLog(mealData: any): Promise<string>;
    getMealLog(mealId: string): Promise<any>;
    updateMealLog(mealId: string, mealData: any): Promise<void>;
    deleteMealLog(mealId: string): Promise<void>;
    getMealsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]>;
    getDailyNutrition(userId: string, date: Date): Promise<any>;
    getNutritionProgress(userId: string, days: number): Promise<any>;
}

export interface IGoalDAO {
    saveGoal(goalData: any): Promise<string>;
    getGoalById(goalId: string): Promise<any>;
    updateGoal(goalId: string, goalData: any): Promise<void>;
    deleteGoal(goalId: string): Promise<void>;
    getActiveGoals(userId: string): Promise<any[]>;
    getGoalProgress(goalId: string): Promise<any>;
    updateGoalProgress(goalId: string, newValue: number): Promise<void>;
    getCompletedGoals(userId: string): Promise<any[]>;
}

export interface IAchievementDAO {
    saveAchievement(achievementData: any): Promise<string>;
    getAchievementById(achievementId: string): Promise<any>;
    getUserAchievements(userId: string): Promise<any[]>;
    getRecentAchievements(userId: string, count: number): Promise<any[]>;
    unlockAchievement(userId: string, achievementId: string): Promise<void>;
    getAchievementStats(userId: string): Promise<any>;
}

export interface INotificationDAO {
    saveNotification(notificationData: any): Promise<string>;
    getNotification(notificationId: string): Promise<any>;
    getUserNotifications(userId: string, limit?: number): Promise<any[]>;
    getUnreadNotifications(userId: string): Promise<any[]>;
    markAsRead(notificationId: string): Promise<void>;
    deleteNotification(notificationId: string): Promise<void>;
}

export class UserDAOMock implements IUserDAO {
    private users: Map<string, any> = new Map();

    async getUserById(userId: string): Promise<any> {
        return this.users.get(userId) || null;
    }

    async createUser(userData: any): Promise<string> {
        const id = `user_${Date.now()}`;
        this.users.set(id, { id, ...userData, createdAt: new Date() });
        return id;
    }

    async updateUser(userId: string, userData: any): Promise<void> {
        const user = this.users.get(userId);
        if (user) {
            this.users.set(userId, { ...user, ...userData, updatedAt: new Date() });
        }
    }

    async deleteUser(userId: string): Promise<void> {
        this.users.delete(userId);
    }

    async getHealthMetrics(userId: string): Promise<any> {
        const user = this.users.get(userId);
        return user?.healthMetrics || null;
    }

    async updateHealthMetrics(userId: string, metrics: any): Promise<void> {
        const user = this.users.get(userId);
        if (user) {
            user.healthMetrics = { ...user.healthMetrics, ...metrics };
            user.updatedAt = new Date();
        }
    }

    async getAllUsers(): Promise<any[]> {
        return Array.from(this.users.values());
    }
}

export class WorkoutDAOMock implements IWorkoutDAO {
    private sessions: Map<string, any> = new Map();
    private exerciseLogs: Map<string, any[]> = new Map();

    async saveWorkoutSession(sessionData: any): Promise<string> {
        const id = `workout_${Date.now()}`;
        this.sessions.set(id, { id, ...sessionData, createdAt: new Date() });
        this.exerciseLogs.set(id, []);
        return id;
    }

    async getWorkoutSession(sessionId: string): Promise<any> {
        return this.sessions.get(sessionId) || null;
    }

    async updateWorkoutSession(sessionId: string, sessionData: any): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.sessions.set(sessionId, { ...session, ...sessionData });
        }
    }

    async deleteWorkoutSession(sessionId: string): Promise<void> {
        this.sessions.delete(sessionId);
        this.exerciseLogs.delete(sessionId);
    }

    async getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
        return Array.from(this.sessions.values()).filter(s =>
            s.userId === userId &&
            new Date(s.startTime) >= startDate &&
            new Date(s.endTime) <= endDate
        );
    }

    async getWorkoutProgress(userId: string): Promise<any> {
        const workouts = await this.getWorkoutsByDateRange(
            userId,
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            new Date()
        );

        return {
            totalSessions: workouts.length,
            totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
            totalCaloriesBurned: workouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
        };
    }

    async saveExerciseLog(logData: any): Promise<string> {
        const id = `exercise_${Date.now()}`;
        const sessionId = logData.sessionId;
        const logs = this.exerciseLogs.get(sessionId) || [];
        logs.push({ id, ...logData });
        this.exerciseLogs.set(sessionId, logs);
        return id;
    }

    async getExerciseLogs(sessionId: string): Promise<any[]> {
        return this.exerciseLogs.get(sessionId) || [];
    }
}

export class MealDAOMock implements IMealDAO {
    private meals: Map<string, any> = new Map();

    async saveMealLog(mealData: any): Promise<string> {
        const id = `meal_${Date.now()}`;
        this.meals.set(id, { id, ...mealData, createdAt: new Date() });
        return id;
    }

    async getMealLog(mealId: string): Promise<any> {
        return this.meals.get(mealId) || null;
    }

    async updateMealLog(mealId: string, mealData: any): Promise<void> {
        const meal = this.meals.get(mealId);
        if (meal) {
            this.meals.set(mealId, { ...meal, ...mealData, updatedAt: new Date() });
        }
    }

    async deleteMealLog(mealId: string): Promise<void> {
        this.meals.delete(mealId);
    }

    async getMealsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
        return Array.from(this.meals.values()).filter(m =>
            m.userId === userId &&
            new Date(m.date) >= startDate &&
            new Date(m.date) <= endDate
        );
    }

    async getDailyNutrition(userId: string, date: Date): Promise<any> {
        const meals = await this.getMealsByDateRange(userId, date, new Date(date.getTime() + 86400000));
        return {
            totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
            mealsLogged: meals.length,
        };
    }

    async getNutritionProgress(userId: string, days: number): Promise<any> {
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const meals = await this.getMealsByDateRange(userId, startDate, new Date());

        return {
            totalMealsLogged: meals.length,
            averageDailyCalories: meals.length > 0
                ? meals.reduce((sum, m) => sum + m.calories, 0) / days
                : 0,
        };
    }
}

export class GoalDAOMock implements IGoalDAO {
    private goals: Map<string, any> = new Map();

    async saveGoal(goalData: any): Promise<string> {
        const id = `goal_${Date.now()}`;
        this.goals.set(id, { id, ...goalData, createdAt: new Date() });
        return id;
    }

    async getGoalById(goalId: string): Promise<any> {
        return this.goals.get(goalId) || null;
    }

    async updateGoal(goalId: string, goalData: any): Promise<void> {
        const goal = this.goals.get(goalId);
        if (goal) {
            this.goals.set(goalId, { ...goal, ...goalData, updatedAt: new Date() });
        }
    }

    async deleteGoal(goalId: string): Promise<void> {
        this.goals.delete(goalId);
    }

    async getActiveGoals(userId: string): Promise<any[]> {
        return Array.from(this.goals.values()).filter(g =>
            g.userId === userId && g.status !== 'achieved' && g.status !== 'failed'
        );
    }

    async getGoalProgress(goalId: string): Promise<any> {
        const goal = this.goals.get(goalId);
        return goal ? { progress: (goal.currentValue / goal.targetValue) * 100 } : null;
    }

    async updateGoalProgress(goalId: string, newValue: number): Promise<void> {
        const goal = this.goals.get(goalId);
        if (goal) {
            goal.currentValue = newValue;
            if (newValue >= goal.targetValue) {
                goal.status = 'achieved';
            }
        }
    }

    async getCompletedGoals(userId: string): Promise<any[]> {
        return Array.from(this.goals.values()).filter(g =>
            g.userId === userId && g.status === 'achieved'
        );
    }
}
