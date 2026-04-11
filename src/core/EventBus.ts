/**
 * EventBus.ts
 * Barramento de eventos táticos com payload obrigatório.
 */
export interface EventPayload {
    entityId?: number;
    timestamp: number;
    data: any;
}
 
export type TacticalHandler = (payload: EventPayload) => void;
 
class EventBus {
    private handlers: Map<string, TacticalHandler[]> = new Map();
 
    /**
     * Subscreve um manipulador. Use UPPER_CASE para o eventType.
     */
    public subscribe(eventType: string, handler: TacticalHandler): void {
        const type = eventType.toUpperCase();
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type)!.push(handler);
    }
 
    /**
     * Emite um evento com payload obrigatório.
     */
    public emit(eventType: string, data: any, entityId?: number): void {
        const type = eventType.toUpperCase();
        const payload: EventPayload = {
            entityId,
            timestamp: Date.now(),
            data
        };
 
        const callbacks = this.handlers.get(type);
        if (callbacks) {
            callbacks.forEach(cb => cb(payload));
        }
    }
}
 
export const eventBus = new EventBus();
 
// Doutrina de Eventos Pré-definidos
export const Events = {
    UNIT_MOVED: 'UNIT_MOVED',
    UNIT_DAMAGED: 'UNIT_DAMAGED',
    BATTLE_STARTED: 'BATTLE_STARTED',
    STATE_CHANGED: 'STATE_CHANGED'
};
