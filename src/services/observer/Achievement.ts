/**
 * Clase Achievement - Observable
 * 
 * Representa un logro desbloqueado por el usuario
 * Notifica a observadores cuando el logro es desbloqueado
 */

import { Observable } from './Observable';
import { EventType } from './IObserver';

export enum AchievementType {
    FIRST_WORKOUT = 'first_workout',
    WEEK_STREAK = 'week_streak',
    MONTH_STREAK = 'month_streak',
    WEIGHT_MILESTONE = 'weight_milestone',
    CALORIE_MILESTONE = 'calorie_milestone',
    GOAL_COMPLETED = 'goal_completed',
    SOCIAL_MILESTONE = 'social_milestone',
    LEVEL_UP = 'level_up',
}

export interface AchievementData {
    id: string;
    userId: string;
    name: string;
    type: AchievementType;
    description: string;
    icon?: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    points: number; // XP o puntos obtenidos
    unlockedAt: Date;
    hidden: boolean; // Si es un logro secreto
    milestoneValue?: number; // Para logros de hito (ej: 50kg perdidos)
}

export class Achievement extends Observable {
    private data: AchievementData;
    private isNew = true; // Indica si es un logro recién desbloqueado

    constructor(data: AchievementData) {
        super();
        this.data = { ...data };
    }

    /**
     * Desbloquea el logro y notifica a los observadores
     */
    unlock(): void {
        if (!this.isNew) return; // Solo se puede desbloquear una vez

        this.isNew = false;
        this.data.unlockedAt = new Date();

        this.notifyObservers({
            type: EventType.ACHIEVEMENT_UNLOCKED,
            timestamp: this.data.unlockedAt,
            source: `Achievement-${this.data.id}`,
            data: {
                achievementId: this.data.id,
                achievementName: this.data.name,
                achievementType: this.data.type,
                description: this.data.description,
                icon: this.data.icon,
                points: this.data.points,
                rarity: this.data.rarity,
                milestoneValue: this.data.milestoneValue,
            },
        });

        // Notificar también si es un hito importante
        if (this.isImportantMilestone()) {
            this.notifyObservers({
                type: EventType.ACHIEVEMENT_MILESTONE,
                timestamp: this.data.unlockedAt,
                source: `Achievement-${this.data.id}`,
                data: {
                    achievementId: this.data.id,
                    achievementName: this.data.name,
                    milestoneValue: this.data.milestoneValue,
                    rarity: this.data.rarity,
                },
            });
        }
    }

    /**
     * Determina si es un hito importante
     */
    private isImportantMilestone(): boolean {
        return ['rare', 'legendary'].includes(this.data.rarity);
    }

    /**
     * Obtiene los datos del logro
     */
    getData(): AchievementData {
        return { ...this.data };
    }

    /**
     * Verifica si el logro fue desbloqueado recientemente (últimas 24 horas)
     */
    isRecent(): boolean {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return this.data.unlockedAt >= oneDayAgo;
    }

    /**
     * Verifica si el logro es nuevo (recién creado pero no desbloqueado aún)
     */
    isNewLocked(): boolean {
        return this.isNew;
    }

    /**
     * Obtiene una descripción visual del logro
     */
    getFormattedDisplay(): string {
        const rarityEmojis = {
            common: '⚪',
            uncommon: '🟢',
            rare: '🔵',
            legendary: '⭐',
        };

        return `${rarityEmojis[this.data.rarity]} ${this.data.name} (+${this.data.points} XP)`;
    }
}
