var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { z as eventBus, E as Events } from "./app-DGUcGMiV.js";
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
const buildingConfigs = {
  qg: {
    id: "qg",
    name: "Centro de Comando (QG)",
    cost: { suprimentos: 500, combustivel: 200, pessoal: 20 },
    timeBase: 120
  },
  muralha: {
    id: "muralha",
    name: "Perímetro Defensivo (Muralha)",
    cost: { suprimentos: 400, municoes: 200, pessoal: 5 },
    timeBase: 180
  },
  mina_suprimentos: {
    id: "mina_suprimentos",
    name: "Mina de Suprimentos",
    cost: { suprimentos: 200, combustivel: 50, pessoal: 10 },
    timeBase: 60
  },
  refinaria: {
    id: "refinaria",
    name: "Refinaria de Combustível",
    cost: { suprimentos: 300, municoes: 100, pessoal: 15 },
    timeBase: 90
  },
  fabrica_municoes: {
    id: "fabrica_municoes",
    name: "Fábrica de Munições",
    cost: { suprimentos: 250, combustivel: 100, pessoal: 12 },
    timeBase: 120
  },
  posto_recrutamento: {
    id: "posto_recrutamento",
    name: "Posto de Recrutamento",
    cost: { suprimentos: 400, combustivel: 50, municoes: 50, pessoal: 5 },
    timeBase: 150
  },
  quartel: {
    id: "quartel",
    name: "Quartel Regional",
    cost: { suprimentos: 600, combustivel: 200, municoes: 200, pessoal: 20 },
    timeBase: 300
  },
  aerodromo: {
    id: "aerodromo",
    name: "Aeródromo Militar",
    cost: { suprimentos: 1e3, combustivel: 800, municoes: 500, pessoal: 30 },
    timeBase: 600
  },
  radar_estrategico: {
    id: "radar_estrategico",
    name: "Radar de Longo Alcance",
    cost: { suprimentos: 1500, combustivel: 1200, municoes: 300, pessoal: 15 },
    timeBase: 900
  },
  centro_pesquisa: {
    id: "centro_pesquisa",
    name: "Centro de Pesquisa & I&D",
    cost: { suprimentos: 2e3, combustivel: 1e3, municoes: 1e3, pessoal: 40 },
    timeBase: 1200
  },
  mina_metal: {
    id: "mina_metal",
    name: "Mina de Metal Industrial",
    cost: { suprimentos: 500, combustivel: 300, pessoal: 20 },
    timeBase: 180
  },
  central_energia: {
    id: "central_energia",
    name: "Central de Energia Termoelétrica",
    cost: { suprimentos: 300, combustivel: 200, pessoal: 10 },
    timeBase: 120
  },
  parlamento: {
    id: "parlamento",
    name: "Parlamento & Diplomacia",
    cost: { suprimentos: 3e3, municoes: 2e3, pessoal: 10, combustivel: 500 },
    timeBase: 1800,
    requires: { qg: 10 }
  }
};
class GameStateService {
  constructor() {
    __publicField(this, "snapshots", []);
    __publicField(this, "globalState", {
      player: { name: "OPERATIVE", id: 1 },
      villages: [],
      resources: { suprimentos: 0, combustivel: 0, municoes: 0, metal: 0, energia: 0, pessoal: 0 },
      buildings: [],
      worldMapBases: [],
      rebelCount: 0
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
      const sprite = entityManager.getComponent(id, "Sprite");
      const health = entityManager.getComponent(id, "Health");
      const selection = entityManager.getComponent(id, "Selection");
      const res = entityManager.getComponent(id, "Resource");
      const march = entityManager.getComponent(id, "March");
      const army = entityManager.getComponent(id, "Army");
      const building = entityManager.getComponent(id, "Building");
      const village = entityManager.getComponent(id, "Village");
      const unit = entityManager.getComponent(id, "Unit");
      const player = entityManager.getComponent(id, "Player");
      let x = gridPos ? gridPos.x : 0;
      let y = gridPos ? gridPos.y : 0;
      if (march) {
        const now = Date.now();
        const total = march.arrivalTime - march.startTime;
        const elapsed = now - march.startTime;
        const progress = Math.min(1, Math.max(0, elapsed / (total || 1)));
        x = march.originX + (march.targetX - march.originX) * progress;
        y = march.originY + (march.targetY - march.originY) * progress;
      }
      newSnapshots.push({
        id,
        type: army ? "Army" : (building == null ? void 0 : building.buildingType) || (unit == null ? void 0 : unit.unitCategory) || (village ? "VILLAGE" : march ? "MARCH" : void 0),
        x,
        y,
        sprite: sprite == null ? void 0 : sprite.imagePath,
        health: health ? { current: health.value, max: health.max } : void 0,
        loyalty: village ? village.loyalty : void 0,
        isProtected: village ? village.isProtected : void 0,
        protectionUntil: village ? village.protectionUntil : void 0,
        isSelected: !!selection,
        status: march == null ? void 0 : march.status,
        ownerId: (village == null ? void 0 : village.ownerId) ?? (army == null ? void 0 : army.ownerId) ?? (march == null ? void 0 : march.ownerId) ?? (player ? id : void 0),
        name: (village == null ? void 0 : village.name) || (building == null ? void 0 : building.name) || (army ? `Task Force ${id}` : void 0),
        resources: res ? {
          suprimentos: res.suprimentos,
          combustivel: res.combustivel,
          municoes: res.municoes,
          metal: res.metal,
          energia: res.energia,
          pessoal: res.pessoal
        } : void 0,
        march: march ? {
          state: march.status,
          remainingTime: (march.arrivalTime - Date.now()) / 1e3,
          totalTime: (march.arrivalTime - march.startTime) / 1e3,
          target: { x: march.targetX, y: march.targetY },
          loot: march.units
        } : void 0
      });
    }
    this.snapshots = newSnapshots;
    this.updateGlobalSummary();
    this.notify();
  }
  updateGlobalSummary() {
    var _a;
    const buildingEntities = entityManager.getEntitiesWith(["Building"]);
    const resEntities = entityManager.getEntitiesWith(["Resource"]);
    const villageEntities = entityManager.getEntitiesWith(["Village", "GridPosition"]);
    let totalRes = { suprimentos: 0, combustivel: 0, municoes: 0, metal: 0, energia: 0, pessoal: 0 };
    resEntities.forEach((id) => {
      const r = entityManager.getComponent(id, "Resource");
      if (r) {
        totalRes.suprimentos += r.suprimentos || 0;
        totalRes.combustivel += r.combustivel || 0;
        totalRes.municoes += r.municoes || 0;
        totalRes.metal += r.metal || 0;
        totalRes.energia += r.energia || 0;
        totalRes.pessoal += r.pessoal || 0;
      }
    });
    const villageList = villageEntities.map((id) => {
      const v = entityManager.getComponent(id, "Village");
      const p = entityManager.getComponent(id, "GridPosition");
      return { id, name: (v == null ? void 0 : v.name) || "OUTPOST", x: (p == null ? void 0 : p.x) || 0, y: (p == null ? void 0 : p.y) || 0 };
    });
    const existingBuildings = buildingEntities.map((id) => {
      const b = entityManager.getComponent(id, "Building");
      return { type: (b == null ? void 0 : b.buildingType) || "STRUCTURE", level: (b == null ? void 0 : b.level) || 1, id };
    });
    const hydratedBuildings = Object.values(buildingConfigs).map((def) => {
      const existing = existingBuildings.find((eb) => eb.type.toLowerCase() === def.id.toLowerCase());
      return {
        type: def.id,
        level: existing ? existing.level : 0,
        id: existing ? existing.id : -(Math.random() * 1e3)
      };
    });
    const worldMapBases = villageEntities.map((id) => {
      const v = entityManager.getComponent(id, "Village");
      const p = entityManager.getComponent(id, "GridPosition");
      return {
        id,
        nome: (v == null ? void 0 : v.name) || "Setor Hostil",
        coordenada_x: Math.round((p == null ? void 0 : p.x) || 0),
        coordenada_y: Math.round((p == null ? void 0 : p.y) || 0),
        loyalty: (v == null ? void 0 : v.loyalty) || 100,
        ownerId: (v == null ? void 0 : v.ownerId) || null,
        is_protected: (v == null ? void 0 : v.isProtected) || false,
        protection_until: (v == null ? void 0 : v.protectionUntil) || 0
      };
    });
    const rebelCount = worldMapBases.filter((b) => !b.ownerId).length;
    this.globalState = {
      player: ((_a = this.globalState) == null ? void 0 : _a.player) ?? { name: "OPERATIVE", id: 1 },
      villages: villageList,
      resources: totalRes,
      buildings: hydratedBuildings,
      worldMapBases,
      rebelCount
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
    console.log(`[SYNC] Military Command: Synchronizing ${attacks.length} operations.`);
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
//# sourceMappingURL=GameStateService-BSPWq_34.js.map
