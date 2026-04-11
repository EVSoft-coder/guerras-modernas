import React, { useState, useEffect } from 'react';
import { gameStateService } from '../../../src/services/GameStateService';
import { eventBus, Events } from '../../../src/core/EventBus';

/**
 * Hook para subscrever ao modo de jogo ECS.
 */
export function useGameMode() {
    const [mode, setMode] = useState(gameStateService.getGameMode());
    
    useEffect(() => {
        const unsub = eventBus.subscribe(Events.GAMEMODE_CHANGED, (p) => {
            setMode(p.data.mode);
        });
        return unsub;
    }, []);

    return mode;
}
