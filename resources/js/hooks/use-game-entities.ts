import { useState, useEffect } from 'react';
import { gameStateService } from '../../../src/services/GameStateService';

/**
 * Hook para obter entidades com posição do motor ECS.
 */
export function useGameEntities() {
    const [entities, setEntities] = useState(gameStateService.getGameState());

    useEffect(() => {
        const unsub = gameStateService.subscribe(() => {
            setEntities(gameStateService.getGameState());
        });
        return unsub;
    }, []);

    return entities;
}
