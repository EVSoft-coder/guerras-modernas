/**
 * types.ts
 * Definições de tipos para o motor de sistemas ECS.
 */
export interface GameSystem {
    init(): void;
    
    // Fases de Execução
    preUpdate(deltaTime: number): void;
    update(deltaTime: number): void;
    postUpdate(deltaTime: number): void;
    
    destroy(): void;
}
