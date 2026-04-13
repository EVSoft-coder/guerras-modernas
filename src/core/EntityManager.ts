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
    private entities: Map<EntityId, Map<string, Component>> = new Map();

    /**
     * Gera um novo ID de entidade único.
     */
    public createEntity(id?: EntityId): EntityId {
        const entityId = id ?? this.nextId++;
        if (!this.entities.has(entityId)) {
            this.entities.set(entityId, new Map());
        }
        return entityId;
    }

    /**
     * Verifica se uma entidade existe no sistema.
     */
    public hasEntity(entityId: EntityId): boolean {
        return this.entities.has(entityId);
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
    public getComponent<T extends Component>(entityId: EntityId, type: string): T | undefined {
        const entityComponents = this.entities.get(entityId);
        if (!entityComponents) return undefined;
        return entityComponents.get(type) as T;
    }

    /**
     * Verifica se uma entidade possui um componente específico.
     */
    public hasComponent(entityId: EntityId, type: string): boolean {
        const entityComponents = this.entities.get(entityId);
        return entityComponents ? entityComponents.has(type) : false;
    }
}
 
export const entityManager = new EntityManager();
