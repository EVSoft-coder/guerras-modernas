import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { VillageComponent } from '../components/VillageComponent';
import { ArmyComponent } from '../components/ArmyComponent';
import { unitStats } from '../config/unitStats';

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

        // Localizar alvo na coordenada de destino
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
            }
        } else {
            console.log(`[COMBAT] Empty Sector Engage at ${march.targetX}:${march.targetY}. Returning.`);
            const marchComp = entityManager.getComponent<any>(armyId, 'March');
            if (marchComp) {
                marchComp.status = 'returning';
                marchComp.startTime = Date.now(); 
            }
        }
    }

    public update(deltaTime: number): void {}

    private executeRaid(armyId: number, army: ArmyComponent, targetId: number, village: VillageComponent): void {
        console.log(`[COMBAT] STRATEGIC ENGAGEMENT: Army ${armyId} vs Base ${targetId}`);

        // 1. Calcular Força de Impacto e Capacidade de Carga
        let totalAttack = 0;
        let carryCapacity = 0;
        for (const [unitType, qty] of Object.entries(army.units)) {
            const stats = unitStats[unitType];
            if (stats) {
                totalAttack += stats.attack * qty;
                carryCapacity += stats.capacity * qty;
            }
        }

        // 2. Determinar Vencedor (Defesa baseada no nível da base)
        const totalDefense = (village.level * 200) + 500;
        const attackerWins = totalAttack > totalDefense;

        console.log(`[COMBAT] FORCES: ATK(${totalAttack}) vs DEF(${totalDefense}) | Success: ${attackerWins}`);

        // 3. Aplicar Perdas (Percentagem de baixas)
        const lossFactor = attackerWins ? 0.15 : 0.70;
        const attackerQtyBefore = Object.values(army.units).reduce((a, b) => a + b, 0);
        
        for (const type in army.units) {
            army.units[type] = Math.floor(army.units[type] * (1 - lossFactor));
        }
        
        const attackerQtyAfter = Object.values(army.units).reduce((a, b) => a + b, 0);
        const lossesQty = attackerQtyBefore - attackerQtyAfter;

        const marchComp = entityManager.getComponent<any>(armyId, 'March');

        if (attackerWins && marchComp) {
            // 4. Executar Pilhagem (min(target.resources, carryCapacity))
            const loot: Record<string, number> = {};
            let totalLooted = 0;
            const resourceOrder = ['suprimentos', 'combustivel', 'metal', 'municoes'];
            
            for (const res of resourceOrder) {
                if (totalLooted >= carryCapacity) break;
                
                const available = (village.resources as any)[res] || 0;
                const canTake = Math.min(available, carryCapacity - totalLooted);
                
                if (canTake > 0) {
                    loot[res] = Math.floor(canTake);
                    (village.resources as any)[res] -= canTake;
                    totalLooted += canTake;
                }
            }

            marchComp.loot = loot;
            army.loot = { ...army.loot, ...loot };
            console.log(`[COMBAT] VICTORY! Resources captured: ${totalLooted} units. Losses: ${lossesQty}`);
        }

        // 5. Iniciar Protocolo de Regresso
        if (marchComp) {
            const livingTroops = Object.values(army.units).reduce((a, b) => a + b, 0);
            if (livingTroops <= 0) {
                console.log(`[COMBAT] TOTAL ANNIHILATION: Army ${armyId} destroyed.`);
                entityManager.removeEntity(armyId);
            } else {
                marchComp.status = 'returning';
                
                // Reset temporal: Inverter o curso da marcha
                const now = Date.now();
                const tripDuration = marchComp.arrivalTime - marchComp.startTime;
                
                marchComp.startTime = now;
                marchComp.arrivalTime = now + tripDuration;
                marchComp.returnTime = now + tripDuration; 
                
                console.log(`[COMBAT] RETREAT: Survivors returning to origin. ETA: ${(tripDuration / 1000).toFixed(1)}s`);
            }
        }
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Protocols OFFLINE.');
    }
}

export const combatSystem = new CombatSystem();
