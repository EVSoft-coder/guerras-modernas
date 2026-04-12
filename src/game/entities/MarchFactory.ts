/**
 * src/game/entities/MarchFactory.ts
 * Fábrica táctica para criação de entidades de marcha militar.
 */
import { entityManager, EntityId } from '../../core/EntityManager';
import { MarchComponent } from '../components/MarchComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';

export class MarchFactory {
    /**
     * Cria uma entidade de marcha no ECS.
     * Esta entidade representa um exército em movimento, separada das unidades individuais.
     */
    public static createMarch(data: {
        id: string,
        originX: number,
        originY: number,
        targetX: number,
        targetY: number,
        units: Record<string, number>,
        startTime: number,
        arrivalTime: number,
        returnTime: number,
        status: "going" | "returning" | "completed"
    }): EntityId {
        const entityId = entityManager.createEntity();
        
        // 1. Componente de Marcha (DADOS MESTRE)
        entityManager.addComponent(entityId, new MarchComponent(
            data.id,
            data.originX,
            data.originY,
            data.targetX,
            data.targetY,
            data.units,
            data.startTime,
            data.arrivalTime,
            data.returnTime,
            data.status
        ));

        // 2. Componente de Posição (Para renderização e detecção tática)
        // Inicializa na origem da marcha
        entityManager.addComponent(entityId, new GridPositionComponent(
            data.originX,
            data.originY,
            true
        ));

        // 3. Marcação de Tipo para o SyncSystem/Satélite
        entityManager.addComponent(entityId, { type: 'Army' });

        return entityId;
    }
}
