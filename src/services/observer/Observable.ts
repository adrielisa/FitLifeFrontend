/**
 * Clase base Observable que implementa el patrón Observer
 * Proporciona funcionalidad para registrar, desregistrar y notificar observadores
 */

import type { IObserver, IObservable, ObservableEvent } from './IObserver';

export abstract class Observable implements IObservable {
    protected observers: Set<IObserver> = new Set();

    /**
     * Registra un observador
     * Evita duplicados automáticamente
     */
    attach(observer: IObserver): void {
        this.observers.add(observer);
        console.log(`[Observable] Observador registrado. Total: ${this.observers.size}`);
    }

    /**
     * Desregistra un observador
     */
    detach(observer: IObserver): void {
        this.observers.delete(observer);
        console.log(`[Observable] Observador removido. Total: ${this.observers.size}`);
    }

    /**
     * Notifica a todos los observadores sobre un evento
     * Ejecuta el método update() de cada observador
     */
    notifyObservers(event: ObservableEvent): void {
        console.log(
            `[Observable] Notificando ${this.observers.size} observadores sobre evento: ${event.type}`
        );

        this.observers.forEach(observer => {
            try {
                observer.update(event);
            } catch (error) {
                console.error(`[Observable] Error al notificar observador:`, error);
            }
        });
    }

    /**
     * Obtiene la cantidad actual de observadores
     */
    getObserverCount(): number {
        return this.observers.size;
    }
}
