/**
 * src/game/entities/MarchFactory.ts
 * Fábrica táctica para criação de entidades de marcha militar.
 */
import { entityManager, EntityId } from '../../core/EntityManager';
import { MarchComponent } from '../components/MarchComponent';
import { GridPositionComponent } from '../components/GridPositionComponent';
import { unitStats } from '../config/unitStats';

export class MarchFactory {
    /**
     * Cria uma entidade de marcha no ECS com cálculo automático de navegação.
     */
    public static createMarch(data: {
        id: string,
        originX: number,
        originY: number,
        targetX: number,
        targetY: number,
        units: Record<string, number>,
        startTime: number,
        status: "going" | "returning" | "completed"
    }): EntityId {
        // 1. Cálculo de Distância (Geometria de Combate)
        const dx = data.targetX - data.originX;
        const dy = data.targetY - data.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 2. Cálculo da Velocidade Táctica (Limitada pela unidade mais lenta)
        let slowestSpeed = Infinity;
        for (const [unitType, count] of Object.entries(data.units)) {
            if (count > 0) {
                const speed = unitStats[unitType]?.speed || 10;
                if (speed < slowestSpeed) slowestSpeed = speed;
            }
        }
        if (slowestSpeed === Infinity) slowestSpeed = 10; // Fallback para infantaria base

        // 3. Modificador Táctico de Velocidade (Equivalente ao travel => 5 do servidor)
        const travelMultiplier = 5;
        const travelTimeSeconds = (distance / slowestSpeed) * (3600 / travelMultiplier);
        
        const arrivalTime = data.startTime + (travelTimeSeconds * 1000);
        const returnTime = arrivalTime + (travelTimeSeconds * 1000);

        const entityId = entityManager.createEntity();
        
        // 4. Componente de Marcha (DADOS MESTRE)
        entityManager.addComponent(entityId, new MarchComponent(
            data.id,
            data.originX,
            data.originY,
            data.targetX,
            data.targetY,
            data.units,
            data.startTime,
            arrivalTime,
            returnTime,
            data.status
        ));

        // 5. Componente de Posição (Para renderização)
        entityManager.addComponent(entityId, new GridPositionComponent(
            data.originX,
            data.originY,
            true
        ));

        // 6. Marcação de Tipo
        entityManager.addComponent(entityId, { type: 'Army' });

        return entityId;
    }
}
