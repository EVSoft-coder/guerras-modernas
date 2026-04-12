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

        // Subscrever à resolução tática de ataque
        eventBus.subscribe('ATTACK:RESOLVE', (payload) => {
            const { entityId, data } = payload;
            this.handleAttackResolve(entityId, data.march);
        });
    }

    private handleAttackResolve(armyId: number, march: any): void {
        const army = entityManager.getComponent<ArmyComponent>(armyId, 'Army');
        if (!army) return;

        // Localizar alvo na coordenada de destino (Vila ou Entidade)
        const targetBases = entityManager.getEntitiesWith(['Village', 'GridPosition']);
        let targetId: number | null = null;

        for (const baseId of targetBases) {
            const pos = entityManager.getComponent<any>(baseId, 'GridPosition');
            if (pos && pos.x === march.targetX && pos.y === march.targetY) {
                targetId = baseId;
                break;
            }
        }

        if (targetId) {
            const village = entityManager.getComponent<VillageComponent>(targetId, 'Village');
            if (village) {
                this.executeRaid(armyId, army, targetId, village);
                
                // Pós-Combate: Iniciar Regresso se houver sobreviventes
                const marchComp = entityManager.getComponent<any>(armyId, 'March');
                if (marchComp) {
                    marchComp.status = 'returning';
                    console.log(`[COMBAT] Survivors of Army ${armyId} heading back to origin.`);
                }
            }
        } else {
            console.log(`[COMBAT] No structural target at ${march.targetX}:${march.targetY}. Empty Sector.`);
            const marchComp = entityManager.getComponent<any>(armyId, 'March');
            if (marchComp) marchComp.status = 'returning';
        }
    }

    public update(deltaTime: number): void {
        // A resolução agora é baseada em eventos (ATTACK:RESOLVE), 
        // mas mantemos o update para outros engajamentos de proximidade se necessário.
    }

    private executeRaid(armyId: number, army: ArmyComponent, targetId: number, village: VillageComponent): void {
        console.log(`[COMBAT] STRATEGIC ENGAGEMENT: Army ${armyId} vs Village ${targetId}`);

        const attackerUnit = entityManager.getComponent<any>(armyId, 'Unit');
        const defenderUnit = entityManager.getComponent<any>(targetId, 'Unit');

        // 1. Soma Ataque Atacante (Baseado na composição do Exército)
        const attackerQty = Object.values(army.units).reduce((a, b) => a + b, 0);
        const attackBase = attackerUnit?.attack || 100;
        const attackBonus = attackerUnit?.attackBonus || 1.0;
        const totalAttack = attackBase * attackBonus * attackerQty;

        // 2. Soma Defesa Defensor (Baseado na estrutura ou guarnição)
        const totalDefense = (defenderUnit?.defense || 1500) + (village.resources.wood * 0.01); // Paredes de madeira?

        console.log(`[COMBAT] CALCULATED FORCE: ATK(${totalAttack}) vs DEF(${totalDefense})`);

        // 3. Regra de Resolução
        const attackerWins = totalAttack > totalDefense;
        
        // 4. Aplicar Perdas Percentuais
        const attackerLossPercent = attackerWins ? 0.2 : 0.8; // Se vencer perde 20%, se perder perde 80%
        const defenderLossPercent = attackerWins ? 0.5 : 0.1; // Se perder (vila) perde 50% eficiência? (Aqui perdemos recursos)

        const attackerQtyBefore = Object.values(army.units).reduce((a, b) => a + b, 0);
        for (const type in army.units) {
            army.units[type] = Math.floor(army.units[type] * (1 - attackerLossPercent));
        }
        const lossesQty = attackerQtyBefore - Object.values(army.units).reduce((a, b) => a + b, 0);

        if (attackerWins) {
            // ... [Lógica de saque mantida] ...
            const totalCapacity = (attackerUnit?.capacity || 1000) * attackerQty;
            
            let possibleWood = Math.floor(village.resources.wood * 0.3);
            let possibleStone = Math.floor(village.resources.stone * 0.3);
            let possibleIron = Math.floor(village.resources.iron * 0.3);
            
            const totalRequested = possibleWood + possibleStone + possibleIron;
            
            if (totalRequested > totalCapacity) {
                const ratio = totalCapacity / totalRequested;
                possibleWood = Math.floor(possibleWood * ratio);
                possibleStone = Math.floor(possibleStone * ratio);
                possibleIron = Math.floor(possibleIron * ratio);
            }

            village.resources.wood -= possibleWood;
            village.resources.stone -= possibleStone;
            village.resources.iron -= possibleIron;

            // Transferir para o exército
            army.loot.wood += possibleWood;
            army.loot.stone += possibleStone;
            army.loot.iron += possibleIron;

            const reportData = {
                vencedor: 'ATACANTE',
                resultado: 'VICTORY',
                perdas_atacante: lossesQty,
                perdas_defensor: 0,
                loot: { wood: possibleWood, stone: possibleStone, iron: possibleIron }
            };

            eventBus.emit(Events.ATTACK_ARRIVED, {
                entityId: armyId,
                data: {
                    result: 'VICTORY',
                    looted: reportData.loot,
                    report: reportData
                }
            });
            
            console.log(`[COMBAT] VICTORY: Resources captured and casualties reported.`);
        } else {
            // DERROTA DO ATACANTE
            const reportData = {
                vencedor: 'DEFENSOR',
                resultado: 'DEFEAT',
                perdas_atacante: lossesQty,
                perdas_defensor: 0,
                loot: null
            };

            eventBus.emit(Events.ATTACK_ARRIVED, {
                entityId: armyId,
                data: {
                    result: 'DEFEAT',
                    looted: { wood: 0, stone: 0, iron: 0 },
                    report: reportData
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
