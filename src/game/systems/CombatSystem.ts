/**
 * src/game/systems/CombatSystem.ts
 * GestÃ£o de Engagement e ResoluÃ§Ã£o de Conflitos TÃ¡cticos.
 */
import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { VillageComponent } from '../components/VillageComponent';
import { ArmyComponent } from '../components/ArmyComponent';

export class CombatSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Protocols ONLINE.');
    }

    public update(deltaTime: number): void {
        const armies = entityManager.getEntitiesWith(['Army', 'Velocity', 'GridPosition']);

        for (const armyId of armies) {
            const vel = entityManager.getComponent<any>(armyId, 'Velocity');
            const army = entityManager.getComponent<ArmyComponent>(armyId, 'Army');
            const pos = entityManager.getComponent<any>(armyId, 'GridPosition');

            // Se o exÃ©rcito parou de se mover e tem um alvo
            if (vel && army && pos && !vel.isMoving && vel.path.length === 0) {
                this.resolveEngagement(armyId, army, pos);
            }
        }
    }

    private resolveEngagement(armyId: number, army: ArmyComponent, pos: any): void {
        // Localizar Vilas ou Unidades no mesmo tile
        const targets = entityManager.getEntitiesWith(['Village', 'GridPosition']);
        
        for (const targetId of targets) {
            const targetPos = entityManager.getComponent<any>(targetId, 'GridPosition');
            const village = entityManager.getComponent<VillageComponent>(targetId, 'Village');

            if (targetPos && village && targetPos.x === pos.x && targetPos.y === pos.y) {
                // Evitar fogo amigo
                if (village.ownerId === army.ownerId) continue;

                this.executeRaid(armyId, army, targetId, village);
                break;
            }
        }
    }

    private executeRaid(armyId: number, army: ArmyComponent, targetId: number, village: VillageComponent): void {
        console.log(`[COMBAT] Army ${armyId} raiding Village ${targetId}`);

        // Saque: 30% dos recursos da vila
        const lootedWood = Math.floor(village.resources.wood * 0.3);
        const lootedStone = Math.floor(village.resources.stone * 0.3);
        const lootedIron = Math.floor(village.resources.iron * 0.3);

        village.resources.wood -= lootedWood;
        village.resources.stone -= lootedStone;
        village.resources.iron -= lootedIron;

        eventBus.emit(Events.ATTACK_ARRIVED, {
            entityId: armyId,
            data: {
                result: 'VICTORY',
                looted: { wood: lootedWood, stone: lootedStone, iron: lootedIron }
            }
        });

        // O exÃ©rcito entra em "modo retorno" ou Ã© destruÃ­do (simplificado: auto-destruição apÃ³s saque por agora)
        entityManager.removeEntity(armyId);
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Protocols OFFLINE.');
    }
}

export const combatSystem = new CombatSystem();
