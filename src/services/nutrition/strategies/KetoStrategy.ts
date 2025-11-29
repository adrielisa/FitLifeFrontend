import type {
    INutritionStrategy,
    NutrientRecommendation,
    UserProfile,
    MealSuggestion,
    Meal,
    EducationalContent,
} from './INutritionStrategy';

export class KetoStrategy implements INutritionStrategy {
    private readonly carbohydrateLimit = 50; // gramos por día

    getName(): string {
        return 'Cetogénica (Keto)';
    }

    getDescription(): string {
        return 'Dieta alta en grasas y proteínas, muy baja en carbohidratos para inducir cetosis y maximizar la quema de grasa.';
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

        // Macros Keto: 70% grasas, 25% proteínas, 5% carbohidratos
        const proteins = (dailyCalories * 0.25) / 4;        // 4 cal/g
        const fats = (dailyCalories * 0.70) / 9;            // 9 cal/g
        const carbohydrates = Math.min(
            (dailyCalories * 0.05) / 4,                      // 5% máximo
            this.carbohydrateLimit                            // Límite absoluto
        );

        return {
            macronutrients: {
                proteins: Math.round(proteins),
                carbohydrates: Math.round(carbohydrates),
                fats: Math.round(fats),
            },
            micronutrients: {
                vitaminC: 100,
                vitaminD: 4000,
                calcium: 1000,
                iron: 18,
            },
            dailyCalories: Math.round(dailyCalories),
            mealTiming: [
                {
                    name: 'Desayuno',
                    time: '08:00',
                    caloriesPercentage: 0.3,
                    suggestedFoods: ['Huevos', 'Aguacate', 'Bacon', 'Queso'],
                },
                {
                    name: 'Almuerzo',
                    time: '13:00',
                    caloriesPercentage: 0.4,
                    suggestedFoods: ['Carne roja', 'Pescado', 'Verduras bajas en carbs'],
                },
                {
                    name: 'Cena',
                    time: '19:00',
                    caloriesPercentage: 0.3,
                    suggestedFoods: ['Pollo', 'Salmón', 'Ensalada con aceite de oliva'],
                },
            ],
            restrictions: [
                'Pan',
                'Pasta',
                'Arroz',
                'Azúcar',
                'Frutas azucaradas',
                'Bebidas azucaradas',
                'Lácteos con alto contenido de lactosa',
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
        const suggestions: MealSuggestion[] = [
            {
                name: 'Omelette de Queso y Jamón',
                calories: 450,
                description: 'Omelette rica en proteínas y grasas, perfecta para mantener cetosis',
                ingredients: ['Huevos', 'Queso', 'Jamón', 'Mantequilla'],
                preparationTime: 10,
                difficulty: 'easy',
            },
            {
                name: 'Filete de Salmón con Aguacate',
                calories: 550,
                description: 'Alta en Omega-3 y grasas saludables, bajo en carbohidratos',
                ingredients: ['Salmón', 'Aguacate', 'Limón', 'Aceite de oliva'],
                preparationTime: 20,
                difficulty: 'easy',
            },
            {
                name: 'Ensalada Cesar Keto',
                calories: 380,
                description: 'Ensalada completa sin croutons, alta en grasas saludables',
                ingredients: ['Lechuga romana', 'Pollo', 'Queso parmesano', 'Salsa César'],
                preparationTime: 15,
                difficulty: 'easy',
            },
            {
                name: 'Carne Molida con Verduras Bajas en Carbs',
                calories: 520,
                description: 'Comida completa y satisfactoria, con verduras permitidas',
                ingredients: ['Carne molida', 'Calabacín', 'Champiñones', 'Cebolla'],
                preparationTime: 25,
                difficulty: 'easy',
            },
        ];

        // Filtrar por calorías disponibles
        return suggestions.filter(meal => meal.calories <= calories * 1.2);
    }

    isCompatibleMeal(meal: Meal): boolean {
        // Una comida es compatible si:
        // 1. Los carbohidratos no exceden el 10% de las calorías
        // 2. No contiene ingredientes restringidos

        const carbCalories = meal.carbohydrates * 4;
        const totalCalories = meal.calories;
        const carbPercentage = (carbCalories / totalCalories) * 100;

        if (carbPercentage > 10) {
            return false;
        }

        // Verificar ingredientes restringidos
        const restrictedIngredients = this.getRestrictions();
        const hasRestricted = meal.ingredients.some(ingredient =>
            restrictedIngredients.some(restricted =>
                ingredient.toLowerCase().includes(restricted.toLowerCase())
            )
        );

        return !hasRestricted;
    }

    getEducationalContent(): EducationalContent {
        return {
            title: 'Guía Completa de la Dieta Cetogénica',
            description:
                'La dieta cetogénica es un enfoque nutricional bajo en carbohidratos que cambia el metabolismo para quemar grasa como combustible principal.',
            benefits: [
                'Pérdida de peso acelerada',
                'Mayor saciedad y control del apetito',
                'Aumento de energía y claridad mental',
                'Mejor control del azúcar en sangre',
                'Reducción de inflamación',
                'Potencial para mejorar marcadores de salud cardiovascular',
            ],
            limitations: [
                'Requiere adaptación inicial (2-3 semanas)',
                'Posible "gripe keto" con síntomas de fatiga',
                'Déficit potencial de fibra y micronutrientes',
                'Efectos a largo plazo no completamente estudiados',
                'Puede no ser adecuada durante embarazo o ciertas condiciones médicas',
                'Restricciones sociales al comer fuera',
            ],
            tips: [
                'Mantén un déficit calórico moderado (300-500 cal) para perder peso',
                'Asegúrate de consumir electrolitos (sodio, potasio, magnesio)',
                'Incrementa la ingesta de fibra con verduras bajas en carbs',
                'Monitorea tu nivel de cetonas si es posible',
                'Sé consistente: la cetosis requiere mantener carbs bajos constantemente',
                'Consulta con un profesional de salud antes de comenzar',
            ],
            resources: [
                'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6235409/',
                'https://www.dietaryguidelines.gov/',
                'Busca nutricionistas especializados en dietas cetogénicas',
            ],
        };
    }

    private calculateTDEE(userProfile: UserProfile): number {
        // Fórmula de Mifflin-St Jeor para BMR
        let bmr: number;
        const { age, weight, height } = userProfile;

        // Asumir 50% hombres, 50% mujeres en promedio para simplicidad
        // En producción, sería mejor preguntarlo al usuario
        bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Hombre promedio

        // Multiplicar por factor de actividad
        const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            high: 1.725,
            veryHigh: 1.9,
        };

        return bmr * activityFactors[userProfile.activityLevel];
    }

    private getRestrictions(): string[] {
        return [
            'Pan',
            'Pasta',
            'Arroz',
            'Azúcar',
            'Frutas',
            'Cereales',
            'Bebidas azucaradas',
        ];
    }
}
