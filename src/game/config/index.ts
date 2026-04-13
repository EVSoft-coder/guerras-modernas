/**
 * src/game/config/index.ts
 * Centralized Game Configuration Hub
 */

import { buildingConfigs } from './buildingConfigs';
import { unitConfigs } from './unitConfigs';
import { globalSettings } from './globalSettings';

export {
    buildingConfigs,
    unitConfigs,
    globalSettings
};

export const GameConfig = {
    buildings: buildingConfigs,
    units: unitConfigs,
    settings: globalSettings
};
