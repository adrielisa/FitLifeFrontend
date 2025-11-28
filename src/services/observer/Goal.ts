/**
 * Clase Goal - Observable
 * 
 * Representa un objetivo del usuario
 * Notifica a observadores cuando el objetivo cambia de estado
 */

import { Observable } from './Observable';
import { EventType } from './IObserver';

export enum GoalStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    ACHIEVED = 'achieved',
    FAILED = 'failed',
}

export enum GoalType {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    ENDURANCE = 'endurance',
    STRENGTH = 'strength',
    FLEXIBILITY = 'flexibility',
    CALORIE_BALANCE = 'calorie_balance',
}

export interface GoalData {
    id: string;
    userId: string;
    name: string;
    type: GoalType;
    targetValue: number;
    currentValue: number;
    unit: string; // kg, reps, minutes, etc.
    deadline: Date;
    status: GoalStatus;
    createdAt: Date;
    updatedAt: Date;
    description?: string;
}

export class Goal extends Observable {
    private data: GoalData;

    constructor(data: GoalData) {
        super();
        this.data = { ...data };
    }

    /**
     * Obtiene el progreso del objetivo (0-100)
     */
    getProgress(): number {
        if (this.data.targetValue === 0) return 0;
        return Math.min((this.data.currentValue / this.data.targetValue) * 100, 100);
    }

    /**
     * Actualiza el valor actual del objetivo
     */
    updateProgress(newValue: number): void {
        const oldValue = this.data.currentValue;
        this.data.currentValue = newValue;
        this.data.updatedAt = new Date();

        // Notificar actualización de progreso
        this.notifyObservers({
            type: EventType.GOAL_PROGRESS_UPDATE,
            timestamp: this.data.updatedAt,
            source: `Goal-${this.data.id}`,
            data: {
                goalId: this.data.id,
                goalName: this.data.name,
                progress: this.getProgress(),
                oldValue,
                newValue,
                unit: this.data.unit,
            },
        });

        // Verificar si se alcanzó el objetivo
        if (newValue >= this.data.targetValue && this.data.status !== GoalStatus.ACHIEVED) {
            this.markAsAchieved();
        }
    }

    /**
     * Marca el objetivo como alcanzado
     */
    markAsAchieved(): void {
        if (this.data.status === GoalStatus.ACHIEVED) return;

        this.data.status = GoalStatus.ACHIEVED;
        this.data.updatedAt = new Date();

        this.notifyObservers({
            type: EventType.GOAL_ACHIEVED,
            timestamp: this.data.updatedAt,
            source: `Goal-${this.data.id}`,
            data: {
                goalId: this.data.id,
                goalName: this.data.name,
                goalType: this.data.type,
                targetValue: this.data.targetValue,
                achievedValue: this.data.currentValue,
                unit: this.data.unit,
            },
        });
    }

    /**
     * Marca el objetivo como fallido
     */
    markAsFailed(): void {
        if (this.data.status === GoalStatus.FAILED) return;

        this.data.status = GoalStatus.FAILED;
        this.data.updatedAt = new Date();

        this.notifyObservers({
            type: EventType.GOAL_FAILED,
            timestamp: this.data.updatedAt,
            source: `Goal-${this.data.id}`,
            data: {
                goalId: this.data.id,
                goalName: this.data.name,
                goalType: this.data.type,
                targetValue: this.data.targetValue,
                achievedValue: this.data.currentValue,
                unit: this.data.unit,
            },
        });
    }

    /**
     * Obtiene los datos del objetivo
     */
    getData(): GoalData {
        return { ...this.data };
    }

    /**
     * Verifica si el objetivo está vencido
     */
    isExpired(): boolean {
        return new Date() > this.data.deadline && this.data.status === GoalStatus.IN_PROGRESS;
    }

    /**
     * Obtiene días restantes hasta la fecha límite
     */
    getDaysRemaining(): number {
        const now = new Date();
        const deadline = new Date(this.data.deadline);
        const diffTime = deadline.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}
