/**
 * EntityManager.ts
 * Gestor nuclear reforçado de identidades e componentes.
 */
export type EntityId = number;
 
export interface Component {
    type: string;
}
 
class EntityManager {
    private nextId: EntityId = 1;
    // Estrutura interna consistente: entityId -> componentType -> component
    private entities: Map<EntityId, Map<string, any>> = new Map();
 
    /**
     * Gera um novo ID de entidade único.
     */
    public createEntity(): EntityId {
        const id = this.nextId++;
        this.entities.set(id, new Map());
        return id;
    }
 
    /**
     * Remove uma entidade e todos os seus componentes do sistema.
     */
    public removeEntity(entityId: EntityId): void {
        this.entities.delete(entityId);
    }
 
    /**
     * Associa um componente a uma entidade específica.
     */
    public addComponent(entityId: EntityId, component: Component): void {
        const entityComponents = this.entities.get(entityId);
        if (entityComponents) {
            entityComponents.set(component.type, component);
        }
    }
 
    /**
     * Remove um componente específico de uma entidade.
     */
    public removeComponent(entityId: EntityId, componentType: string): void {
        const entityComponents = this.entities.get(entityId);
        if (entityComponents) {
            entityComponents.delete(componentType);
        }
    }
 
    /**
     * Obtém todas as entidades que possuem TODOS os componentes listados.
     * Suporta queries múltiplas: getEntitiesWith(["Position", "Velocity"])
     */
    public getEntitiesWith(componentTypes: string[]): EntityId[] {
        const result: EntityId[] = [];
 
        for (const [entityId, components] of this.entities) {
            const hasAll = componentTypes.every(type => components.has(type));
            if (hasAll) {
                result.push(entityId);
            }
        }
 
        return result;
    }
 
    /**
     * Obtém um componente específico de uma entidade.
     */
    public getComponent<T extends Component>(entityId: EntityId, componentType: string): T | undefined {
        return this.entities.get(entityId)?.get(componentType) as T;
    }
}
 
export const entityManager = new EntityManager();
