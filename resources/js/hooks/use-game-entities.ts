import { useState, useEffect } from 'react';
import { gameStateService } from '../../../src/services/GameStateService';

/**
 * Hook para obter entidades com posição do motor ECS.
 */
export function useGameEntities() {
    const [state, setState] = useState({
        entities: gameStateService.getGameState(),
        globalState: gameStateService.getGlobalState()
    });

    useEffect(() => {
        const unsub = gameStateService.subscribe(() => {
            setState({
                entities: gameStateService.getGameState(),
                globalState: gameStateService.getGlobalState()
            });
        });
        return unsub;
    }, []);

    return state;
}
