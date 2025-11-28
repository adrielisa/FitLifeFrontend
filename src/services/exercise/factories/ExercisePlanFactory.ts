/**
 * Factory Method Pattern para Planes de Ejercicio
 * 
 * Patrón GoF: Factory Method
 * Define la interfaz para crear objetos Plan, pero deja que las subclases
 * decidan qué clase concreta instanciar.
 * 
 * Beneficios:
 * - La lógica de creación NO está en el cliente
 * - Fácil agregar nuevos tipos de planes
 * - Centralización de la creación
 */

/**
 * Interface que todos los planes de ejercicio deben implementar
 */
export interface IExercisePlan {
    name: string;
    description: string;
    durationWeeks: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    focusAreas: string[];
    exercises: Exercise[];
    weeklySchedule: WeeklySchedule;
    expectedResults: string;
    equipment: string[];
    caloriesPerSession: number;
}

export interface Exercise {
    id: string;
    name: string;
    reps?: number;
    sets?: number;
    duration?: number; // minutos
    intensity: 'low' | 'medium' | 'high';
    restTime: number; // segundos
    instructions: string[];
    videoUrl?: string;
    equipment: string[];
}

export interface WeeklySchedule {
    mondayExercises: Exercise[];
    tuesdayExercises: Exercise[];
    wednesdayExercises: Exercise[];
    thursdayExercises: Exercise[];
    fridayExercises: Exercise[];
    saturdayExercises: Exercise[];
    sundayExercises: Exercise[];
}

/**
 * Plan para Maratón - Resistencia y cardio
 */
export class MarathonPlan implements IExercisePlan {
    name = 'Plan de Maratón';
    description = 'Programa de 16 semanas para preparar un maratón con énfasis en resistencia, velocidad y prevención de lesiones.';
    durationWeeks = 16;
    difficulty = 'advanced' as const;
    focusAreas = ['Cardio', 'Resistencia', 'Velocidad'];
    caloriesPerSession = 800;
    equipment = ['Zapatillas de running', 'Reloj deportivo', 'Cinta para correr (opcional)'];
    expectedResults = 'Capacidad para completar un maratón (42.195 km) en tiempo competitivo.';

    exercises: Exercise[] = [
        {
            id: 'run-long-distance',
            name: 'Carrera de larga distancia',
            duration: 120,
            intensity: 'medium',
            restTime: 0,
            instructions: [
                'Mantén un ritmo sostenible',
                'Hidratación cada 5km',
                'Aumenta distancia gradualmente',
            ],
            equipment: ['Zapatillas de running'],
        },
        {
            id: 'run-intervals',
            name: 'Entrenamiento de intervalos',
            duration: 45,
            intensity: 'high',
            restTime: 60,
            instructions: [
                'Calentamiento 10 minutos',
                'Intervalos de 2 minutos rápido, 1 minuto lento',
                'Repetir 8 veces',
            ],
            equipment: ['Zapatillas de running'],
        },
        {
            id: 'strength-core',
            name: 'Fortalecimiento de core',
            sets: 3,
            reps: 15,
            intensity: 'medium',
            restTime: 90,
            instructions: [
                'Planchas abdominales',
                'Sentadillas',
                'Estocadas',
                'Superman holds',
            ],
            equipment: [],
        },
    ];

    weeklySchedule: WeeklySchedule = {
        mondayExercises: [],
        tuesdayExercises: [],
        wednesdayExercises: [],
        thursdayExercises: [],
        fridayExercises: [],
        saturdayExercises: [],
        sundayExercises: [],
    };
}

/**
 * Plan para Ganancia Muscular - Hipertrofia
 */
export class MuscleGainPlan implements IExercisePlan {
    name = 'Plan de Ganancia Muscular';
    description = 'Programa de 12 semanas enfocado en hipertrofia muscular con ejercicios de fuerza y volumen.';
    durationWeeks = 12;
    difficulty = 'intermediate' as const;
    focusAreas = ['Hipertrofia', 'Fuerza', 'Volumen'];
    caloriesPerSession = 600;
    equipment = ['Mancuernas', 'Barras', 'Poleas', 'Máquinas de peso'];
    expectedResults = 'Ganancia de 3-5 kg de masa muscular magra con mínimo aumento de grasa.';

    exercises: Exercise[] = [
        {
            id: 'bench-press',
            name: 'Press de banca',
            sets: 4,
            reps: 8,
            intensity: 'high',
            restTime: 120,
            instructions: [
                'Posición supino en banca',
                'Baja controlado',
                'Contrae en la subida',
                'Rango completo de movimiento',
            ],
            equipment: ['Barra', 'Banca'],
        },
        {
            id: 'squat',
            name: 'Sentadillas',
            sets: 4,
            reps: 6,
            intensity: 'high',
            restTime: 120,
            instructions: [
                'Pies ancho de hombros',
                'Desciende hasta 90 grados',
                'Mantén espalda recta',
                'Sube explosivamente',
            ],
            equipment: ['Barra', 'Rack'],
        },
        {
            id: 'deadlift',
            name: 'Peso muerto',
            sets: 3,
            reps: 5,
            intensity: 'high',
            restTime: 180,
            instructions: [
                'Barra en medio del pie',
                'Espalda recta durante todo el movimiento',
                'Caderas y hombros suben al mismo tiempo',
                'Máxima tensión en la cumbre',
            ],
            equipment: ['Barra', 'Placas'],
        },
        {
            id: 'dumbbell-curl',
            name: 'Curl con mancuernas',
            sets: 3,
            reps: 10,
            intensity: 'medium',
            restTime: 90,
            instructions: [
                'Pie firmes, codos pegados al cuerpo',
                'Contracción en la cumbre',
                'Baja lento y controlado',
                'Sin balanceo del cuerpo',
            ],
            equipment: ['Mancuernas'],
        },
    ];

    weeklySchedule: WeeklySchedule = {
        mondayExercises: [],
        tuesdayExercises: [],
        wednesdayExercises: [],
        thursdayExercises: [],
        fridayExercises: [],
        saturdayExercises: [],
        sundayExercises: [],
    };
}

/**
 * Plan de Pérdida de Peso - Cardio + Fuerza
 */
export class WeightLossPlan implements IExercisePlan {
    name = 'Plan de Pérdida de Peso';
    description = 'Programa de 8 semanas que combina cardio y entrenamiento de fuerza para máxima quema de calorías.';
    durationWeeks = 8;
    difficulty = 'beginner' as const;
    focusAreas = ['Cardio', 'Entrenamiento HIIT', 'Metabolismo'];
    caloriesPerSession = 650;
    equipment = ['Mancuernas', 'Cuerda para saltar', 'Colchoneta'];
    expectedResults = 'Pérdida de 4-6 kg de peso con mejora en condición cardiovascular.';

    exercises: Exercise[] = [
        {
            id: 'hiit-cardio',
            name: 'Entrenamiento HIIT',
            duration: 30,
            intensity: 'high',
            restTime: 30,
            instructions: [
                'Burpees: 20 segundos intenso, 10 segundos descanso',
                'Mountain climbers: 20 segundos intenso, 10 segundos descanso',
                'Saltos en tijera: 20 segundos intenso, 10 segundos descanso',
                'Repetir 4 series',
            ],
            equipment: [],
        },
        {
            id: 'jump-rope',
            name: 'Salto a la cuerda',
            duration: 20,
            intensity: 'high',
            restTime: 60,
            instructions: [
                'Mantén ritmo constante',
                'Respira profundamente',
                '3 series de 5 minutos',
            ],
            equipment: ['Cuerda para saltar'],
        },
        {
            id: 'circuit-training',
            name: 'Entrenamiento en circuito',
            sets: 3,
            reps: 12,
            intensity: 'medium',
            restTime: 45,
            instructions: [
                'Push-ups',
                'Sentadillas',
                'Planchas abdominales',
                'Estocadas',
                'Sin descanso entre ejercicios',
            ],
            equipment: ['Colchoneta'],
        },
    ];

    weeklySchedule: WeeklySchedule = {
        mondayExercises: [],
        tuesdayExercises: [],
        wednesdayExercises: [],
        thursdayExercises: [],
        fridayExercises: [],
        saturdayExercises: [],
        sundayExercises: [],
    };
}

/**
 * Interfaz Creator - Define el contrato para las fábricas
 */
export interface IPlanFactory {
    createPlan(): IExercisePlan;
}

/**
 * Concreto Creator para Maratón
 */
export class MarathonPlanFactory implements IPlanFactory {
    createPlan(): IExercisePlan {
        return new MarathonPlan();
    }
}

/**
 * Concreto Creator para Ganancia Muscular
 */
export class MuscleGainPlanFactory implements IPlanFactory {
    createPlan(): IExercisePlan {
        return new MuscleGainPlan();
    }
}

/**
 * Concreto Creator para Pérdida de Peso
 */
export class WeightLossPlanFactory implements IPlanFactory {
    createPlan(): IExercisePlan {
        return new WeightLossPlan();
    }
}

/**
 * ExercisePlanManager - Gestiona todas las fábricas y simplifica la creación
 */
export enum PlanType {
    MARATHON = 'marathon',
    MUSCLE_GAIN = 'muscle_gain',
    WEIGHT_LOSS = 'weight_loss',
}

export class ExercisePlanManager {
    private factories: Map<PlanType, IPlanFactory>;

    constructor() {
        this.factories = new Map();
        this.registerDefaultFactories();
    }

    /**
     * Registra las factories por defecto
     */
    private registerDefaultFactories(): void {
        this.factories.set(PlanType.MARATHON, new MarathonPlanFactory());
        this.factories.set(PlanType.MUSCLE_GAIN, new MuscleGainPlanFactory());
        this.factories.set(PlanType.WEIGHT_LOSS, new WeightLossPlanFactory());
    }

    /**
     * Registra una factory personalizada
     */
    registerFactory(type: string, factory: IPlanFactory): void {
        this.factories.set(type as PlanType, factory);
    }

    /**
     * Crea un plan usando la factory correspondiente
     */
    createPlan(type: PlanType): IExercisePlan {
        const factory = this.factories.get(type);

        if (!factory) {
            throw new Error(`Factory no encontrada para tipo: ${type}`);
        }

        return factory.createPlan();
    }

    /**
     * Lista todos los tipos de planes disponibles
     */
    listAvailablePlans(): Array<{ type: PlanType; name: string; description: string }> {
        const plans: Array<{ type: PlanType; name: string; description: string }> = [];

        this.factories.forEach((factory, type) => {
            const plan = factory.createPlan();
            plans.push({
                type,
                name: plan.name,
                description: plan.description,
            });
        });

        return plans;
    }
}
