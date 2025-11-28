/**
 * Estrategia de Nutrición: Dieta Balanceada
 * 
 * Enfoque: Nutrición equilibrada con proporción moderada de macro y micronutrientes
 * Objetivo: Nutrición óptima para salud general y sostenibilidad a largo plazo
 * 
 * Macros típicas: 50% carbs, 25% proteínas, 25% grasas
 */

import type {
    INutritionStrategy,
    NutrientRecommendation,
    UserProfile,
    MealSuggestion,
    Meal,
    EducationalContent,
} from './INutritionStrategy';

export class BalancedStrategy implements INutritionStrategy {
    getName(): string {
        return 'Balanceada';
    }

    getDescription(): string {
        return 'Dieta equilibrada que combina todos los grupos de alimentos en proporciones adecuadas para una salud óptima y sostenibilidad.';
    }

    calculateNutrientRecommendations(userProfile: UserProfile): NutrientRecommendation {
        const tdee = this.calculateTDEE(userProfile);

        // Ajuste según objetivo
        let dailyCalories = tdee;
        if (userProfile.fitnessGoal === 'weightLoss') {
            dailyCalories = tdee * 0.85; // déficit de 15%
        } else if (userProfile.fitnessGoal === 'muscleGain') {
            dailyCalories = tdee * 1.1; // superávit de 10%
        }

        // Macros Balanceada: 50% carbs, 25% proteínas, 25% grasas
        const carbohydrates = (dailyCalories * 0.5) / 4;  // 4 cal/g
        const proteins = (dailyCalories * 0.25) / 4;      // 4 cal/g
        const fats = (dailyCalories * 0.25) / 9;          // 9 cal/g

        return {
            macronutrients: {
                proteins: Math.round(proteins),
                carbohydrates: Math.round(carbohydrates),
                fats: Math.round(fats),
            },
            micronutrients: {
                vitaminC: 90,
                vitaminD: 1000,
                calcium: 1000,
                iron: 18,
            },
            dailyCalories: Math.round(dailyCalories),
            mealTiming: [
                {
                    name: 'Desayuno',
                    time: '07:00',
                    caloriesPercentage: 0.25,
                    suggestedFoods: [
                        'Cereal integral',
                        'Leche',
                        'Frutas',
                        'Yogur',
                    ],
                },
                {
                    name: 'Almuerzo',
                    time: '12:30',
                    caloriesPercentage: 0.35,
                    suggestedFoods: [
                        'Proteína magra',
                        'Arroz o pasta',
                        'Verduras',
                        'Aceite de oliva',
                    ],
                },
                {
                    name: 'Merienda',
                    time: '16:00',
                    caloriesPercentage: 0.15,
                    suggestedFoods: ['Fruta', 'Lácteo', 'Frutos secos'],
                },
                {
                    name: 'Cena',
                    time: '19:30',
                    caloriesPercentage: 0.25,
                    suggestedFoods: [
                        'Proteína magra',
                        'Verduras',
                        'Tubérculos',
                        'Ensalada',
                    ],
                },
            ],
            restrictions: [
                'Bebidas azucaradas excesivas',
                'Ultraprocesados',
                'Grasas trans',
            ],
        };
    }

    suggestMeals(
        calories: number,
        preferences?: {
            favoriteIngredients?: string[];
            allergies?: string[];
            cuisinePreferences?: string[];
        }
    ): MealSuggestion[] {
        const baseSuggestions: MealSuggestion[] = [
            {
                name: 'Pechuga de Pollo con Arroz Integral',
                calories: 480,
                description: 'Proteína magra, carbohidratos complejos, bajo en grasas',
                ingredients: ['Pechuga de pollo', 'Arroz integral', 'Verduras mixtas'],
                preparationTime: 25,
                difficulty: 'easy',
            },
            {
                name: 'Salmón a la Parrilla con Camote',
                calories: 520,
                description: 'Omega-3, proteína completa, vitaminas y minerales',
                ingredients: ['Salmón', 'Camote', 'Espárragos', 'Limón'],
                preparationTime: 20,
                difficulty: 'easy',
            },
            {
                name: 'Ensalada de Atún con Verduras',
                calories: 350,
                description: 'Ligera pero nutritiva, perfecta para almuerzo',
                ingredients: ['Atún', 'Lechuga', 'Tomate', 'Cebolla', 'Aceite de oliva'],
                preparationTime: 10,
                difficulty: 'easy',
            },
            {
                name: 'Carne Molida Magra con Papas y Brócoli',
                calories: 540,
                description: 'Comida completa con proteína, carbohidratos y verduras',
                ingredients: ['Carne magra', 'Papas', 'Brócoli', 'Ajo'],
                preparationTime: 30,
                difficulty: 'medium',
            },
            {
                name: 'Pasta Integral con Salsa de Tomate y Pavo',
                calories: 460,
                description: 'Carbohidratos complejos con proteína magra',
                ingredients: ['Pasta integral', 'Pavo', 'Tomates', 'Basílico'],
                preparationTime: 25,
                difficulty: 'easy',
            },
            {
                name: 'Huevo con Pan Integral y Verduras',
                calories: 320,
                description: 'Desayuno balanceado o almuerzo ligero',
                ingredients: ['Huevos', 'Pan integral', 'Tomate', 'Espinaca'],
                preparationTime: 15,
                difficulty: 'easy',
            },
        ];

        // Filtrar según preferencias si existen
        let filtered = baseSuggestions.filter(meal => meal.calories <= calories * 1.2);

        if (preferences?.allergies && preferences.allergies.length > 0) {
            filtered = filtered.filter(meal =>
                !meal.ingredients.some(ing =>
                    preferences.allergies!.some(allergy =>
                        ing.toLowerCase().includes(allergy.toLowerCase())
                    )
                )
            );
        }

        return filtered;
    }

    isCompatibleMeal(meal: Meal): boolean {
        // Para una dieta balanceada, casi todas las comidas son compatibles
        // Solo excluir alimentos ultra-procesados o con grasas trans
        // En una implementación real, se verificaría contra una lista de aditivos

        // Validación simple: asegurar que tenga macros razonables
        const totalCalories = meal.calories;
        if (totalCalories < 100 || totalCalories > 1000) {
            // Comida muy pequeña o muy grande para una sola porción
            return false;
        }

        return true;
    }

    getEducationalContent(): EducationalContent {
        return {
            title: 'Nutrición Balanceada para Vida Saludable',
            description:
                'Una dieta balanceada proporciona todos los nutrientes necesarios en las cantidades adecuadas para mantener buena salud, energía y peso óptimo.',
            benefits: [
                'Equilibrio de energía sostenido',
                'Mejor control del peso a largo plazo',
                'Menor riesgo de enfermedades crónicas',
                'Mayor consistencia y adherencia',
                'Flexibilidad para incluir alimentos favoritos',
                'Mejor salud digestiva',
                'Mejora en el rendimiento deportivo',
            ],
            limitations: [
                'Pérdida de peso puede ser más lenta',
                'Requiere moderación en porciones',
                'Menos "dramático" en resultados corto plazo',
                'Necesita variedad de alimentos',
                'Requiere compra y preparación constante',
            ],
            tips: [
                'Usa el plato de la OMS como referencia: 1/2 verduras y frutas, 1/4 proteína, 1/4 granos integrales',
                'Come variedad de colores en frutas y verduras',
                'Elige granos integrales sobre refinados',
                'Selecciona proteínas magras (pollo, pescado, legumbres)',
                'Limita bebidas azucaradas y ultraprocesados',
                'Bebe 8 vasos de agua diarios',
                'Come despacio y mastica bien',
                'Haz ejercicio regularmente (150 min/semana)',
            ],
            resources: [
                'https://www.healthyeating.org/',
                'https://www.nutrition.gov/',
                'Consulta con un nutricionista certificado regularmente',
            ],
        };
    }

    private calculateTDEE(userProfile: UserProfile): number {
        // Fórmula de Mifflin-St Jeor para BMR
        let bmr: number;
        const { age, weight, height } = userProfile;

        bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Hombre promedio

        const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            high: 1.725,
            veryHigh: 1.9,
        };

        return bmr * activityFactors[userProfile.activityLevel];
    }
}
