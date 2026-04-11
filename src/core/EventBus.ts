import { Logger } from './Logger';
 
export interface EventPayload {
    type: string;        // Formato: NAMESPACE:ACTION
    entityId?: number;
    timestamp: number;
    data: Record<string, any>;
}
 
export type TacticalHandler = (payload: EventPayload) => void;
 
class EventBus {
    private handlers: Map<string, TacticalHandler[]> = new Map();
 
    /**
     * Subscreve um manipulador. O eventType deve ser NAMESPACE:ACTION.
     */
    public subscribe(eventType: string, handler: TacticalHandler): void {
        const type = eventType.toUpperCase();
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type)!.push(handler);
    }
 
    /**
     * Emite um evento através de um payload COMPLETO e normalizado.
     * Única via de sinalização autorizada nesta doutrina.
     */
    public emit(payload: EventPayload): void {
        const type = payload.type.toUpperCase();
        
        // Registo Táctico
        console.log("EVENT EMITTED:", payload.type, payload);
        Logger.event(type, payload);
 
        // Validação estrita em runtime (MEA Protocol)
        if (!type || !payload.timestamp || !payload.data) {
            console.error('[EVENT_BUS_FAILURE] Invalid payload rejected.', payload);
            return;
        }
 
        const callbacks = this.handlers.get(type);
        if (callbacks) {
            callbacks.forEach(cb => cb(payload));
        }
    }
}
 
export const eventBus = new EventBus();
 
/**
 * Dicionário Normalizado de Eventos (NAMESPACE:ACTION)
 */
export const Events = {
    // Sistema
    GAME_STATE_CHANGED: 'GAME:STATE_CHANGED',
    GAME_REQUEST_PAUSE: 'GAME:REQUEST_PAUSE',
    GAME_REQUEST_RESUME: 'GAME:REQUEST_RESUME',
    GAME_CHANGE_MODE: 'GAME:CHANGE_MODE',
    GAMEMODE_CHANGED: 'GAMEMODE:CHANGED',
    
    // Controlo Humano
    PLAYER_UNIT_SELECTED: 'PLAYER:UNIT_SELECTED',
    PLAYER_SELECTION_CLEARED: 'PLAYER:SELECTION_CLEARED',
    PLAYER_MOVE_ORDER: 'PLAYER:MOVE_ORDER',
    
    // Combate
    COMBAT_UNIT_DAMAGED: 'COMBAT:UNIT_DAMAGED',
    COMBAT_UNIT_DESTROYED: 'COMBAT:UNIT_DESTROYED',
    
    // Sensores
    INPUT_KEY_DOWN: 'INPUT:KEY_DOWN',
    INPUT_KEY_UP: 'INPUT:KEY_UP',
    
    // Logística
    BUILDING_REQUEST: 'BUILDING:REQUEST',
    BUILDING_COMPLETED: 'BUILDING:COMPLETED',
    BUILDING_FAILED: 'BUILDING:FAILED',
    BUILDING_SELECTED: 'BUILDING:SELECTED',
    BUILDING_UPGRADE_REQUEST: 'BUILDING:UPGRADE_REQUEST',

    // Operações de Guerra
    ATTACK_STARTED: 'ATTACK:STARTED',
    ATTACK_ARRIVED: 'ATTACK:ARRIVED',
    ATTACK_RETURNED: 'ATTACK:RETURNED'
};
