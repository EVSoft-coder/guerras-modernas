/**
 * src/game/systems/CombatSystem.ts
 * Resolução de Balística com Sinalização Normalizada.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from '../systemsRegistry';
 
export class CombatSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Protocols Normalizing.');
    }
 
    public preUpdate(deltaTime: number): void {}
 
    public update(deltaTime: number): void {
        const currentTime = Date.now() / 1000;
        const attackers = entityManager.getEntitiesWith(['Attack', 'Position']);
        const targets = entityManager.getEntitiesWith(['Health', 'Position']);
 
        for (const atkId of attackers) {
            const atkComp = entityManager.getComponent<any>(atkId, 'Attack');
            const atkPos = entityManager.getComponent<any>(atkId, 'Position');
 
            if (currentTime - atkComp.lastAttack < atkComp.cooldown) continue;
 
            for (const tarId of targets) {
                if (atkId === tarId) continue;
                const tarPos = entityManager.getComponent<any>(tarId, 'Position');
                const dist = Math.sqrt(Math.pow(tarPos.x - atkPos.x, 2) + Math.pow(tarPos.y - atkPos.y, 2));
 
                if (dist <= atkComp.range) {
                    this.executeAttack(atkId, tarId, atkComp.power);
                    atkComp.lastAttack = currentTime;
                    break;
                }
            }
        }
    }
 
    private executeAttack(attackerId: number, targetId: number, power: number): void {
        const targetHealth = entityManager.getComponent<any>(targetId, 'Health');
        if (targetHealth) {
            targetHealth.value -= power;
            
            eventBus.emit({
                type: Events.COMBAT_UNIT_DAMAGED,
                entityId: targetId,
                timestamp: Date.now(),
                data: { attackerId, damage: power, newHealth: targetHealth.value }
            });
 
            if (targetHealth.value <= 0) {
                eventBus.emit({
                    type: Events.COMBAT_UNIT_DESTROYED,
                    entityId: targetId,
                    timestamp: Date.now(),
                    data: { attackerId }
                });
            }
        }
    }
 
    public postUpdate(deltaTime: number): void {}
 
    public destroy(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Suspended.');
    }
}
 
export const combatSystem = new CombatSystem();
