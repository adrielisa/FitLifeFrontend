/**
 * NotificationService - Observador concreto
 * 
 * Responsabilidades:
 * - Escucha eventos del sistema (Goals, Achievements, Workouts, etc)
 * - Crea notificaciones apropiadas para el usuario
 * - Gestiona el historial de notificaciones
 * - Filtra notificaciones según prioridad y tipo
 */

import type { IObserver, ObservableEvent, Notification } from './IObserver';
import { EventType, NotificationType, NotificationPriority } from './IObserver';

export class NotificationService implements IObserver {
    private notifications: Notification[] = [];
    private maxNotifications = 100; // Limitar historial
    private notificationRules: Map<EventType, NotificationRule> = new Map();

    constructor() {
        this.initializeRules();
    }

    /**
     * Inicializa las reglas de cómo eventos mapean a notificaciones
     */
    private initializeRules(): void {
        this.notificationRules.set(EventType.GOAL_ACHIEVED, {
            type: NotificationType.SUCCESS,
            priority: NotificationPriority.HIGH,
            messageTemplate: (data) => `¡Felicidades! Has alcanzado tu objetivo: ${data.goalName}`,
        });

        this.notificationRules.set(EventType.ACHIEVEMENT_UNLOCKED, {
            type: NotificationType.MILESTONE,
            priority: NotificationPriority.HIGH,
            messageTemplate: (data) => `🏆 ¡Logro desbloqueado! ${data.achievementName}`,
        });

        this.notificationRules.set(EventType.WORKOUT_COMPLETED, {
            type: NotificationType.SUCCESS,
            priority: NotificationPriority.NORMAL,
            messageTemplate: (data) =>
                `Excelente trabajo. Completaste tu entrenamiento de ${data.duration} minutos`,
        });

        this.notificationRules.set(EventType.CALORIE_TARGET_REACHED, {
            type: NotificationType.INFO,
            priority: NotificationPriority.NORMAL,
            messageTemplate: () => 'Has alcanzado tu objetivo de calorías del día',
        });

        this.notificationRules.set(EventType.CALORIE_EXCEEDED, {
            type: NotificationType.WARNING,
            priority: NotificationPriority.NORMAL,
            messageTemplate: (data) => `Has superado tu límite calórico por ${data.excess} kcal`,
        });

        this.notificationRules.set(EventType.GOAL_PROGRESS_UPDATE, {
            type: NotificationType.INFO,
            priority: NotificationPriority.LOW,
            messageTemplate: (data) =>
                `Progreso en ${data.goalName}: ${data.progress}% completado`,
        });

        this.notificationRules.set(EventType.REMINDER, {
            type: NotificationType.INFO,
            priority: NotificationPriority.NORMAL,
            messageTemplate: (data) => data.message || 'Recordatorio',
        });
    }

    /**
     * Implementación de IObserver.update()
     * Se ejecuta cuando el Observable notifica de un evento
     */
    update(event: ObservableEvent): void {
        const rule = this.notificationRules.get(event.type);

        if (!rule) {
            console.warn(`[NotificationService] No hay regla para evento: ${event.type}`);
            return;
        }

        const notification = this.createNotification(event, rule);
        this.addNotification(notification);

        // En una aplicación real, aquí se enviaría a través de:
        // - Sistema de push notifications
        // - Email
        // - SMS
        // - In-app toast notifications
        console.log(`[NotificationService] Nueva notificación:`, notification);
    }

    /**
     * Crea una notificación basada en un evento y regla
     */
    private createNotification(event: ObservableEvent, rule: NotificationRule): Notification {
        return {
            id: this.generateId(),
            type: rule.type,
            title: this.getTitleForEvent(event.type),
            message: rule.messageTemplate(event.data),
            priority: rule.priority,
            createdAt: event.timestamp,
            read: false,
        };
    }

    /**
     * Obtiene un título descriptivo para cada tipo de evento
     */
    private getTitleForEvent(eventType: EventType): string {
        const titles: Record<EventType, string> = {
            [EventType.GOAL_CREATED]: 'Objetivo Creado',
            [EventType.GOAL_UPDATED]: 'Objetivo Actualizado',
            [EventType.GOAL_ACHIEVED]: 'Objetivo Alcanzado',
            [EventType.GOAL_FAILED]: 'Objetivo No Completado',
            [EventType.GOAL_PROGRESS_UPDATE]: 'Progreso Actualizado',
            [EventType.ACHIEVEMENT_UNLOCKED]: 'Logro Desbloqueado',
            [EventType.ACHIEVEMENT_MILESTONE]: 'Hito Alcanzado',
            [EventType.WORKOUT_COMPLETED]: 'Entrenamiento Completado',
            [EventType.WORKOUT_STARTED]: 'Entrenamiento Iniciado',
            [EventType.MEAL_LOGGED]: 'Comida Registrada',
            [EventType.CALORIE_TARGET_REACHED]: 'Objetivo Calórico Alcanzado',
            [EventType.CALORIE_EXCEEDED]: 'Límite Calórico Excedido',
            [EventType.STATS_UPDATED]: 'Estadísticas Actualizadas',
            [EventType.REMINDER]: 'Recordatorio',
        };

        return titles[eventType] || 'Notificación';
    }

    /**
     * Añade una notificación al historial
     * Mantiene el límite máximo de notificaciones
     */
    private addNotification(notification: Notification): void {
        this.notifications.unshift(notification); // Agregar al inicio

        // Limitar el historial
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }
    }

    /**
     * Obtiene todas las notificaciones
     */
    getNotifications(): Notification[] {
        return [...this.notifications];
    }

    /**
     * Obtiene notificaciones no leídas
     */
    getUnreadNotifications(): Notification[] {
        return this.notifications.filter(n => !n.read);
    }

    /**
     * Marca una notificación como leída
     */
    markAsRead(notificationId: string): void {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    }

    /**
     * Marca todas las notificaciones como leídas
     */
    markAllAsRead(): void {
        this.notifications.forEach(n => (n.read = true));
    }

    /**
     * Elimina una notificación
     */
    deleteNotification(notificationId: string): void {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
    }

    /**
     * Limpia todas las notificaciones
     */
    clearAll(): void {
        this.notifications = [];
    }

    /**
     * Filtra notificaciones por tipo
     */
    filterByType(type: NotificationType): Notification[] {
        return this.notifications.filter(n => n.type === type);
    }

    /**
     * Filtra notificaciones por prioridad
     */
    filterByPriority(priority: NotificationPriority): Notification[] {
        return this.notifications.filter(n => n.priority === priority);
    }

    /**
     * Obtiene notificaciones recientes (últimas N)
     */
    getRecentNotifications(count: number = 5): Notification[] {
        return this.notifications.slice(0, count);
    }

    /**
     * Genera un ID único simple
     */
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * Interfaz interna para las reglas de notificación
 */
interface NotificationRule {
    type: NotificationType;
    priority: NotificationPriority;
    messageTemplate: (data: Record<string, any>) => string;
}
