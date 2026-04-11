/**
 * src/game/entities/EntityManager.ts
 * GestÃ£o de Registos de Entidades e Componentes.
 */
import { PositionComponent, VelocityComponent, HealthComponent } from '../components/BaseComponents';
 
type Entity = number;
 
class EntityManager {
    private nextId: Entity = 1;
    private entities: Set<Entity> = new Set();
 
    // RepositÃ³rios de componentes (Silos de dados por tipo)
    public positions: Map<Entity, PositionComponent> = new Map();
    public velocities: Map<Entity, VelocityComponent> = new Map();
    public healths: Map<Entity, HealthComponent> = new Map();
 
    /**
     * Cria uma nova entidade vazia (ID apenas).
     */
    public createEntity(): Entity {
        const id = this.nextId++;
        this.entities.add(id);
        return id;
    }
 
    public removeEntity(id: Entity): void {
        this.entities.delete(id);
        this.positions.delete(id);
        this.velocities.delete(id);
        this.healths.delete(id);
    }
 
    public getAllEntities(): Entity[] {
        return Array.from(this.entities);
    }
}
 
export const entityManager = new EntityManager();
