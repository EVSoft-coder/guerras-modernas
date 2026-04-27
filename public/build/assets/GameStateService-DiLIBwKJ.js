var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { f as eventBus, E as Events, h as Logger } from "./app-CtviB7P3.js";
class EntityManager {
  constructor() {
    __publicField(this, "nextId", 1);
    // Estrutura interna consistente: entityId -> componentType -> component
    __publicField(this, "entities", /* @__PURE__ */ new Map());
  }
  /**
   * Gera um novo ID de entidade único.
   */
  createEntity(id) {
    const entityId = id ?? this.nextId++;
    if (!this.entities.has(entityId)) {
      this.entities.set(entityId, /* @__PURE__ */ new Map());
    }
    return entityId;
  }
  /**
   * Verifica se uma entidade existe no sistema.
   */
  hasEntity(entityId) {
    return this.entities.has(entityId);
  }
  /**
   * Remove uma entidade e todos os seus componentes do sistema.
   */
  removeEntity(entityId) {
    this.entities.delete(entityId);
  }
  /**
   * Associa um componente a uma entidade específica.
   */
  addComponent(entityId, component) {
    const entityComponents = this.entities.get(entityId);
    if (entityComponents) {
      entityComponents.set(component.type, component);
    }
  }
  /**
   * Remove um componente específico de uma entidade.
   */
  removeComponent(entityId, componentType) {
    const entityComponents = this.entities.get(entityId);
    if (entityComponents) {
      entityComponents.delete(componentType);
    }
  }
  /**
   * Obtém todas as entidades que possuem TODOS os componentes listados.
   * Suporta queries múltiplas: getEntitiesWith(["Position", "Velocity"])
   */
  getEntitiesWith(componentTypes) {
    const result = [];
    for (const [entityId, components] of this.entities) {
      const hasAll = componentTypes.every((type) => components.has(type));
      if (hasAll) {
        result.push(entityId);
      }
    }
    return result;
  }
  /**
   * Obtém um componente específico de uma entidade.
   */
  getComponent(entityId, type) {
    const entityComponents = this.entities.get(entityId);
    if (!entityComponents) return void 0;
    return entityComponents.get(type);
  }
  /**
   * Verifica se uma entidade possui um componente específico.
   */
  hasComponent(entityId, type) {
    const entityComponents = this.entities.get(entityId);
    return entityComponents ? entityComponents.has(type) : false;
  }
}
const entityManager = new EntityManager();
var GameState = /* @__PURE__ */ ((GameState2) => {
  GameState2["MENU"] = "MENU";
  GameState2["PLAYING"] = "PLAYING";
  GameState2["PAUSED"] = "PAUSED";
  GameState2["GAMEOVER"] = "GAMEOVER";
  return GameState2;
})(GameState || {});
var GameMode = /* @__PURE__ */ ((GameMode2) => {
  GameMode2["VILLAGE"] = "VILLAGE";
  GameMode2["WORLD_MAP"] = "WORLD_MAP";
  GameMode2["COMBAT"] = "COMBAT";
  GameMode2["LOADING"] = "LOADING";
  return GameMode2;
})(GameMode || {});
class StateManager {
  constructor() {
    __publicField(this, "currentMode", "VILLAGE");
    __publicField(this, "currentState", "MENU");
    __publicField(this, "isPaused", false);
  }
  /**
   * Define o estado operacional (Menu, Jogo, etc).
   */
  setState(state) {
    if (this.currentState === state) return;
    const oldState = this.currentState;
    this.currentState = state;
    eventBus.emit({
      type: Events.GAME_STATE_CHANGED,
      timestamp: Date.now(),
      data: { newState: state, oldState }
    });
  }
  getState() {
    return this.currentState;
  }
  /**
   * Define o modo de jogo atual e emite sinalização de transição.
   */
  setMode(mode) {
    if (this.currentMode === mode) return;
    const oldMode = this.currentMode;
    this.currentMode = mode;
    console.log(`[STATE_TRANSITION] ${oldMode} -> ${mode}`);
    eventBus.emit({
      type: Events.GAMEMODE_CHANGED,
      timestamp: Date.now(),
      data: { mode, previous: oldMode }
    });
  }
  getMode() {
    return this.currentMode;
  }
  /**
   * Controlo de fluxo temporal (Pause/Resume).
   */
  setPaused(paused) {
    this.isPaused = paused;
    eventBus.emit({
      type: paused ? Events.GAME_REQUEST_PAUSE : Events.GAME_REQUEST_RESUME,
      timestamp: Date.now(),
      data: { isPaused: paused }
    });
  }
  getPaused() {
    return this.isPaused;
  }
  /**
   * Sistema de Subversão e Conquista (Autoridade de Estado).
   */
  initConquestProcedures() {
    eventBus.subscribe("VILLAGE:LOYALTY_REDUCE", (payload) => {
      const { targetId, amount, attackerId } = payload;
      const village = entityManager.getComponent(targetId, "Village");
      if (village) {
        const oldLoyalty = village.loyalty;
        village.loyalty = Math.min(100, Math.max(0, village.loyalty - amount));
        if (oldLoyalty !== village.loyalty) {
          console.log(`[STATE] Sovereignty at risk in Sector ${targetId}. Loyalty: ${village.loyalty}%`);
          eventBus.emit("VILLAGE:UPDATE", { villageId: targetId });
        }
        if (village.loyalty <= 0) {
          this.executeConquest(targetId, attackerId);
        }
      }
    });
  }
  executeConquest(villageId, conquerorId) {
    const village = entityManager.getComponent(villageId, "Village");
    const army = entityManager.getComponent(villageId, "Army");
    if (village) {
      console.log(`[STATE] TERRITORY ANNEXED: Sector ${villageId} now under command of Player ${conquerorId}`);
      village.ownerId = conquerorId;
      village.loyalty = 100;
      village.isRebel = false;
      village.isProtected = true;
      village.protectionUntil = Date.now() + 15 * 60 * 1e3;
    }
    if (army) {
      army.units = {};
    }
    eventBus.emit("VILLAGE:CONQUERED", { villageId, ownerId: conquerorId });
    eventBus.emit("VILLAGE:UPDATE", { villageId });
  }
}
const stateManager = new StateManager();
stateManager.initConquestProcedures();
class GameStateService {
  constructor() {
    __publicField(this, "snapshots", []);
    __publicField(this, "globalState", {
      player: { name: "OPERATIVE", id: 1 },
      villages: [],
      worldMapBases: [],
      rebelCount: 0,
      revealedTiles: [],
      research: {}
    });
    __publicField(this, "listeners", []);
  }
  /**
   * Captures current state of all relevant entities from ECS.
   * Called by SyncSystem at the end of every frame.
   */
  snap() {
    const entities = entityManager.getEntitiesWith(["GridPosition"]);
    const marches = entityManager.getEntitiesWith(["March"]);
    const newSnapshots = [];
    const allIds = Array.from(/* @__PURE__ */ new Set([...entities, ...marches]));
    for (const id of allIds) {
      const gridPos = entityManager.getComponent(id, "GridPosition");
      if (gridPos && !gridPos.isVisible) continue;
      const march = entityManager.getComponent(id, "March");
      const army = entityManager.getComponent(id, "Army");
      const village = entityManager.getComponent(id, "Village");
      const unit = entityManager.getComponent(id, "Unit");
      let x = gridPos ? gridPos.x : 0;
      let y = gridPos ? gridPos.y : 0;
      let marchData = void 0;
      if (march) {
        const now = Date.now();
        const total = march.arrivalTime - march.startTime;
        const elapsed = now - march.startTime;
        const progress = Math.min(1, Math.max(0, elapsed / (total || 1)));
        x = march.originX + (march.targetX - march.originX) * progress;
        y = march.originY + (march.targetY - march.originY) * progress;
        marchData = {
          target: { x: march.targetX, y: march.targetY },
          remainingTime: Math.max(0, (march.arrivalTime - now) / 1e3)
        };
      }
      newSnapshots.push({
        id,
        type: army ? "Army" : (unit == null ? void 0 : unit.unitCategory) || (village ? "VILLAGE" : march ? "MARCH" : void 0),
        x,
        y,
        status: (army == null ? void 0 : army.status) || (march ? "em marcha" : "operacional"),
        march: marchData
      });
    }
    this.snapshots = newSnapshots;
    this.updateGlobalSummary();
    this.notify();
  }
  updateGlobalSummary() {
    var _a;
    const villageEntities = entityManager.getEntitiesWith(["Village", "GridPosition"]);
    const villageList = villageEntities.map((id) => {
      const v = entityManager.getComponent(id, "Village");
      const p = entityManager.getComponent(id, "GridPosition");
      return { id, name: (v == null ? void 0 : v.name) || "OUTPOST", x: (p == null ? void 0 : p.x) || 0, y: (p == null ? void 0 : p.y) || 0 };
    });
    const worldMapBases = villageEntities.map((id) => {
      const v = entityManager.getComponent(id, "Village");
      const p = entityManager.getComponent(id, "GridPosition");
      return {
        id: (v == null ? void 0 : v.dbId) || id,
        nome: (v == null ? void 0 : v.name) || "Setor Hostil",
        coordenada_x: Math.round((p == null ? void 0 : p.x) || 0),
        coordenada_y: Math.round((p == null ? void 0 : p.y) || 0),
        loyalty: (v == null ? void 0 : v.loyalty) || 100,
        ownerId: (v == null ? void 0 : v.ownerId) || null,
        aliancaId: (v == null ? void 0 : v.aliancaId) || null,
        is_protected: (v == null ? void 0 : v.isProtected) || false,
        protection_until: (v == null ? void 0 : v.protectionUntil) || 0
      };
    });
    this.globalState = {
      ...this.globalState,
      player: ((_a = this.globalState) == null ? void 0 : _a.player) ?? { name: "OPERATIVE", id: 1 },
      villages: villageList,
      worldMapBases,
      rebelCount: worldMapBases.filter((b) => !b.ownerId).length
    };
  }
  getGameState() {
    return this.snapshots;
  }
  getGlobalState() {
    return this.globalState;
  }
  updateGlobalState(data) {
    this.globalState = { ...this.globalState, ...data };
  }
  getGameMode() {
    return stateManager.getMode();
  }
  getMode() {
    return this.getGameMode();
  }
  setMode(mode) {
    stateManager.setMode(mode);
    this.notify();
  }
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  notify() {
    this.listeners.forEach((l) => l());
  }
  syncAttacks(attacks) {
    Logger.info(`[SYNC] Military Command: Synchronizing ${attacks.length} operations.`);
  }
}
const gameStateService = new GameStateService();
export {
  GameState as G,
  GameMode as a,
  entityManager as e,
  gameStateService as g,
  stateManager as s
};
//# sourceMappingURL=GameStateService-DiLIBwKJ.js.map
