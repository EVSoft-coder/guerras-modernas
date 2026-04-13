import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { Logger } from '../../core/Logger';
import { GameSystem } from './types';
import { VillageComponent } from '../components/VillageComponent';
import { ArmyComponent } from '../components/ArmyComponent';
import { unitConfigs } from '../config';

export class CombatSystem implements GameSystem {
    public init(): void {
        Logger.info('CombatSystem - Engagement Protocols ONLINE.');

        // Subscrever à resolução tática de ataque
        eventBus.subscribe(Events.ATTACK_RESOLVE, (payload) => {
            const { entityId, data } = payload;
            if (entityId !== undefined) {
                this.handleAttackResolve(entityId, data.march);
            }
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
            Logger.info(`Empty Sector Engage at ${march.targetX}:${march.targetY}. Returning.`);
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
            const stats = unitConfigs[unitType];
            if (stats) {
                totalAttack += stats.attack * qty;
                carryCapacity += stats.capacity * qty;
            }
        }

        // 2. Determinar Vencedor (Defesa baseada no nível da base + guarnição)
        let totalDefense = (village.level * 200) + 500;
        
        // Adicionar defesa das tropas presentes na vila
        const villageArmy = entityManager.getComponent<ArmyComponent>(targetId, 'Army');
        if (villageArmy) {
            for (const [type, qty] of Object.entries(villageArmy.units)) {
                const stats = unitConfigs[type];
                if (stats) totalDefense += stats.defenseGeneral * qty;
            }
        }

        const attackerWins = totalAttack > totalDefense;
        Logger.info(`FORCES: ATK(${totalAttack}) vs DEF(${totalDefense}) | Success: ${attackerWins}`);

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
            const resourceOrder = ['suprimentos', 'combustivel', 'metal', 'municoes', 'energia', 'pessoal'];
            
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

            // 4.1 ARQUIVAR RELATÓRIO NO BACKEND (MANTIDO)
            this.saveBattleReport(army.ownerId, village.ownerId, attackerWins, {
                losses: lossesQty,
                loot: loot,
                units_at_impact: army.units,
                base_target_id: targetId
            });

            // 4.2 LÓGICA DE LEALDADE E CONQUISTA
            const hasPolitico = army.units['politico'] && army.units['politico'] > 0;
            
            if (hasPolitico) {
                // Redução dinâmica entre 20 e 35
                const reduction = Math.floor(Math.random() * (35 - 20 + 1)) + 20;
                
                eventBus.emit('VILLAGE:LOYALTY_REDUCE', {
                    targetId: targetId,
                    amount: reduction,
                    attackerId: army.ownerId
                });

                console.log(`[COMBAT] POLITICAL SUBVERSION: Base ${targetId} being influenced by Politico. Reduction: ${reduction}%`);
            }

            // 4.3 SE FOR REBELDE (E NÃO CONQUISTADO AGORA): Destruir posto avançado (Respawn System)
            if (village.isRebel && marchComp.missionType !== 'conquista') {
                console.log(`[COMBAT] REBEL OUTPOST NEUTRALIZED: Entity ${targetId} removed from world.`);
                entityManager.removeEntity(targetId);
            }
        } else if (marchComp) {
            // DERROTA: Arquivar mesmo assim
             this.saveBattleReport(army.ownerId, village.ownerId, false, {
                losses: lossesQty,
                loot: {},
                units_at_impact: army.units,
                base_target_id: targetId
            });
        }

        // 4.4 Sinalizar Resultado para UI
        eventBus.emit('COMBAT:RESULT', { 
            vitoria: attackerWins, 
            losses: lossesQty, 
            loot: attackerWins ? Object.values(marchComp.loot || {}).reduce((a: any, b: any) => a + b, 0) : 0,
            targetId: targetId
        });

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

    private saveBattleReport(attacker: number, defender: number | null, vitoria: boolean, dados: any): void {
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        
        fetch('/api/relatorios/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || ''
            },
            body: JSON.stringify({
                atacante_id: attacker,
                defensor_id: defender,
                vitoria: vitoria,
                dados: dados
            })
        })
        .then(res => res.json())
        .then(data => console.log('[INTEL] Battle Report Archived:', data.id))
        .catch(err => console.error('[INTEL] Failed to archive battle report:', err));
    }

    public preUpdate(deltaTime: number): void {}
    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] CombatSystem - Engagement Protocols OFFLINE.');
    }
}

export const combatSystem = new CombatSystem();
