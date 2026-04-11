/**
 * src/game/systems/CombatSystem.ts
 * Processamento de danos e ordens de tiro.
 */
import { entityManager } from '../entities/EntityManager';
import { eventBus } from '../../core/EventBus';
 
export class CombatSystem {
    public update(deltaTime: number): void {
        // Lógica de cálculo de proximidade e engajamento
    }
 
    public handleAttack(attackerId: number, targetId: number): void {
        const health = entityManager.healths.get(targetId);
        if (health) {
            health.value -= 10;
            eventBus.emit('UNIT_DAMAGED', { id: targetId, newHealth: health.value });
        }
    }
}
 
export const combatSystem = new CombatSystem();
 
/**
 * src/game/systems/AISystem.ts
 * Automação de unidades inimigas.
 */
export class AISystem {
    public update(deltaTime: number): void {
        // Lógica de tomada de decisão para entidades com AIComponent
    }
}
 
export const aiSystem = new AISystem();
