/**
 * CQRS: Commands (Escritura)
 * 
 * Los comandos representan acciones que modifican el estado de la aplicación
 * Patrón: Command Pattern de GoF + CQRS
 * 
 * Responsabilidades:
 * - Encapsular una acción específica
 * - Pasar por validaciones y reglas de negocio
 * - Persistir cambios a través de DAOs
 * - Emitir eventos de dominio
 */

export interface ICommand {
    /**
     * Ejecuta el comando
     * @returns Promise con el resultado o ID del recurso creado/modificado
     */
    execute(): Promise<any>;

    /**
     * Valida el comando antes de ejecutar
     * @throws Error si la validación falla
     */
    validate(): void;
}

/**
 * ==================== WORKOUT COMMANDS ====================
 */

export class RegisterWorkoutCommand implements ICommand {
    constructor(
        private userId: string,
        private planId: string,
        private planName: string,
        private exercises: Array<{
            name: string;
            sets: number;
            reps: number;
            weight?: number;
            duration?: number;
        }>,
        private caloriesBurned: number,
        private duration: number,
        private workoutRepository: any // IWorkoutRepository (DAO)
    ) {}

    validate(): void {
        if (!this.userId || this.userId.trim().length === 0) {
            throw new Error('userId es requerido');
        }

        if (!this.planId || this.planId.trim().length === 0) {
            throw new Error('planId es requerido');
        }

        if (this.exercises.length === 0) {
            throw new Error('Se debe registrar al menos un ejercicio');
        }

        if (this.duration <= 0) {
            throw new Error('La duración debe ser mayor a 0 minutos');
        }

        if (this.caloriesBurned < 0) {
            throw new Error('Las calorías no pueden ser negativas');
        }
    }

    async execute(): Promise<string> {
        this.validate();

        // Crear el objeto de sesión de entrenamiento
        const workoutSession = {
            userId: this.userId,
            planId: this.planId,
            planName: this.planName,
            startTime: new Date(Date.now() - this.duration * 60000),
            endTime: new Date(),
            duration: this.duration,
            caloriesBurned: this.caloriesBurned,
            exercisesCompleted: this.exercises.length,
            exercisesTotal: this.exercises.length,
        };

        // Persistir a través del DAO
        const workoutId = await this.workoutRepository.saveWorkoutSession(workoutSession);

        // Registrar cada ejercicio
        for (const exercise of this.exercises) {
            await this.workoutRepository.saveExerciseLog({
                sessionId: workoutId,
                ...exercise,
                completed: true,
            });
        }

        // En una implementación real, aquí se emitirían eventos de dominio
        console.log(`[Command] Entrenamiento registrado: ${workoutId}`);

        return workoutId;
    }
}

/**
 * ==================== NUTRITION COMMANDS ====================
 */

export class RegisterMealCommand implements ICommand {
    constructor(
        private userId: string,
        private date: Date,
        private mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
        private foodName: string,
        private quantity: number,
        private unit: string,
        private calories: number,
        private macros: { proteins: number; carbohydrates: number; fats: number },
        private mealRepository: any // IMealRepository (DAO)
    ) {}

    validate(): void {
        if (!this.userId) throw new Error('userId es requerido');
        if (!this.foodName || this.foodName.trim().length === 0) {
            throw new Error('El nombre del alimento es requerido');
        }
        if (this.quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');
        if (this.calories < 0) throw new Error('Las calorías no pueden ser negativas');
        if (this.macros.proteins < 0 || this.macros.carbohydrates < 0 || this.macros.fats < 0) {
            throw new Error('Los macronutrientes no pueden ser negativos');
        }
    }

    async execute(): Promise<string> {
        this.validate();

        const mealLog = {
            userId: this.userId,
            date: this.date,
            mealType: this.mealType,
            foodName: this.foodName,
            quantity: this.quantity,
            unit: this.unit,
            calories: this.calories,
            macros: this.macros,
        };

        const mealId = await this.mealRepository.saveMealLog(mealLog);

        // Emitir evento de comida registrada
        console.log(`[Command] Comida registrada: ${mealId}`);

        return mealId;
    }
}

/**
 * ==================== GOAL COMMANDS ====================
 */

export class CreateGoalCommand implements ICommand {
    constructor(
        private userId: string,
        private name: string,
        private type: string,
        private targetValue: number,
        private unit: string,
        private deadline: Date,
        private description?: string,
        private goalRepository?: any // IGoalRepository (DAO)
    ) {}

    validate(): void {
        if (!this.userId) throw new Error('userId es requerido');
        if (!this.name || this.name.trim().length === 0) {
            throw new Error('El nombre del objetivo es requerido');
        }
        if (this.targetValue <= 0) throw new Error('El valor objetivo debe ser positivo');
        if (this.deadline <= new Date()) {
            throw new Error('La fecha límite debe ser en el futuro');
        }
    }

    async execute(): Promise<string> {
        this.validate();

        const goal = {
            userId: this.userId,
            name: this.name,
            type: this.type,
            targetValue: this.targetValue,
            currentValue: 0,
            unit: this.unit,
            deadline: this.deadline,
            status: 'pending',
            description: this.description,
            createdAt: new Date(),
        };

        const goalId = await this.goalRepository?.saveGoal(goal);

        console.log(`[Command] Objetivo creado: ${goalId}`);

        return goalId;
    }
}

export class UpdateGoalProgressCommand implements ICommand {
    constructor(
        private goalId: string,
        private newValue: number,
        private goalRepository?: any
    ) {}

    validate(): void {
        if (!this.goalId) throw new Error('goalId es requerido');
        if (this.newValue < 0) throw new Error('El valor no puede ser negativo');
    }

    async execute(): Promise<void> {
        this.validate();

        await this.goalRepository?.updateGoalProgress(this.goalId, this.newValue);

        console.log(`[Command] Progreso del objetivo actualizado: ${this.goalId}`);
    }
}

/**
 * ==================== USER COMMANDS ====================
 */

export class UpdateUserHealthMetricsCommand implements ICommand {
    constructor(
        private userId: string,
        private metrics: {
            weight?: number;
            height?: number;
            age?: number;
            activityLevel?: string;
            fitnessGoal?: string;
        },
        private userRepository?: any // IUserRepository (DAO)
    ) {}

    validate(): void {
        if (!this.userId) throw new Error('userId es requerido');

        if (this.metrics.weight && this.metrics.weight <= 0) {
            throw new Error('El peso debe ser mayor a 0');
        }
        if (this.metrics.height && this.metrics.height <= 0) {
            throw new Error('La altura debe ser mayor a 0');
        }
        if (this.metrics.age && this.metrics.age < 0) {
            throw new Error('La edad no puede ser negativa');
        }
    }

    async execute(): Promise<void> {
        this.validate();

        await this.userRepository?.updateHealthMetrics(this.userId, this.metrics);

        console.log(`[Command] Métricas de salud actualizadas para usuario: ${this.userId}`);
    }
}

/**
 * ==================== COMMAND BUS ====================
 */

export class CommandBus {
    private handlers: Map<string, (command: ICommand) => Promise<any>> = new Map();

    /**
     * Registra un handler para un tipo de comando
     */
    registerHandler(commandType: string, handler: (command: ICommand) => Promise<any>): void {
        this.handlers.set(commandType, handler);
    }

    /**
     * Ejecuta un comando a través del bus
     */
    async execute(command: ICommand): Promise<any> {
        const commandName = command.constructor.name;
        const handler = this.handlers.get(commandName);

        if (!handler) {
            console.warn(`No hay handler registrado para: ${commandName}`);
        }

        // Validar y ejecutar
        try {
            const result = await command.execute();
            console.log(`[CommandBus] Comando ejecutado: ${commandName}`);
            return result;
        } catch (error) {
            console.error(`[CommandBus] Error ejecutando comando: ${error}`);
            throw error;
        }
    }
}
