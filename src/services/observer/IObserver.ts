/**
 * Patrón Observer para Sistema de Notificaciones y Alertas
 * 
 * Define los contratos para observadores que reaccionan a eventos
 * en objetivos (Goals) y logros (Achievements)
 */

export interface IObserver {
    /**
     * Método llamado cuando un evento es notificado
     * @param event Evento que ocurrió
     */
    update(event: ObservableEvent): void;
}

export interface IObservable {
    /**
     * Registra un observador
     */
    attach(observer: IObserver): void;

    /**
     * Desregistra un observador
     */
    detach(observer: IObserver): void;

    /**
     * Notifica a todos los observadores registrados
     */
    notifyObservers(event: ObservableEvent): void;
}

export interface ObservableEvent {
    type: EventType;
    timestamp: Date;
    source: string; // Quién emitió el evento
    data: Record<string, any>;
}

export enum EventType {
    // Goal Events
    GOAL_CREATED = 'GOAL_CREATED',
    GOAL_UPDATED = 'GOAL_UPDATED',
    GOAL_ACHIEVED = 'GOAL_ACHIEVED',
    GOAL_FAILED = 'GOAL_FAILED',
    GOAL_PROGRESS_UPDATE = 'GOAL_PROGRESS_UPDATE',

    // Achievement Events
    ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
    ACHIEVEMENT_MILESTONE = 'ACHIEVEMENT_MILESTONE',

    // Workout Events
    WORKOUT_COMPLETED = 'WORKOUT_COMPLETED',
    WORKOUT_STARTED = 'WORKOUT_STARTED',

    // Nutrition Events
    MEAL_LOGGED = 'MEAL_LOGGED',
    CALORIE_TARGET_REACHED = 'CALORIE_TARGET_REACHED',
    CALORIE_EXCEEDED = 'CALORIE_EXCEEDED',

    // User Events
    STATS_UPDATED = 'STATS_UPDATED',
    REMINDER = 'REMINDER',
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    priority: NotificationPriority;
    createdAt: Date;
    read: boolean;
    action?: {
        label: string;
        handler: () => void;
    };
}

export enum NotificationType {
    SUCCESS = 'success',
    WARNING = 'warning',
    INFO = 'info',
    ERROR = 'error',
    MILESTONE = 'milestone',
}

export enum NotificationPriority {
    LOW = 'low',
    NORMAL = 'normal',
    HIGH = 'high',
    URGENT = 'urgent',
}
