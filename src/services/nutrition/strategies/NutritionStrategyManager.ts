import type {
    INutritionStrategy,
    NutrientRecommendation,
    UserProfile,
    MealSuggestion,
    Meal,
} from './INutritionStrategy';
import { KetoStrategy } from './KetoStrategy';
import { VeganStrategy } from './VeganStrategy';
import { BalancedStrategy } from './BalancedStrategy';

export class NutritionStrategyManager {
    private strategies: Map<string, INutritionStrategy>;
    private activeStrategy: INutritionStrategy;

    constructor(defaultStrategy: 'keto' | 'vegan' | 'balanced' = 'balanced') {
        this.strategies = new Map();
        this.registerDefaultStrategies();
        this.activeStrategy = this.strategies.get(defaultStrategy) || new BalancedStrategy();
    }

    private registerDefaultStrategies(): void {
        this.registerStrategy('keto', new KetoStrategy());
        this.registerStrategy('vegan', new VeganStrategy());
        this.registerStrategy('balanced', new BalancedStrategy());
    }

    registerStrategy(name: string, strategy: INutritionStrategy): void {
        this.strategies.set(name.toLowerCase(), strategy);
    }

    switchStrategy(strategyName: string): void {
        const strategy = this.strategies.get(strategyName.toLowerCase());
        if (!strategy) {
            throw new Error(
                `Estrategia '${strategyName}' no encontrada. Estrategias disponibles: ${Array.from(this.strategies.keys()).join(', ')}`
            );
        }
        this.activeStrategy = strategy;
    }

    getActiveStrategy(): INutritionStrategy {
        return this.activeStrategy;
    }

    getActiveStrategyName(): string {
        return this.activeStrategy.getName();
    }

    listAvailableStrategies(): { name: string; description: string }[] {
        return Array.from(this.strategies.values()).map(strategy => ({
            name: strategy.getName(),
            description: strategy.getDescription(),
        }));
    }

    calculateNutrientRecommendations(userProfile: UserProfile): NutrientRecommendation {
        return this.activeStrategy.calculateNutrientRecommendations(userProfile);
    }

    suggestMeals(
        calories: number,
        preferences?: {
            favoriteIngredients?: string[];
            allergies?: string[];
            cuisinePreferences?: string[];
        }
    ): MealSuggestion[] {
        return this.activeStrategy.suggestMeals(calories, preferences);
    }

    isCompatibleMeal(meal: Meal): boolean {
        return this.activeStrategy.isCompatibleMeal(meal);
    }

    getEducationalContent() {
        return this.activeStrategy.getEducationalContent();
    }

    filterCompatibleMeals(meals: Meal[]): Meal[] {
        return meals.filter(meal => this.isCompatibleMeal(meal));
    }

    evaluateAllStrategies(userProfile: UserProfile): Array<{
        strategyName: string;
        dailyCalories: number;
        macros: {
            proteins: number;
            carbs: number;
            fats: number;
        };
        description: string;
    }> {
        return Array.from(this.strategies.values()).map(strategy => {
            const recommendations = strategy.calculateNutrientRecommendations(userProfile);
            return {
                strategyName: strategy.getName(),
                dailyCalories: recommendations.dailyCalories,
                macros: {
                    proteins: recommendations.macronutrients.proteins,
                    carbs: recommendations.macronutrients.carbohydrates,
                    fats: recommendations.macronutrients.fats,
                },
                description: strategy.getDescription(),
            };
        });
    }
}

export class NutritionStrategyFactory {
    static createManager(
        defaultStrategy: 'keto' | 'vegan' | 'balanced' = 'balanced'
    ): NutritionStrategyManager {
        return new NutritionStrategyManager(defaultStrategy);
    }

    static createManagerWithCustomStrategies(
        defaultStrategy: string,
        customStrategies?: { name: string; strategy: INutritionStrategy }[]
    ): NutritionStrategyManager {
        const manager = new NutritionStrategyManager('balanced');

        // Registrar estrategias personalizadas si se proporcionan
        if (customStrategies) {
            customStrategies.forEach(({ name, strategy }) => {
                manager.registerStrategy(name, strategy);
            });
        }

        // Cambiar a la estrategia por defecto
        try {
            manager.switchStrategy(defaultStrategy);
        } catch (error) {
            console.warn(
                `No se pudo cambiar a estrategia '${defaultStrategy}', usando 'balanced'`
            );
        }

        return manager;
    }
}
