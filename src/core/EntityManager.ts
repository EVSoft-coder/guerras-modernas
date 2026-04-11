/**
 * EntityManager.ts
 * Gestor nuclear de identidades e componentes.
 */
export type EntityId = number;
 
export interface Component {
    type: string;
}
 
class EntityManager {
    private nextId: EntityId = 1;
    private entities: Set<EntityId> = new Set();
    private components: Map<string, Map<EntityId, Component>> = new Map();
 
    /**
     * Gera um novo ID de entidade único.
     */
    public createEntity(): EntityId {
        const id = this.nextId++;
        this.entities.add(id);
        return id;
    }
 
    /**
     * Remove uma entidade e todos os seus componentes do sistema.
     */
    public removeEntity(entityId: EntityId): void {
        this.entities.delete(entityId);
        this.components.forEach(compMap => compMap.delete(entityId));
    }
 
    /**
     * Associa um componente a uma entidade específica.
     */
    public addComponent(entityId: EntityId, component: Component): void {
        if (!this.components.has(component.type)) {
            this.components.set(component.type, new Map());
        }
        this.components.get(component.type)!.set(entityId, component);
    }
 
    /**
     * Obtém todas as entidades que possuem um determinado tipo de componente.
     */
    public getEntitiesWith(componentType: string): EntityId[] {
        const compMap = this.components.get(componentType);
        return compMap ? Array.from(compMap.keys()) : [];
    }
 
    /**
     * Obtém um componente específico de uma entidade.
     */
    public getComponent<T extends Component>(entityId: EntityId, componentType: string): T | undefined {
        return this.components.get(componentType)?.get(entityId) as T;
    }
}
 
export const entityManager = new EntityManager();
