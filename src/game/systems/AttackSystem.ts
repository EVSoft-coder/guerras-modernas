import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { ArmyComponent } from '../components/ArmyComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { MarchComponent } from '../components/MarchComponent';
import { VillageComponent } from '../components/VillageComponent';

export class AttackSystem implements GameSystem {
    public init(): void {
        console.log('[SYSTEM] AttackSystem - War Room Operational.');
        
        // Subscrever à ordem de lançamento de expedição
        eventBus.subscribe(Events.ATTACK_LAUNCH, (payload) => {
            this.launchAttack(payload.data);
        });
    }

    public preUpdate(deltaTime: number): void {}

    public update(deltaTime: number): void {
        const now = Date.now();
        const marches = entityManager.getEntitiesWith(['March']);

        for (const armyId of marches) {
            const march = entityManager.getComponent<any>(armyId, 'March');
            if (!march) continue;
            
            // A. GATILHO DE COMBATE (Chegada ao Alvo)
            if (march.status === 'going' && now >= march.arrivalTime) {
                console.log(`[WAR] CONTACT: Army ${armyId} reached objective at ${march.targetX}:${march.targetY}`);
                
                eventBus.emit('ATTACK:RESOLVE', {
                    entityId: armyId,
                    timestamp: now,
                    data: { march }
                });

                march.status = 'completed'; 
            }

            // B. GATILHO DE REINTEGRAÇÃO (Chegada à Origem)
            if (march.status === 'returning' && now >= march.returnTime) {
                console.log(`[WAR] RECOVERY: Army ${armyId} returned to base at ${march.originX}:${march.originY}`);
                
                this.reintegrateTroops(armyId, march);
                
                // Remover entidade de marcha do motor
                entityManager.removeEntity(armyId);
            }
        }
    }

    /**
     * Reintegra sobreviventes e espólio na vila de origem.
     */
    private reintegrateTroops(armyId: number, march: any): void {
        const army = entityManager.getComponent<ArmyComponent>(armyId, 'Army');
        if (!army) return;

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
            if (village) {
                // 1. Reintegrar Recursos (Loot)
                for (const [res, qty] of Object.entries(march.loot || {})) {
                    if ((village.resources as any)[res] !== undefined) {
                        (village.resources as any)[res] += qty;
                    }
                }

                // 2. Reintegrar Tropas (No backend real isto seria sincronizado via API)
                console.log(`[WAR] SUCCESS: ${armyId} reintegrated at ${originId}.`);
                
                // Emitir evento de atualização para a UI refletir os novos recursos e tropas
                eventBus.emit('VILLAGE:UPDATE', { villageId: originId });
            }
        }
    }

    private launchAttack(data: any): void {
        const { originX, originY, targetX, targetY, ownerId, troops, tipo } = data;

        // Gerar ID único de missão
        const missionId = `MSN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const armyId = entityManager.createEntity();
        
        // 1. Definir Identidade e Composição
        entityManager.addComponent(armyId, new ArmyComponent(ownerId, troops));
        
        // 2. Definir Posição Geográfica Inicial
        entityManager.addComponent(armyId, new GridPositionComponent(originX, originY, true));

        // 3. Calcular Logística de Marcha
        const dx = targetX - originX;
        const dy = targetY - originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Velocidade base táctica
        let slowestSpeed = 10; 
        const travelMultiplier = 5;
        const travelTimeMs = (distance / slowestSpeed) * (3600 / travelMultiplier) * 1000;

        entityManager.addComponent(armyId, new MarchComponent(
            missionId,
            originX,
            originY,
            targetX,
            targetY,
            troops,
            Date.now(),
            Date.now() + travelTimeMs,
            Date.now() + (travelTimeMs * 2), // Estimativa de retorno
            'going',
            tipo || 'ataque',
            ownerId
        ));

        // 4. Marcação de Tipo para o Satélite
        entityManager.addComponent(armyId, { type: 'Army' });

        console.log(`[WAR] Army ${armyId} [${missionId}] deployed. ETA: ${(travelTimeMs / 1000).toFixed(1)}s`);
    }

    public postUpdate(deltaTime: number): void {}

    public destroy(): void {
        console.log('[SYSTEM] AttackSystem - War Room Offline.');
    }
}

export const attackSystem = new AttackSystem();
