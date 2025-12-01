import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { Exercise } from './exerciseService';

/**
 * Tipos para planes de ejercicio
 */
export interface ExercisePlan {
    plan_id: string;
    user_id: string;
    plan_name: string;
    description?: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    duration_weeks: number;
    created_at: string;
    is_active: boolean;
    exercise_ids?: string[];  // IDs de ejercicios del plan
}

export interface CreatePlanRequest {
    user_id: string;
    plan_name: string;
    description?: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    duration_weeks: number;
    exercise_ids?: string[];  // IDs de ejercicios a incluir en el plan
}

export interface PlanExercise {
    plan_exercise_id: string;
    plan_id: string;
    exercise_id: string;
    order_in_plan: number;
    sets?: number;
    reps?: number;
    duration_minutes?: number;
    rest_seconds?: number;
    notes?: string;
    exercise?: Exercise;
}

export interface CreatePlanExerciseRequest {
    plan_id: string;
    exercise_id: string;
    order_in_plan: number;
    sets?: number;
    reps?: number;
    duration_minutes?: number;
    rest_seconds?: number;
    notes?: string;
}

/**
 * Servicio para manejar planes de ejercicio
 */
class ExercisePlanService {
    /**
     * Obtener planes del usuario
     */
    async getUserPlans(userId: string): Promise<ExercisePlan[]> {
        const response = await apiClient.get<{ plans: ExercisePlan[] }>(
            ENDPOINTS.EXERCISE_PLANS.BY_USER(userId)
        );
        return response.data.plans;
    }

    /**
     * Obtener plan activo del usuario
     */
    async getActivePlan(userId: string): Promise<ExercisePlan | null> {
        try {
            const response = await apiClient.get<{ plan: ExercisePlan }>(
                ENDPOINTS.EXERCISE_PLANS.ACTIVE(userId)
            );
            return response.data.plan;
        } catch (error) {
            return null;
        }
    }

    /**
     * Crear un nuevo plan
     */
    async createPlan(data: CreatePlanRequest): Promise<ExercisePlan> {
        const response = await apiClient.post<{ plan: ExercisePlan }>(
            ENDPOINTS.EXERCISE_PLANS.CREATE,
            data
        );
        return response.data.plan;
    }

    /**
     * Establecer plan como activo
     * @param userId - ID del usuario dueño del plan
     * @param planId - ID del plan a activar
     */
    async activatePlan(userId: string, planId: string): Promise<void> {
        const endpoint = ENDPOINTS.EXERCISE_PLANS.ACTIVATE(userId, planId);
        console.log('🔗 Endpoint de activación:', endpoint);
        console.log('📤 Enviando PUT a:', endpoint);
        console.log('👤 UserID:', userId);
        console.log('📋 PlanID:', planId);
        
        const response = await apiClient.put(endpoint);
        
        console.log('📥 Respuesta de activación:', response.data);
        return;
    }

    /**
     * Obtener todos los ejercicios de un plan
     * Los ejercicios vienen en el plan como exercise_ids
     */
    async getPlanExercises(planId: string): Promise<Exercise[]> {
        console.log('📋 Obteniendo plan con ejercicios:', planId);
        
        // 1. Obtener el plan que incluye exercise_ids
        const planResponse = await apiClient.get<{ plan: ExercisePlan }>(
            ENDPOINTS.EXERCISE_PLANS.BY_ID(planId)
        );
        
        const plan = planResponse.data.plan;
        console.log('📋 Plan obtenido:', plan);
        console.log('🔢 Exercise IDs:', plan.exercise_ids);
        
        // 2. Si no hay exercise_ids, retornar array vacío
        if (!plan.exercise_ids || plan.exercise_ids.length === 0) {
            console.log('⚠️ Plan sin ejercicios');
            return [];
        }
        
        // 3. Obtener detalles de cada ejercicio
        console.log(`📥 Obteniendo detalles de ${plan.exercise_ids.length} ejercicios...`);
        const exercisePromises = plan.exercise_ids.map((exerciseId: string) => 
            apiClient.get<{ exercise: Exercise }>(
                ENDPOINTS.EXERCISES.BY_ID(exerciseId)
            )
        );
        
        const exerciseResponses = await Promise.all(exercisePromises);
        const exercises = exerciseResponses.map((response: any) => response.data.exercise);
        
        console.log('✅ Ejercicios obtenidos:', exercises);
        return exercises;
    }

    /**
     * Obtener todos los ejercicios disponibles
     */
    async getAllExercises(): Promise<Exercise[]> {
        const response = await apiClient.get<{ exercises: Exercise[] }>(
            ENDPOINTS.EXERCISES.LIST
        );
        return response.data.exercises;
    }

    /**
     * Obtener ejercicios por grupo muscular
     */
    async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
        const response = await apiClient.get<{ exercises: Exercise[] }>(
            ENDPOINTS.EXERCISES.BY_MUSCLE_GROUP(muscleGroup)
        );
        return response.data.exercises;
    }

    /**
     * Crear un nuevo ejercicio
     */
    async createExercise(data: {
        name: string;
        description?: string;
        muscle_group: string;
        difficulty_level: 'principiante' | 'intermedio' | 'avanzado';
        equipment_needed?: string;
        calories_per_minute: number;
    }): Promise<Exercise> {
        const response = await apiClient.post<{ exercise: Exercise }>(
            ENDPOINTS.EXERCISES.CREATE,
            data
        );
        return response.data.exercise;
    }

    /**
     * Crear múltiples ejercicios
     */
    async createMultipleExercises(exercises: Array<{
        name: string;
        description?: string;
        muscle_group: string;
        difficulty_level: 'principiante' | 'intermedio' | 'avanzado';
        equipment_needed?: string;
        calories_per_minute: number;
    }>): Promise<Exercise[]> {
        const createdExercises: Exercise[] = [];
        
        for (const exercise of exercises) {
            try {
                const created = await this.createExercise(exercise);
                createdExercises.push(created);
            } catch (error) {
                console.error(`Error creating exercise ${exercise.name}:`, error);
            }
        }
        
        return createdExercises;
    }
}

export default new ExercisePlanService();
