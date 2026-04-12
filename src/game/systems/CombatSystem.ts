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
        console.log(`[COMBAT] STRATEGIC ENGAGEMENT: Army ${armyId} vs Village ${targetId}`);

        const attackerUnit = entityManager.getComponent<any>(armyId, 'Unit');
        const defenderUnit = entityManager.getComponent<any>(targetId, 'Unit');

        // 1. Soma Ataque Atacante (Baseado na composição do Exército)
        const attackerQty = Object.values(army.units).reduce((a, b) => a + b, 0);
        const totalAttack = (attackerUnit?.attack || 100) * attackerQty;

        // 2. Soma Defesa Defensor (Baseado na estrutura ou guarnição)
        const totalDefense = (defenderUnit?.defense || 1500) + (village.resources.wood * 0.01); // Paredes de madeira?

        console.log(`[COMBAT] CALCULATED FORCE: ATK(${totalAttack}) vs DEF(${totalDefense})`);

        // 3. Regra de Resolução
        const attackerWins = totalAttack > totalDefense;
        
        // 4. Aplicar Perdas Percentuais
        const attackerLossPercent = attackerWins ? 0.2 : 0.8; // Se vencer perde 20%, se perder perde 80%
        const defenderLossPercent = attackerWins ? 0.5 : 0.1; // Se perder (vila) perde 50% eficiência? (Aqui perdemos recursos)

        for (const type in army.units) {
            army.units[type] = Math.floor(army.units[type] * (1 - attackerLossPercent));
        }

        if (attackerWins) {
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
            
            console.log(`[COMBAT] VICTORY: Resources captured and casualties reported.`);
        } else {
            eventBus.emit(Events.ATTACK_ARRIVED, {
                entityId: armyId,
                data: {
                    result: 'DEFEAT',
                    looted: { wood: 0, stone: 0, iron: 0 }
                }
            });
            console.log(`[COMBAT] DEFEAT: Attack repelled. High casualties sustained.`);
        }

        // Se o exército ficar sem tropas, remover
        const remainingTroops = Object.values(army.units).reduce((a, b) => a + b, 0);
        if (remainingTroops <= 0) {
            entityManager.removeEntity(armyId);
        } else {
            // Todo: Retornar à base (por agora, apenas destruímos para simplificar ou deixamos parado)
            entityManager.removeEntity(armyId);
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Protocols OFFLINE.');
    }
}

export const combatSystem = new CombatSystem();
