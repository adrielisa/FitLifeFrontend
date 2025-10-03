import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';

/**
 * Tipos para ejercicios
 */
export interface Exercise {
    exercise_id?: string;
    name: string;
    description?: string;
    muscle_group: string;
    difficulty_level: 'principiante' | 'intermedio' | 'avanzado';
    equipment_needed?: string;
    calories_per_minute: number;
}

export interface CreateExerciseData {
    name: string;
    description?: string;
    muscle_group: string;
    difficulty_level: 'principiante' | 'intermedio' | 'avanzado';
    equipment_needed?: string;
    calories_per_minute: number;
}

export interface UpdateExerciseData {
    name?: string;
    description?: string;
    muscle_group?: string;
    difficulty_level?: 'principiante' | 'intermedio' | 'avanzado';
    equipment_needed?: string;
    calories_per_minute?: number;
}

/**
 * Servicio para manejar ejercicios
 */
class ExerciseService {
    /**
     * Obtener todos los ejercicios
     */
    async getAll(): Promise<Exercise[]> {
        const response = await apiClient.get<{ exercises: Exercise[]; count: number }>(
            ENDPOINTS.EXERCISES.LIST
        );
        return response.data.exercises;
    }

    /**
     * Obtener ejercicio por ID
     */
    async getById(exercise_id: string): Promise<Exercise> {
        const response = await apiClient.get<{ exercise: Exercise }>(
            ENDPOINTS.EXERCISES.BY_ID(exercise_id)
        );
        return response.data.exercise;
    }

    /**
     * Filtrar ejercicios por grupo muscular
     */
    async getByMuscleGroup(muscle_group: string): Promise<Exercise[]> {
        const response = await apiClient.get<{ exercises: Exercise[]; count: number; muscle_group: string }>(
            ENDPOINTS.EXERCISES.BY_MUSCLE_GROUP(muscle_group)
        );
        return response.data.exercises;
    }

    /**
     * Filtrar ejercicios por dificultad
     */
    async getByDifficulty(difficulty: 'principiante' | 'intermedio' | 'avanzado'): Promise<Exercise[]> {
        const response = await apiClient.get<{ exercises: Exercise[]; count: number; difficulty_level: string }>(
            ENDPOINTS.EXERCISES.BY_DIFFICULTY(difficulty)
        );
        return response.data.exercises;
    }

    /**
     * Crear nuevo ejercicio (requiere autenticación)
     */
    async create(exerciseData: CreateExerciseData): Promise<Exercise> {
        const response = await apiClient.post<{ exercise: Exercise }>(
            ENDPOINTS.EXERCISES.CREATE,
            exerciseData
        );
        return response.data.exercise;
    }

    /**
     * Actualizar ejercicio (requiere autenticación)
     */
    async update(exercise_id: string, updateData: UpdateExerciseData): Promise<Exercise> {
        const response = await apiClient.put<{ exercise: Exercise }>(
            ENDPOINTS.EXERCISES.UPDATE(exercise_id),
            updateData
        );
        return response.data.exercise;
    }

    /**
     * Eliminar ejercicio (requiere autenticación)
     */
    async delete(exercise_id: string): Promise<void> {
        await apiClient.delete(ENDPOINTS.EXERCISES.DELETE(exercise_id));
    }

    /**
     * Crear múltiples ejercicios de forma robusta
     */
    async createMultiple(exercises: CreateExerciseData[]): Promise<{ created: Exercise[]; errors: string[] }> {
        const created: Exercise[] = [];
        const errors: string[] = [];

        for (const exercise of exercises) {
            try {
                const result = await this.create(exercise);
                created.push(result);
            } catch (error: any) {
                const errorMsg = error.response?.data?.error || `Error creating ${exercise.name}`;
                errors.push(errorMsg);
                console.error(`Error creating exercise ${exercise.name}:`, error);
            }
        }

        return { created, errors };
    }
}

export default new ExerciseService();
