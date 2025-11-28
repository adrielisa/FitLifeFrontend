/**
 * Interface que define el contrato para estrategias de nutrición
 * Implementa el patrón Strategy de GoF
 * 
 * Permite cambiar dinámicamente la estrategia de nutrición sin modificar el código cliente
 */

export interface NutrientRecommendation {
    macronutrients: {
        proteins: number;      // en gramos
        carbohydrates: number; // en gramos
        fats: number;          // en gramos
    };
    micronutrients: {
        vitaminC: number;      // en mg
        vitaminD: number;      // en IU
        calcium: number;       // en mg
        iron: number;          // en mg
    };
    dailyCalories: number;     // en kcal
    mealTiming: MealTiming[];
    restrictions: string[];    // alimentos prohibidos
}

export interface MealTiming {
    name: string;
    time: string;              // ej: "08:00"
    caloriesPercentage: number; // porcentaje del total diario
    suggestedFoods: string[];
}

export interface UserProfile {
    age: number;
    weight: number;            // en kg
    height: number;            // en cm
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'high' | 'veryHigh';
    fitnessGoal: 'weightLoss' | 'maintenance' | 'muscleGain';
    healthConditions?: string[]; // diabetes, hipertensión, etc.
}

/**
 * Interface principal que define el contrato para todas las estrategias de nutrición
 */
export interface INutritionStrategy {
    /**
     * Nombre descriptivo de la estrategia
     */
    getName(): string;

    /**
     * Descripción de la estrategia
     */
    getDescription(): string;

    /**
     * Calcula las recomendaciones nutricionales basadas en el perfil del usuario
     * @param userProfile Perfil del usuario
     * @returns Recomendaciones nutricionales personalizadas
     */
    calculateNutrientRecommendations(userProfile: UserProfile): NutrientRecommendation;

    /**
     * Sugiere comidas según la estrategia
     * @param calorias Cantidad de calorías disponibles
     * @param preferences Preferencias del usuario (alimentos favoritos, alergias, etc)
     * @returns Lista de comidas recomendadas
     */
    suggestMeals(
        calories: number,
        preferences?: {
            favoriteIngredients?: string[];
            allergies?: string[];
            cuisinePreferences?: string[];
        }
    ): MealSuggestion[];

    /**
     * Valida si una comida es compatible con esta estrategia
     * @param meal Comida a validar
     * @returns true si la comida es compatible, false en caso contrario
     */
    isCompatibleMeal(meal: Meal): boolean;

    /**
     * Proporciona educación sobre la estrategia
     * @returns Información sobre beneficios, desventajas y cómo seguir la estrategia
     */
    getEducationalContent(): EducationalContent;
}

export interface MealSuggestion {
    name: string;
    calories: number;
    description: string;
    ingredients: string[];
    preparationTime: number; // en minutos
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Meal {
    name: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    ingredients: string[];
}

export interface EducationalContent {
    title: string;
    description: string;
    benefits: string[];
    limitations: string[];
    tips: string[];
    resources: string[]; // URLs a artículos, estudios, etc.
}
