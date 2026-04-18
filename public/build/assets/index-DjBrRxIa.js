var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { e as eventBus, E as Events, g as gameStateService, a as entityManager, L as Logger, S as Sr, s as stateManager, b as axios, r as resourceSystem, G as GameState, c as GameMode } from "./app-DJb9bg-j.js";
class InputSystem {
  constructor() {
    __publicField(this, "keys", {
      up: false,
      down: false,
      left: false,
      right: false
    });
  }
  init() {
    console.log("[SYSTEM] InputSystem - Continuous Sensors ONLINE.");
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }
  handleKeyDown(e) {
    this.updateKeyState(e.code, true);
    eventBus.emit({
      type: Events.INPUT_KEY_DOWN,
      timestamp: Date.now(),
      data: { code: e.code }
    });
  }
  handleKeyUp(e) {
    this.updateKeyState(e.code, false);
    eventBus.emit({
      type: Events.INPUT_KEY_UP,
      timestamp: Date.now(),
      data: { code: e.code }
    });
  }
  updateKeyState(code, isDown) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.up = isDown;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.down = isDown;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = isDown;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = isDown;
        break;
    }
  }
  preUpdate(dt) {
  }
  update(dt) {
    eventBus.emit({
      type: "PLAYER:INPUT_STATE",
      timestamp: Date.now(),
      data: { ...this.keys }
    });
  }
  postUpdate(dt) {
  }
  destroy() {
    console.log("[SYSTEM] InputSystem - Continuous Sensors OFFLINE.");
  }
}
const inputSystem = new InputSystem();
class GameModeSystem {
  constructor() {
    __publicField(this, "currentMode", "VILLAGE");
  }
  init() {
    console.log("GameModeSystem INIT");
    console.log(`[SYSTEM] GameModeSystem - Strategy Layer ONLINE. Initial Mode: ${this.currentMode}`);
    eventBus.subscribe("GAME:CHANGE_MODE", (payload) => {
      console.log("MODE CHANGE EVENT RECEIVED", payload);
      if (payload.data && payload.data.mode) {
        this.handleModeChange(payload.data.mode);
      }
    });
  }
  handleModeChange(newMode) {
    console.log("MODE CHANGED:", newMode);
    if (newMode !== "VILLAGE" && newMode !== "WORLD_MAP") {
      console.error(`[GAMEMODE_SYSTEM] Invalid mode requested: ${newMode}`);
      return;
    }
    if (this.currentMode === newMode) return;
    console.log(`[GAMEMODE_SYSTEM] Perspective shift: ${this.currentMode} -> ${newMode}`);
    this.currentMode = newMode;
    gameStateService.setMode(newMode);
  }
  getCurrentMode() {
    return this.currentMode;
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] GameModeSystem - Strategy Layer OFFLINE.");
  }
}
const gameModeSystem = new GameModeSystem();
class TimeSystem {
  constructor() {
    __publicField(this, "accumulator", 0);
    __publicField(this, "TICK_INTERVAL", 1);
  }
  // 1 segundo
  init() {
    console.log("[SYSTEM] TimeSystem - Global Clock ONLINE.");
  }
  preUpdate(dt) {
  }
  update(dt) {
    this.accumulator += dt;
    if (this.accumulator >= this.TICK_INTERVAL) {
      this.emitTick();
      this.accumulator -= this.TICK_INTERVAL;
    }
  }
  emitTick() {
    eventBus.emit({
      type: "GAME:TICK",
      timestamp: Date.now(),
      data: { deltaTime: this.TICK_INTERVAL }
    });
  }
  postUpdate(dt) {
  }
  destroy() {
    console.log("[SYSTEM] TimeSystem - Global Clock OFFLINE.");
  }
}
const timeSystem = new TimeSystem();
class TileComponent {
  constructor(x, y, tileType = "grass") {
    __publicField(this, "type", "Tile");
    this.x = x;
    this.y = y;
    this.tileType = tileType;
  }
}
class WorldSystem {
  constructor() {
    __publicField(this, "WORLD_SIZE", 100);
    // Grid 100x100
    __publicField(this, "chunkLoaded", /* @__PURE__ */ new Set());
  }
  init() {
    console.log(`[SYSTEM] WorldSystem - Global Grid Initialized (${this.WORLD_SIZE}x${this.WORLD_SIZE}).`);
    this.generateEssentialSectors();
  }
  generateEssentialSectors() {
    for (let y = 0; y < this.WORLD_SIZE; y++) {
      for (let x = 0; x < this.WORLD_SIZE; x++) {
        const biome = this.getBiomeAt(x, y);
        this.createTile(x, y, biome);
      }
    }
    this.createTile(50, 50, "resource");
    this.createTile(52, 52, "resource");
  }
  getBiomeAt(x, y) {
    if (y < 5 || y > 94 || x < 5 || x > 94) return "water";
    const noise = (Math.sin(x * 0.12) + Math.cos(y * 0.15) + Math.sin(x * 0.3 + y * 0.2)) / 3;
    if (noise > 0.5) return "mountain";
    if (noise < -0.4) return "desert";
    if (noise < -0.6) return "water";
    return "grass";
  }
  createTile(x, y, type) {
    const key = `${x}:${y}`;
    if (this.chunkLoaded.has(key)) return;
    const tileEntity = entityManager.createEntity();
    entityManager.addComponent(tileEntity, new TileComponent(x, y, type));
    this.chunkLoaded.add(key);
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] WorldSystem - Geography Halted.");
  }
}
const worldSystem = new WorldSystem();
class BuildQueueComponent {
  constructor(queue = []) {
    __publicField(this, "type", "BuildQueue");
    this.queue = queue;
  }
}
class BuildQueueSystem {
  init() {
    console.log("[SYSTEM] BuildQueueSystem - Logistics Core ONLINE.");
    eventBus.subscribe(Events.BUILDING_UPGRADE_REQUEST, (payload) => {
      this.handleUpgradeRequest(payload);
    });
  }
  handleUpgradeRequest(payload) {
    const buildingId = payload.data.id;
    if (buildingId === void 0) return;
    const building = entityManager.getComponent(buildingId, "Building");
    if (!building) return;
    const ownerId = 1;
    const resources = entityManager.getComponent(ownerId, "Resource");
    const buildQueue = entityManager.getComponent(ownerId, "BuildQueue");
    if (!resources || !buildQueue) {
      console.error(`[BUILD_SYSTEM] Owner ${ownerId} missing Resource or BuildQueue components.`);
      return;
    }
    const cost = building.level * 250;
    const hasEnough = resources.suprimentos >= cost && resources.metal >= cost && resources.energia >= cost;
    if (hasEnough) {
      const upgradeTime = building.level * 10;
      buildQueue.queue.push({
        type: "UPGRADE",
        buildingType: building.buildingType,
        targetEntityId: buildingId,
        totalTime: upgradeTime,
        remainingTime: upgradeTime
      });
      console.log(`[BUILD_SYSTEM] Upgrade of ${building.buildingType} (LVL ${building.level} -> ${building.level + 1}) initiated.`);
      eventBus.emit({
        type: Events.BUILDING_REQUEST,
        entityId: ownerId,
        timestamp: Date.now(),
        data: { status: "STARTED", buildingId }
      });
    } else {
      console.warn(`[BUILD_SYSTEM] Insufficient resources for upgrade of ${building.buildingType}. Required: ${cost}`);
    }
  }
  update(deltaTime) {
    const builders = entityManager.getEntitiesWith(["BuildQueue"]);
    for (const id of builders) {
      const bq = entityManager.getComponent(id, "BuildQueue");
      if (bq && bq.queue.length > 0) {
        const task = bq.queue[0];
        task.remainingTime -= deltaTime;
        if (task.remainingTime <= 0) {
          bq.queue.shift();
          this.completeTask(task);
        }
      }
    }
  }
  completeTask(task) {
    if (task.type === "UPGRADE" && task.targetEntityId !== void 0) {
      const building = entityManager.getComponent(task.targetEntityId, "Building");
      if (building) {
        console.log(`[BUILD_SYSTEM] Building ${building.buildingType} upgraded logic handled by backend.`);
        eventBus.emit({
          type: Events.BUILDING_COMPLETED,
          entityId: task.targetEntityId,
          timestamp: Date.now(),
          data: { buildingType: task.buildingType, newLevel: building.level }
        });
      }
    }
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] BuildQueueSystem - Logistics Core OFFLINE.");
  }
}
const buildQueueSystem = new BuildQueueSystem();
class HealthComponent {
  constructor(value = 100, max = 100) {
    __publicField(this, "type", "Health");
    this.value = value;
    this.max = max;
  }
}
class SpriteComponent {
  constructor(imagePath) {
    __publicField(this, "type", "Sprite");
    this.imagePath = imagePath;
  }
}
class AttackComponent {
  constructor(power = 10, range = 50, cooldown = 1, lastAttack = 0) {
    __publicField(this, "type", "Attack");
    this.power = power;
    this.range = range;
    this.cooldown = cooldown;
    this.lastAttack = lastAttack;
  }
}
class AIComponent {
  constructor(behavior = "AGGRESSIVE") {
    __publicField(this, "type", "AI");
    this.behavior = behavior;
  }
}
class TargetComponent {
  constructor(x, y) {
    __publicField(this, "type", "Target");
    this.x = x;
    this.y = y;
  }
}
class SelectionComponent {
  constructor(isSelected = true) {
    __publicField(this, "type", "Selection");
    this.isSelected = isSelected;
  }
}
class OrderSystem {
  init() {
    console.log("[SYSTEM] OrderSystem - Tactical Downlink ACTIVE.");
    window.addEventListener("mousedown", this.handleMouseClick.bind(this));
    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
  }
  handleMouseClick(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    if (e.button === 0) {
      this.processSelection(mouseX, mouseY);
    } else if (e.button === 2) {
      this.processMoveOrder(mouseX, mouseY);
    }
  }
  processSelection(x, y) {
    const entities = entityManager.getEntitiesWith(["GridPosition", "Sprite"]);
    let found = false;
    const selected = entityManager.getEntitiesWith(["Selection"]);
    selected.forEach((id) => entityManager.removeComponent(id, "Selection"));
    for (const id of entities) {
      const pos = entityManager.getComponent(id, "GridPosition");
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (dist < 40) {
        entityManager.addComponent(id, new SelectionComponent());
        eventBus.emit({
          type: Events.PLAYER_UNIT_SELECTED,
          entityId: id,
          timestamp: Date.now(),
          data: { x: pos.x, y: pos.y }
        });
        found = true;
        break;
      }
    }
    if (!found) {
      eventBus.emit({
        type: Events.PLAYER_SELECTION_CLEARED,
        timestamp: Date.now(),
        data: {}
      });
    }
  }
  processMoveOrder(x, y) {
    const selected = entityManager.getEntitiesWith(["Selection", "GridPosition"]);
    selected.forEach((id) => {
      entityManager.addComponent(id, new TargetComponent(x, y));
      eventBus.emit({
        type: Events.PLAYER_MOVE_ORDER,
        entityId: id,
        timestamp: Date.now(),
        data: { targetX: x, targetY: y }
      });
    });
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    window.removeEventListener("mousedown", this.handleMouseClick);
    console.log("[SYSTEM] OrderSystem - Tactical Downlink Offline.");
  }
}
const orderSystem = new OrderSystem();
class AISystem {
  init() {
    console.log("[SYSTEM] AISystem - Decision Engine ACTIVE.");
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
    const aiUnits = entityManager.getEntitiesWith(["AI", "GridPosition", "Unit"]);
    const allVillages = entityManager.getEntitiesWith(["Village", "GridPosition"]);
    const allUnits = entityManager.getEntitiesWith(["Unit", "GridPosition"]);
    for (const unitId of aiUnits) {
      const aiComp = entityManager.getComponent(unitId, "AI");
      const pos = entityManager.getComponent(unitId, "GridPosition");
      const vel = entityManager.getComponent(unitId, "Velocity");
      const army = entityManager.getComponent(unitId, "Army");
      if (!pos || !aiComp || vel && vel.isMoving) continue;
      const enemyUnit2 = this.findNearestTarget(unitId, pos, allUnits, (id) => {
        const otherArmy = entityManager.getComponent(id, "Army");
        return otherArmy && otherArmy.ownerId !== (army == null ? void 0 : army.ownerId);
      });
      if (enemyUnit2 && enemyUnit2.distance < 12) {
        this.commandMove(unitId, vel, enemyUnit2.pos);
        console.log(`[AI] DEFENSE: Unit ${unitId} intercepting hostile at ${enemyUnit2.pos.x}:${enemyUnit2.pos.y}`);
        continue;
      }
      if (aiComp.behavior === "AGGRESSIVE") {
        const enemyVillage = this.findNearestTarget(unitId, pos, allVillages, (id) => {
          const village = entityManager.getComponent(id, "Village");
          return village && village.ownerId !== (army == null ? void 0 : army.ownerId);
        });
        if (enemyVillage && enemyVillage.distance < 40) {
          this.commandMove(unitId, vel, enemyVillage.pos);
          console.log(`[AI] OFFENSIVE: Unit ${unitId} launching raid on village at ${enemyVillage.pos.x}:${enemyVillage.pos.y}`);
        }
      }
    }
  }
  findNearestTarget(id, pos, targets, filter) {
    let nearestDist = Infinity;
    let targetPos = null;
    for (const targetId of targets) {
      if (targetId === id || !filter(targetId)) continue;
      const tPos = entityManager.getComponent(targetId, "GridPosition");
      if (!tPos) continue;
      const dist = Math.sqrt(Math.pow(tPos.x - pos.x, 2) + Math.pow(tPos.y - pos.y, 2));
      if (dist < nearestDist) {
        nearestDist = dist;
        targetPos = tPos;
      }
    }
    return targetPos ? { pos: targetPos, distance: nearestDist } : null;
  }
  commandMove(id, vel, target) {
    var _a;
    if (!vel) return;
    const path = (_a = window.Pathfinding) == null ? void 0 : _a.findPath(
      { x: vel.x, y: vel.y },
      { x: target.x, y: target.y },
      () => true
    );
    if (path) {
      vel.path = path;
      vel.isMoving = true;
    }
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] AISystem - Decision Engine SUSPENDED.");
  }
}
const aiSystem = new AISystem();
class Pathfinding {
  /**
   * Calcula o caminho otimizado entre dois pontos.
   * @param start Coordenadas iniciais {x, y}
   * @param end Coordenadas de destino {x, y}
   * @param isWalkable FunÃ§Ã£o de validaÃ§Ã£o de terreno
   */
  static findPath(start, end, isWalkable) {
    const openList = [];
    const closedList = /* @__PURE__ */ new Set();
    const startNode = {
      x: Math.round(start.x),
      y: Math.round(start.y),
      g: 0,
      h: this.heuristic(start, end),
      f: 0
    };
    startNode.f = startNode.h;
    openList.push(startNode);
    while (openList.length > 0) {
      let currentIndex = 0;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i].f < openList[currentIndex].f) {
          currentIndex = i;
        }
      }
      const current = openList[currentIndex];
      if (current.x === Math.round(end.x) && current.y === Math.round(end.y)) {
        return this.reconstructPath(current);
      }
      openList.splice(currentIndex, 1);
      closedList.add(`${current.x}:${current.y}`);
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (closedList.has(`${neighbor.x}:${neighbor.y}`) || !isWalkable(neighbor.x, neighbor.y)) {
          continue;
        }
        const gScore = current.g + 1;
        let bestG = false;
        let openNode = openList.find((n) => n.x === neighbor.x && n.y === neighbor.y);
        if (!openNode) {
          bestG = true;
          neighbor.h = this.heuristic(neighbor, end);
          openList.push(neighbor);
        } else if (gScore < openNode.g) {
          bestG = true;
        }
        if (bestG) {
          neighbor.parent = current;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
    return null;
  }
  static heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  static getNeighbors(node) {
    const neighbors = [];
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];
    for (const dir of dirs) {
      neighbors.push({
        x: node.x + dir.x,
        y: node.y + dir.y,
        g: 0,
        h: 0,
        f: 0
      });
    }
    return neighbors;
  }
  static reconstructPath(node) {
    const path = [];
    let curr = node;
    while (curr) {
      path.push({ x: curr.x, y: curr.y });
      curr = curr.parent;
    }
    return path.reverse();
  }
}
class MovementSystem {
  constructor() {
    __publicField(this, "speed", 3);
  }
  // Velocidade tÃ¡ctica
  init() {
    Logger.info("[SYSTEM] MovementSystem - Tactical Navigation (A*) ONLINE.");
    eventBus.subscribe("UNIT:MOVE", (payload) => {
      this.handleMoveOrder(payload.data);
    });
  }
  /**
   * Calcula o tempo tático de marcha baseado em distância física e velocidade operacional.
   */
  calculateMarchTime(origin, target, unitSpeed) {
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const calcSpeed = unitSpeed || this.speed;
    return distance / calcSpeed * 10;
  }
  handleMoveOrder(data) {
    const { targetX, targetY } = data;
    const selectedEntities = entityManager.getEntitiesWith(["Selection", "GridPosition", "Velocity"]);
    selectedEntities.forEach((id) => {
      const pos = entityManager.getComponent(id, "GridPosition");
      const vel = entityManager.getComponent(id, "Velocity");
      if (pos && vel) {
        const path = Pathfinding.findPath(
          { x: pos.x, y: pos.y },
          { x: targetX, y: targetY },
          (x, y) => this.isWalkable(x, y)
        );
        if (path && path.length > 0) {
          vel.path = path;
          vel.isMoving = true;
          Logger.info(`Unit ${id} path calculated: ${path.length} waypoints.`);
        } else {
          Logger.warn(`Unit ${id} could not find path to ${targetX}:${targetY}`);
        }
      }
    });
  }
  isWalkable(x, y) {
    return x >= 0 && x < 1e3 && y >= 0 && y < 1e3;
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
    const entities = entityManager.getEntitiesWith(["GridPosition", "Velocity"]);
    for (const entityId of entities) {
      const pos = entityManager.getComponent(entityId, "GridPosition");
      const vel = entityManager.getComponent(entityId, "Velocity");
      if (pos && vel && vel.isMoving && vel.path && vel.path.length > 0) {
        const nextPoint = vel.path[0];
        if (!nextPoint || nextPoint.x === void 0 || nextPoint.y === void 0) {
          vel.path.shift();
          if (vel.path.length === 0) vel.isMoving = false;
          continue;
        }
        const dx = nextPoint.x - pos.x;
        const dy = nextPoint.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.1) {
          pos.x = nextPoint.x;
          pos.y = nextPoint.y;
          vel.path.shift();
          if (vel.path.length === 0) {
            vel.isMoving = false;
            vel.vx = 0;
            vel.vy = 0;
          }
        } else {
          const unit = entityManager.getComponent(entityId, "Unit");
          const baseSpeed = (unit == null ? void 0 : unit.speed) || this.speed;
          const speedBonus = (unit == null ? void 0 : unit.speedBonus) || 1;
          const currentSpeed = baseSpeed * speedBonus;
          const vx = dx / distance * currentSpeed;
          const vy = dy / distance * currentSpeed;
          pos.x += vx * deltaTime;
          pos.y += vy * deltaTime;
          vel.vx = vx;
          vel.vy = vy;
        }
      }
    }
    const marchEntities = entityManager.getEntitiesWith(["March", "GridPosition"]);
    const now = Date.now();
    for (const mId of marchEntities) {
      const march = entityManager.getComponent(mId, "March");
      const pos = entityManager.getComponent(mId, "GridPosition");
      if (march && pos && march.status !== "completed") {
        if (march.status === "going") {
          const duration = march.arrivalTime - march.startTime;
          if (duration > 0) {
            const progress = Math.min(1, Math.max(0, (now - march.startTime) / duration));
            pos.x = march.originX + (march.targetX - march.originX) * progress;
            pos.y = march.originY + (march.targetY - march.originY) * progress;
          }
        } else if (march.status === "returning") {
          const duration = march.returnTime - march.arrivalTime;
          if (duration > 0) {
            const progress = Math.min(1, Math.max(0, (now - march.arrivalTime) / duration));
            pos.x = march.targetX + (march.originX - march.targetX) * progress;
            pos.y = march.targetY + (march.originY - march.targetY) * progress;
          }
        }
      }
    }
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    Logger.info("[SYSTEM] MovementSystem - Tactical Navigation OFFLINE.");
  }
}
const movementSystem = new MovementSystem();
const unitConfigs = {
  infantaria: {
    id: "infantaria",
    name: "Infantaria de Assalto",
    cost: { suprimentos: 100, municoes: 20, pessoal: 1 },
    time: 30,
    attack: 10,
    defenseGeneral: 15,
    defenseArmored: 5,
    speed: 10,
    capacity: 20
  },
  blindado_apc: {
    id: "blindado_apc",
    name: "Transporte APC",
    cost: { suprimentos: 300, combustivel: 100, municoes: 50, pessoal: 2 },
    time: 120,
    attack: 20,
    defenseGeneral: 40,
    defenseArmored: 30,
    speed: 25,
    capacity: 100
  },
  tanque_combate: {
    id: "tanque_combate",
    name: "Tanque de Combate (MBT)",
    cost: { suprimentos: 800, combustivel: 300, municoes: 200, pessoal: 4 },
    time: 600,
    attack: 150,
    defenseGeneral: 100,
    defenseArmored: 120,
    speed: 20,
    capacity: 50
  },
  helicoptero_ataque: {
    id: "helicoptero_ataque",
    name: "Helicóptero Apache",
    cost: { suprimentos: 1500, combustivel: 800, municoes: 500, pessoal: 2 },
    time: 1800,
    attack: 300,
    defenseGeneral: 50,
    defenseArmored: 40,
    speed: 60,
    capacity: 0
  },
  agente_espiao: {
    id: "agente_espiao",
    name: "Agente de Inteligência",
    cost: { suprimentos: 500, combustivel: 100, municoes: 50, pessoal: 1 },
    time: 600,
    attack: 0,
    defenseGeneral: 1,
    defenseArmored: 1,
    speed: 80,
    capacity: 0,
    isSpy: true
  },
  drone_recon: {
    id: "drone_recon",
    name: "Drone de Reconhecimento",
    cost: { suprimentos: 400, combustivel: 200, pessoal: 1 },
    time: 300,
    attack: 0,
    defenseGeneral: 5,
    defenseArmored: 2,
    speed: 120,
    capacity: 0,
    isDrone: true
  },
  politico: {
    id: "politico",
    name: "Comissário Político",
    cost: { suprimentos: 2e3, municoes: 100, pessoal: 5 },
    time: 1200,
    attack: 1,
    defenseGeneral: 2,
    defenseArmored: 0,
    speed: 5,
    capacity: 0,
    requires: { parlamento: 1 },
    canConquer: true
  }
};
class CombatSystem {
  init() {
    Logger.info("CombatSystem - Engagement Protocols ONLINE.");
    eventBus.subscribe(Events.ATTACK_RESOLVE, (payload) => {
      const { entityId, data } = payload;
      if (entityId !== void 0) {
        this.handleAttackResolve(entityId, data.march);
      }
    });
  }
  handleAttackResolve(armyId, march) {
    const army = entityManager.getComponent(armyId, "Army");
    if (!army) return;
    const targetBases = entityManager.getEntitiesWith(["Village", "GridPosition"]);
    let targetId = null;
    for (const baseId of targetBases) {
      const pos = entityManager.getComponent(baseId, "GridPosition");
      if (pos && pos.x === march.targetX && pos.y === march.targetY) {
        targetId = baseId;
        break;
      }
    }
    if (targetId) {
      const village = entityManager.getComponent(targetId, "Village");
      if (village) {
        this.executeRaid(armyId, army, targetId, village);
      }
    } else {
      Logger.info(`Empty Sector Engage at ${march.targetX}:${march.targetY}. Returning.`);
      const marchComp = entityManager.getComponent(armyId, "March");
      if (marchComp) {
        marchComp.status = "returning";
        marchComp.startTime = Date.now();
      }
    }
  }
  update(deltaTime) {
  }
  executeRaid(armyId, army, targetId, village) {
    console.log(`[COMBAT] STRATEGIC ENGAGEMENT: Army ${armyId} vs Base ${targetId}`);
    let totalAttack = 0;
    let carryCapacity = 0;
    for (const [unitType, qty] of Object.entries(army.units)) {
      const stats = unitConfigs[unitType];
      if (stats) {
        totalAttack += stats.attack * qty;
        carryCapacity += stats.capacity * qty;
      }
    }
    let totalDefense = village.level * 200 + 500;
    const villageArmy = entityManager.getComponent(targetId, "Army");
    if (villageArmy) {
      for (const [type, qty] of Object.entries(villageArmy.units)) {
        const stats = unitConfigs[type];
        if (stats) totalDefense += stats.defenseGeneral * qty;
      }
    }
    const attackerWins = totalAttack > totalDefense;
    Logger.info(`FORCES: ATK(${totalAttack}) vs DEF(${totalDefense}) | Success: ${attackerWins}`);
    const lossFactor = attackerWins ? 0.15 : 0.7;
    const attackerQtyBefore = Object.values(army.units).reduce((a, b) => a + b, 0);
    for (const type in army.units) {
      army.units[type] = Math.floor(army.units[type] * (1 - lossFactor));
    }
    const attackerQtyAfter = Object.values(army.units).reduce((a, b) => a + b, 0);
    const lossesQty = attackerQtyBefore - attackerQtyAfter;
    const marchComp = entityManager.getComponent(armyId, "March");
    if (attackerWins && marchComp) {
      const loot = {};
      let totalLooted = 0;
      const resourceOrder = ["suprimentos", "combustivel", "metal", "municoes", "energia", "pessoal"];
      for (const res of resourceOrder) {
        if (totalLooted >= carryCapacity) break;
        const available = village.resources[res] || 0;
        const canTake = Math.min(available, carryCapacity - totalLooted);
        if (canTake > 0) {
          loot[res] = Math.floor(canTake);
          totalLooted += canTake;
        }
      }
      marchComp.loot = loot;
      army.loot = { ...army.loot, ...loot };
      console.log(`[COMBAT] VICTORY! Resources captured: ${totalLooted} units. Losses: ${lossesQty}`);
      this.saveBattleReport(army.ownerId, village.ownerId, attackerWins, {
        losses: lossesQty,
        loot,
        units_at_impact: army.units,
        base_target_id: targetId
      });
      const hasPolitico = army.units["politico"] && army.units["politico"] > 0;
      if (hasPolitico) {
        const reduction = Math.floor(Math.random() * (35 - 20 + 1)) + 20;
        eventBus.emit("VILLAGE:LOYALTY_REDUCE", {
          targetId,
          amount: reduction,
          attackerId: army.ownerId
        });
        console.log(`[COMBAT] POLITICAL SUBVERSION: Base ${targetId} being influenced by Politico. Reduction: ${reduction}%`);
      }
      if (village.isRebel && marchComp.missionType !== "conquista") {
        console.log(`[COMBAT] REBEL OUTPOST NEUTRALIZED: Entity ${targetId} removed from world.`);
        entityManager.removeEntity(targetId);
      }
    } else if (marchComp) {
      this.saveBattleReport(army.ownerId, village.ownerId, false, {
        losses: lossesQty,
        loot: {},
        units_at_impact: army.units,
        base_target_id: targetId
      });
    }
    eventBus.emit("COMBAT:RESULT", {
      vitoria: attackerWins,
      losses: lossesQty,
      loot: attackerWins ? Object.values(marchComp.loot || {}).reduce((a, b) => a + b, 0) : 0,
      targetId
    });
    if (marchComp) {
      const livingTroops = Object.values(army.units).reduce((a, b) => a + b, 0);
      if (livingTroops <= 0) {
        console.log(`[COMBAT] TOTAL ANNIHILATION: Army ${armyId} destroyed.`);
        entityManager.removeEntity(armyId);
      } else {
        marchComp.status = "returning";
        const now = Date.now();
        const tripDuration = marchComp.arrivalTime - marchComp.startTime;
        marchComp.startTime = now;
        marchComp.arrivalTime = now + tripDuration;
        marchComp.returnTime = now + tripDuration;
        console.log(`[COMBAT] RETREAT: Survivors returning to origin. ETA: ${(tripDuration / 1e3).toFixed(1)}s`);
      }
    }
  }
  saveBattleReport(attacker, defender, vitoria, dados) {
    var _a;
    const csrfToken = (_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content;
    fetch("/api/relatorios/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken || ""
      },
      body: JSON.stringify({
        atacante_id: attacker,
        defensor_id: defender,
        vitoria,
        dados
      })
    }).then((res) => res.json()).then((data) => console.log("[INTEL] Battle Report Archived:", data.id)).catch((err) => console.error("[INTEL] Failed to archive battle report:", err));
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] CombatSystem - Engagement Protocols OFFLINE.");
  }
}
const combatSystem = new CombatSystem();
class AttackSystem {
  init() {
    console.log("[SYSTEM] AttackSystem - Combat Resolution Protocols READY.");
    eventBus.subscribe(Events.ATTACK_ARRIVED, (payload) => {
      if (payload.entityId === void 0) return;
      this.resolveCombat(payload.entityId, payload.data.march);
    });
    eventBus.subscribe(Events.ATTACK_RETURNED, (payload) => {
      if (payload.entityId === void 0) return;
      this.reintegrateTroops(payload.entityId, payload.data.march);
    });
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
  }
  resolveCombat(armyId, march) {
    console.group(`[COMBAT_RESOLUTION] MSN: ${march.id}`);
    console.log(`Resolving engagement at [${march.targetX}:${march.targetY}]`);
    eventBus.emit(Events.ATTACK_RESOLVE, {
      entityId: armyId,
      timestamp: Date.now(),
      data: { march }
    });
    console.groupEnd();
  }
  /**
   * Reintegra sobreviventes e espólio na vila de origem.
   */
  reintegrateTroops(armyId, march) {
    const villages = entityManager.getEntitiesWith(["Village", "GridPosition"]);
    let originId = null;
    for (const vId of villages) {
      const pos = entityManager.getComponent(vId, "GridPosition");
      if (pos && pos.x === march.originX && pos.y === march.originY) {
        originId = vId;
        break;
      }
    }
    if (originId) {
      const village = entityManager.getComponent(originId, "Village");
      const resources = entityManager.getComponent(originId, "Resource");
      if (village && resources) {
        console.log(`[WAR] REINTEGRATION: Mission ${march.id} processed at Sector ${originId}.`);
        Sr.reload({ only: ["base", "gameData"] });
        eventBus.emit("VILLAGE:UPDATE", { villageId: originId });
      }
    }
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] AttackSystem - Tactical Ops Terminated.");
  }
}
const attackSystem = new AttackSystem();
class MarchComponent {
  constructor(id, originX, originY, targetX, targetY, units, startTime, arrivalTime, returnTime, status, missionType = "ataque", ownerId = 0, loot = {}) {
    __publicField(this, "type", "March");
    this.id = id;
    this.originX = originX;
    this.originY = originY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.units = units;
    this.startTime = startTime;
    this.arrivalTime = arrivalTime;
    this.returnTime = returnTime;
    this.status = status;
    this.missionType = missionType;
    this.ownerId = ownerId;
    this.loot = loot;
  }
}
class GridPositionComponent {
  constructor(x = 0, y = 0, isVisible = true) {
    __publicField(this, "type", "GridPosition");
    this.x = x;
    this.y = y;
    this.isVisible = isVisible;
  }
}
class ArmyComponent {
  constructor(ownerId, units = {}, targetId, loot = {
    suprimentos: 0,
    combustivel: 0,
    municoes: 0,
    pessoal: 0,
    metal: 0,
    energia: 0
  }) {
    __publicField(this, "type", "Army");
    this.ownerId = ownerId;
    this.units = units;
    this.targetId = targetId;
    this.loot = loot;
  }
}
class MarchSystem {
  init() {
    Logger.info("[SYSTEM] MarchSystem - Logistics Engine ONLINE.");
    eventBus.subscribe(Events.ATTACK_LAUNCH, (payload) => {
      this.createMarch(payload.data);
    });
  }
  update(deltaTime) {
    const now = Date.now();
    const marchEntities = entityManager.getEntitiesWith(["March"]);
    for (const entityId of marchEntities) {
      const march = entityManager.getComponent(entityId, "March");
      if (!march) continue;
      if (march.status === "going" && now >= march.arrivalTime) {
        Logger.building("MARCH_ARRIVAL", { id: entityId, target: `${march.targetX}:${march.targetY}` });
        eventBus.emit(Events.ATTACK_ARRIVED, {
          entityId,
          timestamp: now,
          data: { march }
        });
        march.status = "completed";
      }
      if (march.status === "returning" && now >= march.returnTime) {
        Logger.building("MARCH_RETURNED", { id: entityId, origin: `${march.originX}:${march.originY}` });
        eventBus.emit(Events.ATTACK_RETURNED, {
          entityId,
          timestamp: now,
          data: { march }
        });
        entityManager.removeEntity(entityId);
      }
    }
  }
  createMarch(data) {
    const { originX, originY, targetX, targetY, ownerId, troops, tipo } = data;
    const missionId = `MSN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const entityId = entityManager.createEntity();
    entityManager.addComponent(entityId, new ArmyComponent(ownerId, troops));
    entityManager.addComponent(entityId, new GridPositionComponent(originX, originY, true));
    const dx = targetX - originX;
    const dy = targetY - originY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let baseSpeed = 10;
    const travelMultiplier = 5;
    const travelTimeMs = distance / baseSpeed * (3600 / travelMultiplier) * 1e3;
    entityManager.addComponent(entityId, new MarchComponent(
      missionId,
      originX,
      originY,
      targetX,
      targetY,
      troops,
      Date.now(),
      Date.now() + (travelTimeMs || 5e3),
      // Min 5s for debug visibility
      Date.now() + (travelTimeMs || 5e3) * 2,
      "going",
      tipo || "ataque",
      ownerId
    ));
    entityManager.addComponent(entityId, { type: "Army" });
    Logger.info(`[MARCH] DEPLOYED: Mission ${missionId} for Entity ${entityId}. ETA: ${((travelTimeMs || 5e3) / 1e3).toFixed(1)}s`);
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
  }
}
const marchSystem = new MarchSystem();
class VisionSystem {
  init() {
    console.log("[SYSTEM] VisionSystem - SIGINT Online.");
  }
  update(deltaTime) {
    const visionEntities = entityManager.getEntitiesWith(["Vision", "GridPosition", "Player"]);
    const allEntities = entityManager.getEntitiesWith(["GridPosition"]);
    for (const id of allEntities) {
      const pos = entityManager.getComponent(id, "GridPosition");
      if (pos) {
        pos.isVisible = false;
      }
    }
    for (const viewerId of visionEntities) {
      const viewerPos = entityManager.getComponent(viewerId, "GridPosition");
      const vision = entityManager.getComponent(viewerId, "Vision");
      const unit = entityManager.getComponent(viewerId, "Unit");
      if (viewerPos && (vision || unit)) {
        let range = (vision == null ? void 0 : vision.range) || (unit == null ? void 0 : unit.intelRange) || 3;
        if ((unit == null ? void 0 : unit.unitCategory) === "drone") {
          range *= 3;
        }
        for (const targetId of allEntities) {
          const targetPos = entityManager.getComponent(targetId, "GridPosition");
          if (!targetPos) continue;
          const dx = targetPos.x - viewerPos.x;
          const dy = targetPos.y - viewerPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= range) {
            targetPos.isVisible = true;
          }
        }
      }
    }
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] VisionSystem - SIGINT Offline.");
  }
}
const visionSystem = new VisionSystem();
class ResearchSystem {
  init() {
    console.log("[SYSTEM] ResearchSystem - Intelligence Lab ONLINE.");
  }
  update(deltaTime) {
    const globalState = gameStateService.getGlobalState();
    const research = globalState.research || {};
    const units = entityManager.getEntitiesWith(["Unit"]);
    for (const id of units) {
      const unit = entityManager.getComponent(id, "Unit");
      if (unit) {
        const attackLevel = research["pontaria"] || 0;
        unit.attackBonus = 1 + attackLevel * 0.05;
        const speedLevel = research["logistica"] || 0;
        unit.speedBonus = 1 + speedLevel * 0.1;
      }
    }
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
  }
}
class RenderSystem {
  constructor() {
    __publicField(this, "canvas", null);
    __publicField(this, "ctx", null);
    __publicField(this, "images", /* @__PURE__ */ new Map());
    __publicField(this, "frameCount", 0);
    __publicField(this, "debug", false);
    // Desativado para performance
    __publicField(this, "TILE_SIZE", 64);
    __publicField(this, "maxEntitiesRender", 200);
  }
  init() {
    console.log("[SYSTEM] RenderSystem - Visual Protocols ONLINE.");
    this.createCanvas();
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.frameCount++;
    const allEntities = entityManager.getEntitiesWith(["GridPosition"]);
    const entities = allEntities.slice(0, this.maxEntitiesRender);
    entities.forEach((entityId) => {
      const gridPos = entityManager.getComponent(entityId, "GridPosition");
      if (!gridPos) return;
      const sprite = entityManager.getComponent(entityId, "Sprite");
      const health = entityManager.getComponent(entityId, "Health");
      const isSelected = entityManager.getComponent(entityId, "Selection");
      const pos = {
        x: gridPos.x * this.TILE_SIZE + this.TILE_SIZE / 2,
        y: gridPos.y * this.TILE_SIZE + this.TILE_SIZE / 2
      };
      this.drawEntity(pos, sprite, health, isSelected, entityId);
    });
  }
  createCanvas() {
  }
  drawEntity(pos, sprite, health, isSelected, entityId) {
    if (!this.ctx) return;
    const size = 32;
    const isPlayer = entityManager.getComponent(entityId, "Player");
    entityManager.getComponent(entityId, "AI");
    if (isSelected) {
      this.ctx.strokeStyle = "#00ff00";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(pos.x - size / 2 - 2, pos.y - size / 2 - 2, size + 4, size + 4);
    }
    if (health) {
      const barWidth = 32;
      const barHeight = 4;
      const healthPercent = health.value / health.max;
      this.ctx.fillStyle = "#333333";
      this.ctx.fillRect(pos.x - barWidth / 2, pos.y - size / 2 - 10, barWidth, barHeight);
      this.ctx.fillStyle = isPlayer ? "#22c55e" : "#ef4444";
      this.ctx.fillRect(pos.x - barWidth / 2, pos.y - size / 2 - 10, barWidth * healthPercent, barHeight);
    }
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
const renderSystem = new RenderSystem();
class VillageComponent {
  constructor(ownerId, dbId = null, level = 1, resources = {
    suprimentos: 0,
    combustivel: 0,
    municoes: 0,
    pessoal: 0,
    metal: 0,
    energia: 0
  }, name = "Base_Outpost", isRebel = false, loyalty = 100, isProtected = false, protectionUntil = 0, aliancaId = null) {
    __publicField(this, "type", "Village");
    __publicField(this, "ownerId");
    this.dbId = dbId;
    this.level = level;
    this.resources = resources;
    this.name = name;
    this.isRebel = isRebel;
    this.loyalty = loyalty;
    this.isProtected = isProtected;
    this.protectionUntil = protectionUntil;
    this.aliancaId = aliancaId;
    this.ownerId = isRebel ? null : ownerId;
  }
}
class PositionComponent {
  constructor(x = 0, y = 0) {
    __publicField(this, "type", "Position");
    this.x = x;
    this.y = y;
  }
}
class RebelGeneratorSystem {
  constructor() {
    __publicField(this, "lastSpawnTime", 0);
    __publicField(this, "lastProgressionTime", 0);
    __publicField(this, "lastRegenTime", 0);
    __publicField(this, "spawnInterval", 6e4);
    // 1 minuto entre scans
    __publicField(this, "progressionInterval", 3e5);
    // 5 minutos entre evoluções
    __publicField(this, "regenInterval", 1e4);
    // 10 segundos entre regenerações
    __publicField(this, "maxRebels", 15);
    __publicField(this, "mapSize", 100);
  }
  // Escala unificada 100x100
  init() {
    Logger.info("[SYSTEM] RebelGeneratorSystem - Evolution Protocols ACTIVE.");
    this.lastSpawnTime = Date.now();
    this.lastProgressionTime = Date.now();
    this.lastRegenTime = Date.now();
    for (let i = 0; i < 10; i++) {
      this.spawnRebel();
    }
    Logger.info(`[SYSTEM] RebelGeneratorSystem - ${entityManager.getEntitiesWith(["Village"]).length} total sectors identified in geology.`);
  }
  spawnManualRebel(x, y) {
    const rebelId = entityManager.createEntity();
    const level = 3;
    entityManager.addComponent(rebelId, new VillageComponent(
      null,
      -1,
      // dbId dummy para rebelde manual
      level,
      { suprimentos: 1e3, combustivel: 1e3, municoes: 1e3, pessoal: 0, metal: 1e3, energia: 0 },
      `FORCE_INSURGENT_SQUAD`,
      true
    ));
    const units = { "infantaria": 150, "blindado_apc": 10 };
    entityManager.addComponent(rebelId, new ArmyComponent(0, units));
    entityManager.addComponent(rebelId, new GridPositionComponent(x, y));
    entityManager.addComponent(rebelId, new PositionComponent(x * 80, y * 80));
    Logger.building("MANUAL_REBEL_CREATED", { id: rebelId, x, y });
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
    const now = Date.now();
    if (now - this.lastSpawnTime >= this.spawnInterval) {
      this.lastSpawnTime = now;
      this.processGeneration();
    }
    if (now - this.lastProgressionTime >= this.progressionInterval) {
      this.lastProgressionTime = now;
      this.processProgression();
    }
    if (now - this.lastRegenTime >= this.regenInterval) {
      this.lastRegenTime = now;
      this.processRegeneration();
    }
  }
  postUpdate(deltaTime) {
  }
  processRegeneration() {
    const entities = entityManager.getEntitiesWith(["Village"]);
    const regenRatePerLevel = 1;
    for (const id of entities) {
      const village = entityManager.getComponent(id, "Village");
      if (village && village.isRebel) {
        const army = entityManager.getComponent(id, "Army");
        if (army) {
          const maxInfantry = village.level === 1 ? 20 : village.level * 120;
          const currentInfantry = army.units["infantaria"] || 0;
          if (currentInfantry < maxInfantry) {
            const amount = Math.min(maxInfantry - currentInfantry, regenRatePerLevel * village.level);
            army.units["infantaria"] = currentInfantry + amount;
            if (amount > 0) {
              Logger.building("REBEL_REGEN", { id, infantry: army.units["infantaria"] });
            }
          }
        }
      }
    }
  }
  processProgression() {
    const entities = entityManager.getEntitiesWith(["Village"]);
    for (const id of entities) {
      const village = entityManager.getComponent(id, "Village");
      if (village && village.isRebel && village.level < 10) {
        village.level++;
        const army = entityManager.getComponent(id, "Army");
        if (army) {
          army.units["infantaria"] = (army.units["infantaria"] || 0) + 120;
          if (village.level >= 3) army.units["blindado_apc"] = (army.units["blindado_apc"] || 0) + 20;
          if (village.level >= 5) army.units["tanque_combate"] = (army.units["tanque_combate"] || 0) + 5;
        }
        Logger.building("REBEL_EVOLUTION", { id, level: village.level });
      }
    }
    eventBus.emit("MAPA:FORCE_REFRESH", {});
  }
  processGeneration() {
    const villages = entityManager.getEntitiesWith(["Village"]);
    const rebelCount = villages.filter((id) => {
      const v = entityManager.getComponent(id, "Village");
      return v == null ? void 0 : v.isRebel;
    }).length;
    if (rebelCount < this.maxRebels) {
      Logger.info(`[REBEL] Under-limit detected (${rebelCount}/${this.maxRebels}). Generating reinforcements...`);
      this.spawnRebel();
    }
  }
  spawnRebel() {
    const coords = this.findFreeCoords();
    if (!coords) return;
    const level = Math.floor(Math.random() * 5) + 1;
    const rebelId = entityManager.createEntity();
    entityManager.addComponent(rebelId, new VillageComponent(
      null,
      rebelId * -1,
      // dbId dummy
      level,
      {
        suprimentos: level * 100,
        combustivel: level * 100,
        municoes: level * 100,
        pessoal: 0,
        metal: level * 100,
        energia: 0
      },
      `Rebel_Outpost_LVL${level}`,
      true
    ));
    const units = {};
    units["infantaria"] = level === 1 ? 20 : level * 120;
    if (level >= 3) units["blindado_apc"] = (level - 2) * 20;
    if (level === 5) units["tanque_combate"] = 15;
    if (level >= 4) units["politico"] = 1;
    entityManager.addComponent(rebelId, new ArmyComponent(0, units));
    entityManager.addComponent(rebelId, new GridPositionComponent(coords.x, coords.y));
    entityManager.addComponent(rebelId, new PositionComponent(coords.x * 80, coords.y * 80));
    Logger.building("REBEL_SPAWN", { id: rebelId, x: coords.x, y: coords.y, level });
  }
  findFreeCoords() {
    const occupied = /* @__PURE__ */ new Set();
    const entities = entityManager.getEntitiesWith(["GridPosition"]);
    for (const id of entities) {
      const pos = entityManager.getComponent(id, "GridPosition");
      if (pos) occupied.add(`${pos.x},${pos.y}`);
    }
    for (let attempts = 0; attempts < 100; attempts++) {
      const rx = Math.floor(Math.random() * this.mapSize);
      const ry = Math.floor(Math.random() * this.mapSize);
      if (!occupied.has(`${rx},${ry}`)) return { x: rx, y: ry };
    }
    return null;
  }
  destroy() {
    Logger.info("[SYSTEM] RebelGeneratorSystem - Insurrection monitor OFFLINE.");
  }
}
class AttackMarchComponent {
  constructor(originId, targetX, targetY, troops, totalTime, remainingTime, state = "GOING", loot = { wood: 0, stone: 0, iron: 0 }) {
    __publicField(this, "type", "AttackMarch");
    this.originId = originId;
    this.targetX = targetX;
    this.targetY = targetY;
    this.troops = troops;
    this.totalTime = totalTime;
    this.remainingTime = remainingTime;
    this.state = state;
    this.loot = loot;
  }
}
class SyncSystem {
  init() {
    Logger.info("[SYSTEM] SyncSystem - Uplink Established.");
    eventBus.subscribe(Events.LARAVEL_SYNC_ATTACKS, (p) => {
      this.syncLaravelAttacks(p.data.attacks);
    });
    eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
      if (ev.data.report) {
        this.persistReport(ev.data.report);
      }
    });
    eventBus.subscribe(Events.BUILDING_UPGRADE_REQUEST, (ev) => this.handleBuildingUpgrade(ev.data));
    eventBus.subscribe(Events.UNIT_TRAIN_REQUEST, (ev) => this.handleUnitTraining(ev.data));
    eventBus.subscribe(Events.ATTACK_LAUNCH, (ev) => this.handleAttackLaunch(ev.data));
  }
  async handleBuildingUpgrade(data) {
    Logger.building("UPGRADE_REQUEST", data);
    Sr.post("/buildings/upgrade", {
      base_id: data.base_id,
      tipo: data.tipo
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        eventBus.emit(Events.ACTION_SUCCESS, { data: { type: "UPGRADE" } });
      },
      onError: (err) => {
        const msg = Object.values(err)[0] || "Operação Negada";
        eventBus.emit(Events.UI_ALERT, { data: { message: msg, type: "error" } });
      },
      onFinish: () => {
        eventBus.emit(Events.ACTION_SUCCESS, { data: { type: "CLEANUP" } });
      }
    });
  }
  async handleUnitTraining(data) {
    var _a;
    try {
      Logger.building("TRAINING_REQUEST", data);
      const response = await fetch("/base/treinar", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) || ""
        },
        body: JSON.stringify({ base_id: data.base_id, unidade: data.unidade, quantidade: data.quantidade })
      });
      const resData = await response.json();
      Logger.backend("TRAINING_RESPONSE", { status: response.status, data: resData });
      if (!response.ok) {
        throw new Error(resData.message || "Recruitment Failed");
      }
      Sr.reload();
      eventBus.emit(Events.ACTION_SUCCESS, { data: { type: "RECRUITMENT" } });
      Logger.info("[ACTION] Recruitment procedures online.");
    } catch (err) {
      Logger.error("[ACTION_FAILURE] Recruitment aborted", err);
      eventBus.emit(Events.UI_ALERT, { data: { message: err.message, type: "error" } });
    }
  }
  async handleAttackLaunch(data) {
    var _a;
    try {
      Logger.info("[ACTION] Launching Military Expedition...");
      const response = await fetch("/base/atacar", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) || ""
        },
        body: JSON.stringify(data.backendParams)
      });
      const resData = await response.json();
      Logger.backend("ATTACK_RESPONSE", { status: response.status, data: resData });
      if (!response.ok) {
        const errorMsg = resData.message || (resData.errors ? Object.values(resData.errors).flat().join(" | ") : "Expedition Aborted");
        throw new Error(errorMsg);
      }
      Logger.info("[ACTION] Expedition is en-route.");
    } catch (err) {
      Logger.error("[ACTION_FAILURE] Military operation failed", err);
      eventBus.emit(Events.UI_ALERT, { data: { message: err.message, type: "error" } });
    }
  }
  async persistReport(report) {
    var _a;
    try {
      await fetch("/api/relatorios/store", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) || ""
        },
        body: JSON.stringify({
          titulo: `OPERATIONAL REPORT: ${report.resultado}`,
          detalhes: report,
          vencedor_id: report.vencedor === "ATACANTE" ? 1 : 2
          // Mock IDs por agora
        })
      });
      Logger.info("[SYNC] Battle report uploaded to Central Command.");
    } catch (err) {
      Logger.error("[SYNC] Failed to transmit battle report", err);
    }
  }
  syncLaravelAttacks(attacks) {
    attacks.forEach((atk) => {
      const eId = 1e4 + atk.id;
      if (!entityManager.getEntitiesWith(["AttackMarch"]).includes(eId)) {
        const now = Date.now();
        const arrival = new Date(atk.chegada_em).getTime();
        const total = Math.round((arrival - new Date(atk.created_at).getTime()) / 1e3);
        const remaining = Math.round((arrival - now) / 1e3);
        if (remaining > 0) {
          entityManager.createEntity(eId);
          entityManager.addComponent(eId, new AttackMarchComponent(
            atk.origem_base_id,
            atk.destino_x || 0,
            atk.destino_y || 0,
            atk.tropas || {},
            total,
            remaining,
            "GOING"
          ));
        }
      }
    });
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
  }
  postUpdate(deltaTime) {
    gameStateService.snap();
  }
  destroy() {
    Logger.info("[SYSTEM] SyncSystem - Uplink Terminated.");
  }
}
const syncSystem = new SyncSystem();
class IntelSystem {
  constructor() {
    __publicField(this, "revealedTiles", /* @__PURE__ */ new Set());
    __publicField(this, "lastUpdate", 0);
    __publicField(this, "UPDATE_INTERVAL", 1e3);
  }
  // Atualizar FOW a cada 1s para performance
  init() {
    console.log("[SYSTEM] IntelSystem - Recon Protocols ONLINE.");
  }
  update(deltaTime) {
    const now = Date.now();
    if (now - this.lastUpdate < this.UPDATE_INTERVAL) return;
    this.lastUpdate = now;
    this.revealedTiles.clear();
    const units = entityManager.getEntitiesWith(["Unit", "GridPosition"]);
    for (const id of units) {
      const unit = entityManager.getComponent(id, "Unit");
      const pos = entityManager.getComponent(id, "GridPosition");
      if (unit && pos) {
        const baseRange = unit.intelRange || 2;
        const multiplier = unit.unitCategory === "drone" ? 2.5 : 1;
        const range = Math.floor(baseRange * multiplier);
        this.revealArea(pos.x, pos.y, range);
      }
    }
    const villages = entityManager.getEntitiesWith(["Village", "GridPosition"]);
    for (const id of villages) {
      const pos = entityManager.getComponent(id, "GridPosition");
      if (pos) this.revealArea(pos.x, pos.y, 4);
    }
    gameStateService.updateGlobalState({ revealedTiles: Array.from(this.revealedTiles) });
  }
  revealArea(cx, cy, range) {
    for (let y = cy - range; y <= cy + range; y++) {
      for (let x = cx - range; x <= cx + range; x++) {
        this.revealedTiles.add(`${x},${y}`);
      }
    }
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
  }
}
class WorldMapSyncSystem {
  constructor() {
    __publicField(this, "lastFetchTime", 0);
    __publicField(this, "FETCH_INTERVAL", 1e4);
    // 10 segundos
    __publicField(this, "CHUNK_SIZE", 50);
    __publicField(this, "loadedChunks", /* @__PURE__ */ new Set());
    __publicField(this, "isFetching", false);
  }
  init() {
    console.log("[SYSTEM] WorldMapSyncSystem - Monitoring global geology.");
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
    const now = Date.now();
    if (now - this.lastFetchTime < this.FETCH_INTERVAL) return;
    if (this.isFetching) return;
    if (stateManager.getMode() === "WORLD_MAP" || this.loadedChunks.size === 0) {
      this.syncVisibleChunks();
      this.lastFetchTime = now;
    }
  }
  async syncVisibleChunks() {
    this.isFetching = true;
    try {
      const playerBaseId = 1;
      const cx = 500;
      const cy = 500;
      const chunkX = Math.floor(cx / this.CHUNK_SIZE);
      const chunkY = Math.floor(cy / this.CHUNK_SIZE);
      const neighbors = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dx, dy] of neighbors) {
        const nx = chunkX + dx;
        const ny = chunkY + dy;
        const key = `${nx}-${ny}`;
        if (!this.loadedChunks.has(key)) {
          await this.fetchChunk(nx, ny);
          this.loadedChunks.add(key);
        }
      }
    } finally {
      this.isFetching = false;
    }
  }
  async fetchChunk(cx, cy) {
    try {
      const response = await axios.get(`/api/mapa/chunk/${cx}/${cy}`);
      const bases = response.data.bases || [];
      bases.forEach((b) => {
        var _a, _b;
        const entityId = 2e4 + b.id;
        if (!entityManager.hasComponent(entityId, "Village")) {
          entityManager.createEntity(entityId);
          entityManager.addComponent(entityId, new VillageComponent(
            b.ownerId,
            b.id,
            // dbId
            b.nivel || 1,
            void 0,
            // Resources will be updated via specific sync if needed
            b.nome,
            !b.ownerId,
            b.loyalty || 100,
            b.is_protected,
            b.protection_until ? new Date(b.protection_until).getTime() : 0,
            ((_a = b.jogador) == null ? void 0 : _a.alianca_id) || null
          ));
          entityManager.addComponent(entityId, new GridPositionComponent(b.coordenada_x, b.coordenada_y, true));
        } else {
          const village = entityManager.getComponent(entityId, "Village");
          if (village) {
            village.ownerId = b.ownerId;
            village.loyalty = b.loyalty || 100;
            village.isProtected = b.is_protected;
            village.protectionUntil = b.protection_until ? new Date(b.protection_until).getTime() : 0;
            village.aliancaId = ((_b = b.jogador) == null ? void 0 : _b.alianca_id) || null;
          }
        }
      });
    } catch (error) {
      console.error(`[SYNC_ERROR] Failed to fetch map chunk ${cx}:${cy}`, error);
    }
  }
  postUpdate(deltaTime) {
  }
  destroy() {
  }
}
const worldMapSyncSystem = new WorldMapSyncSystem();
class SystemIntegrityCheck {
  constructor() {
    __publicField(this, "hasChecked", false);
  }
  init() {
    console.log("[SYSTEM] SystemIntegrityCheck - Sentinel ACTIVE.");
    this.performDiagnostic();
  }
  update(deltaTime) {
    if (!this.hasChecked) {
      this.hasChecked = true;
      this.performDiagnostic();
    }
  }
  performDiagnostic() {
    console.group("[INTEGRITY_AUDIT]");
    this.checkResourceProduction();
    this.checkBuildingFunctions();
    this.checkUnregisteredSystems();
    this.checkEventSubscribers();
    console.log("[INTEGRITY_AUDIT] Diagnostic sequence completed.");
    console.groupEnd();
  }
  checkResourceProduction() {
    const requiredResources = ["suprimentos", "combustivel", "municoes", "metal", "energia", "pessoal"];
    const producers = entityManager.getEntitiesWith(["Production"]);
    const producingTypes = /* @__PURE__ */ new Set();
    producers.forEach((id) => {
      const prod = entityManager.getComponent(id, "Production");
      if (prod) {
        if (prod.resourceType === "all") {
          requiredResources.forEach((r) => producingTypes.add(r));
        } else {
          producingTypes.add(prod.resourceType);
        }
      }
    });
    requiredResources.forEach((res) => {
      if (!producingTypes.has(res)) ;
    });
  }
  checkBuildingFunctions() {
    const functionalTypes = [
      "hq",
      "qg",
      "mina_suprimentos",
      "refinaria",
      "fabrica_municoes",
      "posto_recrutamento",
      "mina_metal",
      "central_energia",
      "quartel",
      "centro_pesquisa",
      "aerodromo",
      "muralha",
      "radar_estrategico"
    ];
    const buildings = entityManager.getEntitiesWith(["Building"]);
    buildings.forEach((id) => {
      const b = entityManager.getComponent(id, "Building");
      if (b && !functionalTypes.includes(b.buildingType.toLowerCase())) {
        console.warn(`[INTEGRITY_FAIL] Building [${b.buildingType}] exists but has NO defined function/mapping.`);
      }
    });
  }
  checkUnregisteredSystems() {
    const knownSystems = [
      "InputSystem",
      "GameModeSystem",
      "TimeSystem",
      "WorldSystem",
      "ResourceSystem",
      "BuildQueueSystem",
      "OrderSystem",
      "AISystem",
      "MovementSystem",
      "CombatSystem",
      "AttackSystem",
      "VisionSystem",
      "ResearchSystem",
      "RenderSystem",
      "RebelGeneratorSystem",
      "SyncSystem",
      "SystemIntegrityCheck",
      "IntelSystem"
    ];
    const registeredCount = systemsRegistry.length;
    if (registeredCount < knownSystems.length) {
      console.warn(`[INTEGRITY_FAIL] Potential Unregistered Systems! Registered: ${registeredCount}, Known in filesystem: ${knownSystems.length}.`);
    }
  }
  checkEventSubscribers() {
    const handlersInfo = eventBus.getHandlersInfo();
    const eventConstants = Object.values(Events);
    eventConstants.forEach((event) => {
      handlersInfo.get(event) || 0;
    });
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
  }
}
const systemIntegrityCheck = new SystemIntegrityCheck();
const intelSystem = new IntelSystem();
const systemsRegistry = [
  systemIntegrityCheck,
  inputSystem,
  gameModeSystem,
  timeSystem,
  worldSystem,
  intelSystem,
  resourceSystem,
  buildQueueSystem,
  orderSystem,
  aiSystem,
  movementSystem,
  combatSystem,
  marchSystem,
  attackSystem,
  new RebelGeneratorSystem(),
  visionSystem,
  new ResearchSystem(),
  renderSystem,
  worldMapSyncSystem,
  syncSystem
];
class GameLoop {
  constructor() {
    __publicField(this, "lastTime", 0);
    __publicField(this, "running", false);
    __publicField(this, "frameId", null);
  }
  /**
   * Inicia a sequência de ignição do motor.
   */
  start() {
    if (this.running) return;
    this.running = true;
    Logger.info("[ENGINE] GameLoop starting sequence...");
    systemsRegistry.forEach((system) => {
      try {
        system.init();
      } catch (e) {
        console.error(`[CRITICAL_FAILURE] System init error:`, system, e);
      }
    });
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }
  /**
   * Ciclo principal de atualização (Tick).
   */
  loop(currentTime) {
    if (!this.running) return;
    const deltaTimeMillis = currentTime - this.lastTime;
    if (deltaTimeMillis < 16) {
      this.frameId = requestAnimationFrame(this.loop.bind(this));
      return;
    }
    const deltaTime = deltaTimeMillis / 1e3;
    this.lastTime = currentTime;
    systemsRegistry.forEach((s) => {
      try {
        s.preUpdate(deltaTime);
      } catch (e) {
        console.error(`[GAMELOOP_ERROR] preUpdate failure: ${s.constructor.name}`, e);
      }
    });
    systemsRegistry.forEach((s) => {
      try {
        s.update(deltaTime);
      } catch (e) {
        console.error(`[GAMELOOP_ERROR] update failure: ${s.constructor.name}`, e);
      }
    });
    systemsRegistry.forEach((s) => {
      try {
        s.postUpdate(deltaTime);
      } catch (e) {
        console.error(`[GAMELOOP_ERROR] postUpdate failure: ${s.constructor.name}`, e);
      }
    });
    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }
  /**
   * Paragem de emergência do motor.
   */
  stop() {
    this.running = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }
    systemsRegistry.forEach((system) => system.destroy());
    Logger.info("[ENGINE] GameLoop halted.");
  }
}
const gameLoop = new GameLoop();
class HUD {
  show() {
    const el = document.getElementById("tactical-hud");
    if (el) el.style.display = "block";
  }
  hide() {
    const el = document.getElementById("tactical-hud");
    if (el) el.style.display = "none";
  }
  initialize() {
    this.createDOM();
    this.subscribeToEvents();
    console.log("[UI_HUD] Tactical Monitors & Navigation ONLINE.");
  }
  createDOM() {
    var _a, _b;
    const hud2 = document.createElement("div");
    hud2.id = "tactical-hud";
    hud2.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            display: none; /* Oculto por defeito */
            z-index: 1000;
            font-family: monospace;
            color: #00ff00;
            background: rgba(0,0,0,0.8);
            padding: 15px;
            border-left: 4px solid #00ff00;
            min-width: 200px;
        `;
    hud2.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #00ff0033;">>>> RADAR TELEMETRY</div>
            <div id="hud-state">STATUS: OPERATIONAL</div>
            <div id="hud-health">INTEGRITY: 100%</div>
            <div id="hud-score">PROGRESS: 0m</div>

            <div style="font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #00ff0033;">>>> STRATEGIC_NAV</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button id="nav-village" style="
                    background: #00ff00; color: #000; border: none; padding: 8px; 
                    font-family: monospace; font-weight: bold; cursor: pointer;
                ">BASE_OPERATIVA</button>
                
                <button id="nav-map" style="
                    background: #000; color: #00ff00; border: 1px solid #00ff00; padding: 8px; 
                    font-family: monospace; font-weight: bold; cursor: pointer;
                ">MAPA_MUNDIAL</button>
            </div>
        `;
    document.body.appendChild(hud2);
    (_a = document.getElementById("nav-village")) == null ? void 0 : _a.addEventListener("click", () => {
      console.log("CLICK BASE");
      this.changeMode("VILLAGE");
    });
    (_b = document.getElementById("nav-map")) == null ? void 0 : _b.addEventListener("click", () => {
      console.log("CLICK MAPA");
      eventBus.emit({
        type: Events.GAME_CHANGE_MODE,
        timestamp: Date.now(),
        data: { mode: "WORLD_MAP" }
      });
    });
  }
  changeMode(mode) {
    eventBus.emit({
      type: Events.GAME_CHANGE_MODE,
      timestamp: Date.now(),
      data: { mode }
    });
  }
  subscribeToEvents() {
    eventBus.subscribe(Events.COMBAT_UNIT_DAMAGED, (p) => {
      this.updateHealth(p.data.newHealth);
    });
    eventBus.subscribe(Events.PLAYER_MOVE_ORDER, (p) => {
      this.updateProgress(p.data.targetX);
    });
    eventBus.subscribe(Events.GAME_STATE_CHANGED, (p) => {
      this.updateState(p.data.newState);
    });
    eventBus.subscribe(Events.GAMEMODE_CHANGED, (p) => {
      this.updateNavButtons(p.data.mode);
    });
  }
  updateNavButtons(mode) {
    const btnVillage = document.getElementById("nav-village");
    const btnMap = document.getElementById("nav-map");
    if (mode === "VILLAGE") {
      if (btnVillage) {
        btnVillage.style.background = "#00ff00";
        btnVillage.style.color = "#000";
      }
      if (btnMap) {
        btnMap.style.background = "#000";
        btnMap.style.color = "#00ff00";
      }
    } else {
      if (btnVillage) {
        btnVillage.style.background = "#000";
        btnVillage.style.color = "#00ff00";
      }
      if (btnMap) {
        btnMap.style.background = "#00ff00";
        btnMap.style.color = "#000";
      }
    }
  }
  updateHealth(health) {
    const el = document.getElementById("hud-health");
    if (el) el.innerText = `INTEGRITY: ${Math.max(0, health)}%`;
  }
  updateProgress(x) {
    const el = document.getElementById("hud-score");
    if (el) el.innerText = `DESTINATION_X: ${Math.floor(x)}m`;
  }
  updateState(state) {
    const el = document.getElementById("hud-state");
    if (el) el.innerText = `STATUS: ${state}`;
  }
}
const hud = new HUD();
class VillageView {
  constructor() {
    __publicField(this, "container", null);
    __publicField(this, "CELL_SIZE", 120);
    __publicField(this, "selectedBuildingId", null);
  }
  initialize() {
    this.createDOM();
    this.setupInteractions();
    this.startUpdateLoop();
    console.log("[UI_VILLAGE] Command & Upgrade Interface ONLINE.");
  }
  createDOM() {
    this.container = document.createElement("div");
    this.container.id = "village-view-container";
    this.container.style.cssText = `
            position: absolute;
            top: 150px;
            left: 20px;
            z-index: 1000;
            display: none; /* Escondido por defeito */
            gap: 20px;
            font-family: 'Courier New', Courier, monospace;
        `;
    document.body.appendChild(this.container);
  }
  show() {
    if (this.container) this.container.style.display = "flex";
  }
  hide() {
    if (this.container) this.container.style.display = "none";
  }
  setupInteractions() {
    if (!this.container) return;
    this.container.addEventListener("click", (e) => {
      const target = e.target;
      const upgradeBtn = target.closest('[data-action="upgrade"]');
      if (upgradeBtn && this.selectedBuildingId) {
        this.requestUpgrade(this.selectedBuildingId);
        return;
      }
      const buildingBox = target.closest("[data-entity-id]");
      if (buildingBox) {
        const id = parseInt(buildingBox.getAttribute("data-entity-id") || "0");
        this.selectBuilding(id);
      } else {
        const isGrid = target.id === "grid-canvas";
        if (isGrid) this.selectedBuildingId = null;
      }
    });
  }
  selectBuilding(id) {
    this.selectedBuildingId = id;
    eventBus.emit({
      type: Events.BUILDING_SELECTED,
      entityId: id,
      timestamp: Date.now(),
      data: { id }
    });
  }
  requestUpgrade(id) {
    eventBus.emit({
      type: Events.BUILDING_UPGRADE_REQUEST,
      entityId: id,
      timestamp: Date.now(),
      data: { id }
    });
  }
  startUpdateLoop() {
    setInterval(() => this.update(), 500);
  }
  update() {
    try {
      if (!this.container) return;
      const buildingEntities = entityManager.getEntitiesWith(["Building"]);
      let gridHtml = `
            <div style="
                background: rgba(0, 0, 0, 0.9);
                padding: 20px;
                border: 1px solid #00ff00;
                border-left: 5px solid #00ff00;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.15);
            ">
                <div style="font-weight: bold; border-bottom: 1px solid #00ff00; margin-bottom: 15px; font-size: 12px; letter-spacing: 2px; color: #00ff00;">
                    > TACTICAL_VILLAGE_GRID_V1
                </div>
                <div id="grid-canvas" style="position: relative; width: 450px; height: 350px; background-image: radial-gradient(#111 1px, transparent 1px); background-size: 20px 20px;">
        `;
      buildingEntities.forEach((id) => {
        const b = entityManager.getComponent(id, "Building");
        const gp = entityManager.getComponent(id, "GridPosition");
        if (b && gp) {
          const x = gp.x * this.CELL_SIZE;
          const y = gp.y * this.CELL_SIZE;
          const isSelected = this.selectedBuildingId === id;
          gridHtml += `
                    <div data-entity-id="${id}" style="
                        position: absolute;
                        left: ${x}px;
                        top: ${y}px;
                        width: 100px;
                        height: 100px;
                        background: ${isSelected ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 255, 0, 0.05)"};
                        border: 2px solid ${isSelected ? "#fff" : "#00ff00"};
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        padding: 10px;
                        box-sizing: border-box;
                        cursor: pointer;
                        ${isSelected ? "box-shadow: 0 0 15px #fff;" : ""}
                    ">
                        <div style="font-size: 9px; opacity: 0.7; color: #00ff00;">[[${b.buildingType}]]</div>
                        <div style="font-size: 11px; margin: 8px 0; font-weight: bold; color: #00ff00;">${b.buildingType.toUpperCase()}</div>
                        <div style="color: #000; background: #00ff00; padding: 1px 6px; font-size: 10px; font-weight: bold;">LV ${b.level}</div>
                    </div>
                `;
        }
      });
      gridHtml += `</div></div>`;
      let panelHtml = "";
      if (this.selectedBuildingId) {
        const b = entityManager.getComponent(this.selectedBuildingId, "Building");
        if (b) {
          panelHtml = `
                    <div style="
                        width: 250px;
                        background: rgba(0, 0, 0, 0.95);
                        border: 1px solid #00ff00;
                        padding: 20px;
                        color: #00ff00;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    ">
                        <div style="font-weight: bold; border-bottom: 2px solid #00ff00; padding-bottom: 5px;">COMMAND: BUILDING_OPS</div>
                        
                        <div>
                            <div style="font-size: 10px; color: #666;">OPERATION_TYPE</div>
                            <div style="font-size: 18px; color: #fff;">${b.buildingType}</div>
                        </div>

                        <div>
                            <div style="font-size: 10px; color: #666;">RANK_STATUS</div>
                            <div style="font-size: 14px;">LEVEL ${b.level}</div>
                        </div>

                        <div style="margin-top: 20px;">
                            <button data-action="upgrade" style="
                                width: 100%;
                                padding: 12px;
                                background: #00ff00;
                                color: #000;
                                border: none;
                                font-family: monospace;
                                font-weight: bold;
                                cursor: pointer;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='#fff'" onmouseout="this.style.background='#00ff00'">
                                INITIATE_UPGRADE_REV
                            </button>
                        </div>
                        
                        <div style="font-size: 9px; color: #333; margin-top: auto;">SYNC_ID: ${this.selectedBuildingId}</div>
                    </div>
                `;
        }
      }
      this.container.innerHTML = gridHtml + panelHtml;
    } catch (e) {
      console.error("[UI_VILLAGE_ERROR] Interface update failure:", e);
    }
  }
}
const villageView = new VillageView();
class WorldMapView {
  constructor() {
    __publicField(this, "container", null);
  }
  initialize() {
    this.createDOM();
    console.log("[UI_MAP] World Map View INITIALIZED.");
  }
  createDOM() {
    this.container = document.createElement("div");
    this.container.id = "world-map-view";
    this.container.style.cssText = `
            position: absolute;
            top: 150px;
            left: 20px;
            z-index: 1000;
            display: none; /* Escondido por defeito */
            font-family: 'Courier New', Courier, monospace;
            color: #00ffff;
            background: rgba(0, 5, 20, 0.9);
            padding: 20px;
            border: 1px solid #00ffff;
            border-left: 5px solid #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
        `;
    this.container.innerHTML = `
            <div style="font-weight: bold; border-bottom: 1px solid #00ffff; margin-bottom: 15px; font-size: 14px; letter-spacing: 2px;">
                > GLOBAL_SATELLITE_COORDINATES
            </div>
            
            <div style="text-align: center; padding: 40px; border: 1px dashed #00ffff; background: rgba(0, 255, 255, 0.05);">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">WORLD MAP</div>
                <div style="font-size: 10px; color: #666;">SCANNING_SECTORS... [OFFLINE]</div>
                
                <div style="display: grid; grid-template-columns: repeat(5, 30px); gap: 5px; margin: 20px auto; justify-content: center;">
                    ${Array(25).fill('<div style="width: 30px; height: 30px; border: 1px solid #00ffff33;"></div>').join("")}
                </div>
            </div>
            
            <div style="margin-top: 15px; font-size: 10px; color: #555;">STATUS: WAITING_FOR_UPLINK</div>
        `;
    document.body.appendChild(this.container);
  }
  show() {
  }
  hide() {
    if (this.container) this.container.style.display = "none";
  }
}
const worldMapView = new WorldMapView();
class UIManager {
  constructor() {
    __publicField(this, "screens", /* @__PURE__ */ new Map());
  }
  initialize() {
    Logger.info("[UI_MGR] Commands Interfaces NORMALIZING.");
    hud.initialize();
    villageView.initialize();
    worldMapView.initialize();
    eventBus.subscribe(Events.GAMEMODE_CHANGED, (p) => {
      this.handleModeChange(p.data.mode);
    });
    eventBus.subscribe(Events.GAME_STATE_CHANGED, (p) => {
      const newState = p.data.newState;
      this.handleStateChange(newState);
      if (newState === GameState.PLAYING) {
        this.handleModeChange(stateManager.getMode());
      } else {
        villageView.hide();
        worldMapView.hide();
      }
    });
    let hudVisible = false;
    eventBus.subscribe(Events.INPUT_KEY_DOWN, (p) => {
      if (p.data.code === "KeyT") {
        hudVisible = !hudVisible;
        if (hudVisible) {
          hud.show();
          if (stateManager.getMode() === GameMode.VILLAGE) villageView.show();
        } else {
          hud.hide();
          villageView.hide();
        }
        Logger.info(`[UI] Telemetry ${hudVisible ? "ENABLED" : "DISABLED"}`);
      }
    });
    this.createScreens();
  }
  handleModeChange(mode) {
    Logger.info(`CURRENT MODE: ${mode}`);
    if (mode === GameMode.WORLD_MAP) {
      villageView.hide();
      worldMapView.show();
    } else {
      worldMapView.hide();
    }
  }
  handleStateChange(newState) {
    this.screens.forEach((screen) => {
      screen.style.display = "none";
      screen.style.pointerEvents = "none";
    });
    const activeScreen = this.screens.get(newState);
    if (activeScreen) {
      activeScreen.style.display = "flex";
      activeScreen.style.pointerEvents = newState === GameState.PLAYING ? "none" : "auto";
    }
  }
  createScreens() {
    const menuScreen = this.createScreen(GameState.MENU, "MAIN_MENU");
    menuScreen.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 64px; margin-bottom: 20px;">GUERRAS MODERNAS</h1>
                <p style="font-size: 16px; color: #aaa; margin-bottom: 50px;">DOUCTRINE V1.2 - NORMALIZED SIGNAL</p>
                <button id="btn-start" style="padding: 15px 40px; font-size: 20px; cursor: pointer; background: #00ff00; color: #000; font-weight: bold; border: none;">START_MISSION</button>
            </div>
        `;
    document.body.appendChild(menuScreen);
    const gameScreen = this.createScreen(GameState.PLAYING, "GAME_SCREEN");
    document.body.appendChild(gameScreen);
    const pauseScreen = this.createScreen(GameState.PAUSED, "PAUSE_SCREEN");
    pauseScreen.innerHTML = `
            <div style="text-align: center; background: rgba(0,0,0,0.8); padding: 40px; border: 2px solid #00ff00;">
                <h2 style="font-size: 48px;">PAUSE</h2>
                <p>DOCTRINE VALIDATION ACTIVE</p>
            </div>
        `;
    document.body.appendChild(pauseScreen);
  }
  createScreen(state, id) {
    const el = document.createElement("div");
    el.id = id;
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100vw";
    el.style.height = "100vh";
    el.style.display = "none";
    el.style.flexDirection = "column";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.backgroundColor = "transparent";
    el.style.color = "#fff";
    el.style.fontFamily = "monospace";
    el.style.zIndex = "400";
    el.style.pointerEvents = "none";
    this.screens.set(state, el);
    return el;
  }
}
const uiManager = new UIManager();
class VelocityComponent {
  constructor(vx = 0, vy = 0, targetX = 0, targetY = 0, isMoving = false, path = []) {
    __publicField(this, "type", "Velocity");
    this.vx = vx;
    this.vy = vy;
    this.targetX = targetX;
    this.targetY = targetY;
    this.isMoving = isMoving;
    this.path = path;
  }
}
class ProductionComponent {
  constructor(resourceType, ratePerSecond = 1) {
    __publicField(this, "type", "Production");
    this.resourceType = resourceType;
    this.ratePerSecond = ratePerSecond;
  }
}
class PlayerComponent {
  constructor() {
    __publicField(this, "type", "Player");
  }
}
class ResourceComponent {
  constructor(suprimentos = 0, combustivel = 0, municoes = 0, metal = 0, energia = 0, pessoal = 0, cap = 1e4) {
    __publicField(this, "type", "Resource");
    this.suprimentos = suprimentos;
    this.combustivel = combustivel;
    this.municoes = municoes;
    this.metal = metal;
    this.energia = energia;
    this.pessoal = pessoal;
    this.cap = cap;
  }
}
class BuildingComponent {
  constructor(buildingType, level = 1, villageId) {
    __publicField(this, "type", "Building");
    this.buildingType = buildingType;
    this.level = level;
    this.villageId = villageId;
  }
}
class VisionComponent {
  constructor(range = 3) {
    __publicField(this, "type", "Vision");
    this.range = range;
  }
}
Logger.info("BEFORE GAMELOOP");
gameLoop.start();
uiManager.initialize();
const playerUnit = entityManager.createEntity();
entityManager.addComponent(playerUnit, new PlayerComponent());
const villageEntity = entityManager.createEntity();
entityManager.addComponent(villageEntity, new VillageComponent(
  playerUnit,
  1001,
  // dbId
  1,
  // level
  { suprimentos: 5e3, combustivel: 5e3, municoes: 5e3, pessoal: 100, metal: 5e3, energia: 5e3 },
  "Vila Alfa"
));
entityManager.addComponent(villageEntity, new ResourceComponent(5e3, 5e3, 5e3, 5e3, 5e3, 100, 2e4));
entityManager.addComponent(villageEntity, new VisionComponent(5));
entityManager.addComponent(villageEntity, new GridPositionComponent(5, 5));
entityManager.addComponent(villageEntity, {
  type: "Renderable",
  renderType: "building"
});
const villageBeta = entityManager.createEntity();
entityManager.addComponent(villageBeta, new VillageComponent(
  playerUnit,
  1002,
  // dbId
  1,
  // level 
  { suprimentos: 2e3, combustivel: 2e3, municoes: 2e3, pessoal: 50, metal: 2e3, energia: 2e3 },
  "Base Beta"
));
entityManager.addComponent(villageBeta, new ResourceComponent(2e3, 2e3, 2e3, 2e3, 2e3, 50, 1e4));
entityManager.addComponent(villageBeta, new VisionComponent(5));
entityManager.addComponent(villageBeta, new GridPositionComponent(15, 10));
entityManager.addComponent(villageBeta, {
  type: "Renderable",
  renderType: "building"
});
entityManager.addComponent(playerUnit, new ResourceComponent(5e3, 5e3, 5e3, 5e3, 5e3, 500));
entityManager.addComponent(playerUnit, new BuildQueueComponent());
entityManager.addComponent(playerUnit, new VisionComponent(10));
entityManager.addComponent(playerUnit, new VelocityComponent(0, 0));
entityManager.addComponent(playerUnit, new HealthComponent(1e3, 1e3));
entityManager.addComponent(playerUnit, new AttackComponent(50, 150, 1));
entityManager.addComponent(playerUnit, new SpriteComponent("/images/unidades/blindado_apc.png"));
entityManager.addComponent(playerUnit, new GridPositionComponent(6, 5));
entityManager.addComponent(playerUnit, {
  type: "Renderable",
  renderType: "unit"
});
const qg = entityManager.createEntity();
entityManager.addComponent(qg, new BuildingComponent("HQ", 1, villageEntity));
const minaMetal = entityManager.createEntity();
entityManager.addComponent(minaMetal, new BuildingComponent("mina_metal", 1, villageEntity));
entityManager.addComponent(minaMetal, new ProductionComponent("metal", 5));
const centralEnergia = entityManager.createEntity();
entityManager.addComponent(centralEnergia, new BuildingComponent("central_energia", 1, villageEntity));
entityManager.addComponent(centralEnergia, new ProductionComponent("energia", 10));
const minaSuprimentos = entityManager.createEntity();
entityManager.addComponent(minaSuprimentos, new BuildingComponent("mina_suprimentos", 1, villageEntity));
entityManager.addComponent(minaSuprimentos, new ProductionComponent("suprimentos", 20));
Logger.info(`[BOOT] Player Unit Alpha (ID: ${playerUnit}) deployed with Spatial Village infrastructure.`);
const testUnit = entityManager.createEntity();
entityManager.addComponent(testUnit, new PlayerComponent());
entityManager.addComponent(testUnit, new VelocityComponent(0, 0));
entityManager.addComponent(testUnit, new SpriteComponent("/images/unidades/agente_espiao.png"));
Logger.info(`[BOOT] Test Unit Alpha-Zero (ID: ${testUnit}) deployed at ORIGIN.`);
const enemyUnit = entityManager.createEntity();
entityManager.addComponent(enemyUnit, new VelocityComponent(0, 0));
entityManager.addComponent(enemyUnit, new HealthComponent(2e3, 2e3));
entityManager.addComponent(enemyUnit, new AttackComponent(100, 200, 3));
entityManager.addComponent(enemyUnit, new AIComponent("AGGRESSIVE"));
entityManager.addComponent(enemyUnit, new SpriteComponent("/images/unidades/tanque_combate.png"));
Logger.info(`[BOOT] Enemy Unit Omega (ID: ${enemyUnit}) detected with Main Battle Tank.`);
entityManager.addComponent(enemyUnit, new GridPositionComponent(10, 10));
entityManager.addComponent(enemyUnit, {
  type: "Renderable",
  renderType: "unit"
});
const rebelCoords = [
  { x: 7, y: 5, name: "Reduto Insurgente A" },
  { x: 5, y: 7, name: "Célula de Resistência B" },
  { x: 3, y: 5, name: "Posto Rebelde Gamma" },
  { x: 5, y: 3, name: "Depósito Insurgente Delta" },
  { x: 7, y: 7, name: "Base Terrorista Epsilon" }
];
rebelCoords.forEach((coord, index) => {
  const rebelVillage = entityManager.createEntity();
  entityManager.addComponent(rebelVillage, new VillageComponent(
    null,
    2e3 + index,
    // dbId dummy
    Math.floor(Math.random() * 3) + 1,
    // Nível 1 a 3
    { suprimentos: 1e3, combustivel: 1e3, municoes: 1e3, pessoal: 20, metal: 1e3, energia: 1e3 },
    coord.name,
    true
    // isRebel = true
  ));
  entityManager.addComponent(rebelVillage, new ResourceComponent(1e3, 1e3, 1e3, 1e3, 1e3, 20, 5e3));
  entityManager.addComponent(rebelVillage, new GridPositionComponent(coord.x, coord.y));
  entityManager.addComponent(rebelVillage, new PositionComponent(coord.x * 80, coord.y * 80));
  entityManager.addComponent(rebelVillage, {
    type: "Renderable",
    renderType: "building"
  });
  Logger.info(`[BOOT] Rebel Cell ${index + 1} (${coord.name}) deployed at ${coord.x}:${coord.y}.`);
});
stateManager.setState(GameState.PLAYING);
Logger.info("--- OPERATIONS ACTIVE: VISUAL TACTICAL ENGAGEMENT ONGOING ---");
//# sourceMappingURL=index-DjBrRxIa.js.map
