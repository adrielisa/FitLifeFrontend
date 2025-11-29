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

export interface INutritionStrategy {
    getName(): string;
    getDescription(): string;

    calculateNutrientRecommendations(userProfile: UserProfile): NutrientRecommendation;

    suggestMeals(
        calories: number,
        preferences?: {
            favoriteIngredients?: string[];
            allergies?: string[];
            cuisinePreferences?: string[];
        }
    ): MealSuggestion[];

    isCompatibleMeal(meal: Meal): boolean;
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
