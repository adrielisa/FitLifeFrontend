/**
 * NutritionStrategyManager
 * 
 * Implementación del patrón Strategy para gestionar diferentes estrategias de nutrición
 * Permite cambiar dinámicamente entre diferentes enfoques nutricionales
 * 
 * Responsabilidades:
 * - Registrar estrategias disponibles
 * - Cambiar la estrategia activa en tiempo de ejecución
 * - Delegar operaciones a la estrategia activa
 * - Validar compatibilidad de comidas
 */

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

    /**
     * Registra las estrategias por defecto
     */
    private registerDefaultStrategies(): void {
        this.registerStrategy('keto', new KetoStrategy());
        this.registerStrategy('vegan', new VeganStrategy());
        this.registerStrategy('balanced', new BalancedStrategy());
    }

    /**
     * Registra una nueva estrategia personalizada
     * @param name Identificador único de la estrategia
     * @param strategy Implementación de INutritionStrategy
     */
    registerStrategy(name: string, strategy: INutritionStrategy): void {
        this.strategies.set(name.toLowerCase(), strategy);
    }

    /**
     * Cambia la estrategia activa
     * @param strategyName Nombre de la estrategia a usar
     * @throws Error si la estrategia no existe
     */
    switchStrategy(strategyName: string): void {
        const strategy = this.strategies.get(strategyName.toLowerCase());
        if (!strategy) {
            throw new Error(
                `Estrategia '${strategyName}' no encontrada. Estrategias disponibles: ${Array.from(this.strategies.keys()).join(', ')}`
            );
        }
        this.activeStrategy = strategy;
    }

    /**
     * Obtiene la estrategia activa actual
     */
    getActiveStrategy(): INutritionStrategy {
        return this.activeStrategy;
    }

    /**
     * Obtiene el nombre de la estrategia activa
     */
    getActiveStrategyName(): string {
        return this.activeStrategy.getName();
    }

    /**
     * Lista todas las estrategias disponibles
     */
    listAvailableStrategies(): { name: string; description: string }[] {
        return Array.from(this.strategies.values()).map(strategy => ({
            name: strategy.getName(),
            description: strategy.getDescription(),
        }));
    }

    /**
     * Calcula recomendaciones nutricionales usando la estrategia activa
     */
    calculateNutrientRecommendations(userProfile: UserProfile): NutrientRecommendation {
        return this.activeStrategy.calculateNutrientRecommendations(userProfile);
    }

    /**
     * Sugiere comidas usando la estrategia activa
     */
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

    /**
     * Valida si una comida es compatible con la estrategia activa
     */
    isCompatibleMeal(meal: Meal): boolean {
        return this.activeStrategy.isCompatibleMeal(meal);
    }

    /**
     * Obtiene contenido educacional de la estrategia activa
     */
    getEducationalContent() {
        return this.activeStrategy.getEducationalContent();
    }

    /**
     * Filtra comidas compatibles de una lista
     */
    filterCompatibleMeals(meals: Meal[]): Meal[] {
        return meals.filter(meal => this.isCompatibleMeal(meal));
    }

    /**
     * Evalúa múltiples estrategias para un usuario específico
     * Útil para comparar qué estrategia es mejor para el usuario
     */
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

/**
 * Factory para crear el NutritionStrategyManager
 * Permite inyección de dependencias y configuración centralizada
 */
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
