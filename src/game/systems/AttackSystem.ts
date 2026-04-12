import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { ArmyComponent } from '../components/ArmyComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { MarchComponent } from '../components/MarchComponent';
import { VillageComponent } from '../components/VillageComponent';

export class AttackSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AttackSystem - Combat Resolution Protocols READY.');
        
        // Listen for arrival to resolve combat
        eventBus.subscribe(Events.ATTACK_ARRIVED, (payload) => {
            if (payload.entityId === undefined) return;
            this.resolveCombat(payload.entityId, payload.data.march);
        });

        // Listen for return to reintegrate troops
        eventBus.subscribe(Events.ATTACK_RETURNED, (payload) => {
            if (payload.entityId === undefined) return;
            this.reintegrateTroops(payload.entityId, payload.data.march);
        });
    }

    public preUpdate(deltaTime: number): void {}

    public update(deltaTime: number): void {
        // Now handled by MarchSystem
    }

    private resolveCombat(armyId: number, march: any): void {
        console.group(`[COMBAT_RESOLUTION] MSN: ${march.id}`);
        console.log(`Resolving engagement at [${march.targetX}:${march.targetY}]`);
        
        // Emissão para o motor de combate balístico resolver os dados
        eventBus.emit(Events.ATTACK_RESOLVE, {
            entityId: armyId,
            timestamp: Date.now(),
            data: { march }
        });
        
        console.groupEnd();
    }

    /**
     * Reintegra sobreviventes e espólio na vila de origem.
     */
    private reintegrateTroops(armyId: number, march: any): void {
        // Localizar vila de origem (por coordenadas)
        const villages = entityManager.getEntitiesWith(['Village', 'GridPosition']);
        let originId: number | null = null;

        for (const vId of villages) {
            const pos = entityManager.getComponent<any>(vId, 'GridPosition');
            if (pos && pos.x === march.originX && pos.y === march.originY) {
                originId = vId;
                break;
            }
        }

        if (originId) {
            const village = entityManager.getComponent<VillageComponent>(originId, 'Village');
            const resources = entityManager.getComponent<any>(originId, 'Resource');

            if (village && resources) {
                // Reintegrar Recursos (Loot)
                for (const [res, qty] of Object.entries(march.loot || {})) {
                    if (resources[res] !== undefined) {
                        resources[res] += qty;
                        // Sincronizar também com o componente Village para persistência se necessário
                        if (village.resources && (village.resources as any)[res] !== undefined) {
                            (village.resources as any)[res] += qty;
                        }
                    }
                }

                console.log(`[WAR] REINTEGRATION: Mission ${march.id} processed at Sector ${originId}.`);
                eventBus.emit('VILLAGE:UPDATE', { villageId: originId });
            }
        }
    }

    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] AttackSystem - Tactical Ops Terminated.');
    }
}

export const attackSystem = new AttackSystem();
