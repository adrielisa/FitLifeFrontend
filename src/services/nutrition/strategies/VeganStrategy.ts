import type {
    INutritionStrategy,
    NutrientRecommendation,
    UserProfile,
    MealSuggestion,
    Meal,
    EducationalContent,
} from './INutritionStrategy';

export class VeganStrategy implements INutritionStrategy {
    getName(): string {
        return 'Vegana';
    }

    getDescription(): string {
        return 'Dieta basada exclusivamente en plantas que excluye todos los productos de origen animal, promoviendo salud y sostenibilidad.';
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

        // Macros Vegana: 50% carbs, 20% proteínas, 30% grasas
        const carbohydrates = (dailyCalories * 0.5) / 4;   // 4 cal/g
        const proteins = (dailyCalories * 0.2) / 4;        // 4 cal/g
        const fats = (dailyCalories * 0.3) / 9;            // 9 cal/g

        return {
            macronutrients: {
                proteins: Math.round(proteins),
                carbohydrates: Math.round(carbohydrates),
                fats: Math.round(fats),
            },
            micronutrients: {
                vitaminC: 150,      // Mayor necesidad en dieta vegana
                vitaminD: 2000,     // Suplementación usual
                calcium: 1200,      // Importante sin lácteos
                iron: 32,           // Mayor necesidad, hierro no-hemo
            },
            dailyCalories: Math.round(dailyCalories),
            mealTiming: [
                {
                    name: 'Desayuno',
                    time: '08:00',
                    caloriesPercentage: 0.25,
                    suggestedFoods: ['Avena', 'Plátano', 'Semillas de chía', 'Leche de almendra'],
                },
                {
                    name: 'Almuerzo',
                    time: '13:00',
                    caloriesPercentage: 0.4,
                    suggestedFoods: ['Legumbres', 'Quinoa', 'Verduras', 'Tofu o tempeh'],
                },
                {
                    name: 'Merienda',
                    time: '16:00',
                    caloriesPercentage: 0.15,
                    suggestedFoods: ['Frutos secos', 'Frutas', 'Barras veganas'],
                },
                {
                    name: 'Cena',
                    time: '19:00',
                    caloriesPercentage: 0.2,
                    suggestedFoods: ['Sopa de legumbres', 'Verduras asadas', 'Humus'],
                },
            ],
            restrictions: [
                'Carne',
                'Aves',
                'Pescado',
                'Lácteos',
                'Huevos',
                'Miel',
                'Productos con gelatina',
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
                name: 'Bowl de Quinoa y Verduras',
                calories: 420,
                description: 'Proteína completa con verduras coloridas y aceite de oliva',
                ingredients: ['Quinoa', 'Brócoli', 'Zanahorias', 'Tomate', 'Aceite de oliva'],
                preparationTime: 20,
                difficulty: 'easy',
            },
            {
                name: 'Pasta de Garbanzo con Salsa de Tomate',
                calories: 380,
                description: 'Alto en proteína vegetal y fibra, delicioso y satisfactorio',
                ingredients: ['Pasta', 'Garbanzos', 'Tomates', 'Ajo', 'Albahaca'],
                preparationTime: 25,
                difficulty: 'easy',
            },
            {
                name: 'Curry de Lentejas Rojas',
                calories: 450,
                description: 'Rico en hierro no-hemo, especias que favorecen absorción',
                ingredients: ['Lentejas rojas', 'Coco', 'Curry', 'Verduras mixtas'],
                preparationTime: 30,
                difficulty: 'medium',
            },
            {
                name: 'Sándwich de Tofu Marinado',
                calories: 320,
                description: 'Proteína vegetal con verduras frescas y aguacate',
                ingredients: ['Tofu', 'Pan integral', 'Aguacate', 'Lechuga', 'Tomate'],
                preparationTime: 15,
                difficulty: 'easy',
            },
            {
                name: 'Tacos de Frijoles Negros',
                calories: 400,
                description: 'Combinación de proteína y carbohidratos complejos',
                ingredients: ['Frijoles negros', 'Tortillas', 'Cebolla', 'Cilantro', 'Limón'],
                preparationTime: 20,
                difficulty: 'easy',
            },
        ];

        return suggestions.filter(meal => meal.calories <= calories * 1.2);
    }

    isCompatibleMeal(meal: Meal): boolean {
        // Verificar que no contenga productos de origen animal
        const animalIngredients = [
            'carne',
            'pollo',
            'pescado',
            'huevo',
            'leche',
            'queso',
            'mantequilla',
            'miel',
            'gelatina',
        ];

        const hasAnimalIngredients = meal.ingredients.some(ingredient =>
            animalIngredients.some(animal =>
                ingredient.toLowerCase().includes(animal.toLowerCase())
            )
        );

        return !hasAnimalIngredients;
    }

    getEducationalContent(): EducationalContent {
        return {
            title: 'Nutrición Vegana Completa',
            description:
                'Una dieta vegana bien planificada puede ser nutritivamente adecuada para todas las etapas de la vida, incluyendo embarazo, lactancia y en niños.',
            benefits: [
                'Beneficios para la salud cardiovascular',
                'Menor riesgo de diabetes tipo 2',
                'Generalmente menor en calorías y grasas saturadas',
                'Mayor consumo de fibra y antioxidantes',
                'Impacto ambiental reducido',
                'Alineación con valores éticos',
            ],
            limitations: [
                'Requiere planificación para obtener proteínas completas',
                'Posible déficit de B12 (requiere suplementación)',
                'Absorción de hierro y calcio menos eficiente',
                'Puede ser limitante socialmente',
                'Requiere conocimiento nutricional para hacerlo bien',
                'Productos veganos procesados pueden ser ultraprocesados',
            ],
            tips: [
                'Combina proteínas incompletas (granos + legumbres) para proteína completa',
                'Suplementa obligatoriamente con B12',
                'Combina alimentos ricos en vitamina C con alimentos ricos en hierro para mayor absorción',
                'Come variedad de colores para asegurar diferentes nutrientes',
                'Considera suplementar omega-3 (algas) o usa semillas de lino/chía',
                'Consulta regularmente con nutricionista especializado en veganos',
            ],
            resources: [
                'https://www.theveganmealkit.com/post-workout',
                'https://nutriciondelvegano.com/',
                'Academia de Nutrición y Dietética: Position on Vegetarian Diets',
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
