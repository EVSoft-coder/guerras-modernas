import { entityManager } from '../../core/EntityManager';
import { eventBus, Events } from '../../core/EventBus';
import { GameSystem } from './types';
import { ArmyComponent } from '../components/ArmyComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { MarchComponent } from '../components/MarchComponent';

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
            
            if (march && march.status === 'going' && now >= march.arrivalTime) {
                console.log(`[WAR] CONTACT: Army ${armyId} reached objective at ${march.targetX}:${march.targetY}`);
                
                // Disparar resolução de combate
                eventBus.emit('ATTACK:RESOLVE', {
                    entityId: armyId,
                    timestamp: now,
                    data: { march }
                });

                // Mudar estado para evitar múltiplos disparos no mesmo frame
                march.status = 'completed'; // Será processado pelo CombatSystem para 'returning' ou 'destroyed'
            }
        }
    }

    private launchAttack(data: any): void {
        const { originX, originY, targetX, targetY, ownerId, troops } = data;

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
            'going'
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
