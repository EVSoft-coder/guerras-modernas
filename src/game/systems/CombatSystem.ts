/**
 * src/game/systems/CombatSystem.ts
 * Motor de Engajamento e Resolução de Atrito.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class CombatSystem implements GameSystem {
    /**
     * Ciclo de vida: Inicialização de balística.
     */
    public init(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Protocols READY.');
    }
 
    /**
     * Ciclo de vida: Resolução de conflitos em frame.
     */
    public update(deltaTime: number): void {
        const currentTime = Date.now() / 1000;
        
        // 1. Obter todos os agressores (Attack + Position)
        const attackers = entityManager.getEntitiesWith(['Attack', 'Position']);
        
        // 2. Obter todos os alvos potenciais (Health + Position)
        const targets = entityManager.getEntitiesWith(['Health', 'Position']);
 
        for (const atkId of attackers) {
            const atkComp = entityManager.getComponent<any>(atkId, 'Attack');
            const atkPos = entityManager.getComponent<any>(atkId, 'Position');
 
            // Validar Cooldown de ataque
            if (currentTime - atkComp.lastAttack < atkComp.cooldown) continue;
 
            // 3. Busca de Alvo mais próximo dentro do raio de ação
            for (const tarId of targets) {
                if (atkId === tarId) continue; // Não atacar a si próprio
 
                const tarPos = entityManager.getComponent<any>(tarId, 'Position');
                const dist = this.calculateDistance(atkPos.x, atkPos.y, tarPos.x, tarPos.y);
 
                if (dist <= atkComp.range) {
                    this.executeAttack(atkId, tarId, atkComp.power);
                    atkComp.lastAttack = currentTime;
                    break; // Um ataque por ciclo (ou estender conforme necessidade)
                }
            }
        }
    }
 
    private executeAttack(attackerId: number, targetId: number, power: number): void {
        const targetHealth = entityManager.getComponent<any>(targetId, 'Health');
        if (targetHealth) {
            targetHealth.value -= power;
            
            // EMITIR EVENTO DE DANO (Para UI e Morte de Unidade)
            eventBus.emit('UNIT_DAMAGED', {
                targetId: targetId,
                attackerId: attackerId,
                newHealth: targetHealth.value,
                damage: power
            }, targetId);
 
            if (targetHealth.value <= 0) {
                eventBus.emit('UNIT_DESTROYED', { entityId: targetId }, targetId);
            }
        }
    }
 
    private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
 
    public destroy(): void {
        console.log('[SYSTEM] CombatSystem - Disengaged.');
    }
}
 
export const combatSystem = new CombatSystem();
