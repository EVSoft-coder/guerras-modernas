var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { C as eventBus, E as Events } from "./app-ByQO38D3.js";
import { g as gameStateService, e as entityManager, G as GameState, s as stateManager, a as GameMode } from "./GameStateService-CNId7fwV.js";
class Logger {
  static info(message) {
    console.log(`[INFO] [${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`);
  }
  static warn(message) {
    console.warn(`[WARN] [${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`);
  }
  static error(message, error) {
    console.error(`[ERROR] [${(/* @__PURE__ */ new Date()).toISOString()}] ${message}`, error);
  }
  /**
   * Registo especializado para eventos do EventBus.
   */
  static event(type, payload) {
  }
}
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
  constructor(x, y, tileType = "empty") {
    __publicField(this, "type", "Tile");
    this.x = x;
    this.y = y;
    this.tileType = tileType;
  }
}
class WorldSystem {
  constructor() {
    __publicField(this, "WORLD_SIZE", 1e3);
    // Grid 1000x1000
    __publicField(this, "chunkLoaded", /* @__PURE__ */ new Set());
  }
  init() {
    console.log(`[SYSTEM] WorldSystem - Global Grid Initialized (${this.WORLD_SIZE}x${this.WORLD_SIZE}).`);
    this.generateEssentialSectors();
  }
  generateEssentialSectors() {
    this.createTile(500, 500, "village");
    this.createTile(505, 505, "resource");
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
class ResourceSystem {
  init() {
    console.log("[SYSTEM] ResourceSystem - Economic Core ONLINE.");
  }
  update(deltaTime) {
    this.processProduction(deltaTime);
  }
  processProduction(deltaTime) {
    const entities = entityManager.getEntitiesWith(["Resource", "Production"]);
    for (const id of entities) {
      const res = entityManager.getComponent(id, "Resource");
      const prod = entityManager.getComponent(id, "Production");
      if (res && prod) {
        const amount = prod.ratePerSecond * deltaTime;
        if (prod.resourceType === "all") {
          res.wood = Math.min(res.cap, res.wood + amount);
          res.stone = Math.min(res.cap, res.stone + amount);
          res.iron = Math.min(res.cap, res.iron + amount);
        } else {
          const type = prod.resourceType;
          res[type] = Math.min(res.cap, res[type] + amount);
        }
      }
    }
  }
  preUpdate(deltaTime) {
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] ResourceSystem - Economic Core OFFLINE.");
  }
}
const resourceSystem = new ResourceSystem();
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
    const hasEnough = resources.wood >= cost && resources.stone >= cost && resources.iron >= cost;
    if (hasEnough) {
      resources.wood -= cost;
      resources.stone -= cost;
      resources.iron -= cost;
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
        building.level += 1;
        console.log(`[BUILD_SYSTEM] Building ${building.buildingType} upgraded to Level ${building.level}!`);
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
    console.log("[SYSTEM] MovementSystem - Tactical Navigation (A*) ONLINE.");
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
          console.log(`Unit ${id} path calculated: ${path.length} waypoints.`);
        } else {
          console.warn(`Unit ${id} could not find path to ${targetX}:${targetY}`);
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
            console.log(`Unit ${entityId} reached final objective.`);
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
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] MovementSystem - Tactical Navigation OFFLINE.");
  }
}
const movementSystem = new MovementSystem();
class CombatSystem {
  init() {
    console.log("[SYSTEM] CombatSystem - Engagement Protocols ONLINE.");
    eventBus.subscribe("ATTACK:RESOLVE", (payload) => {
      const { entityId, data } = payload;
      this.handleAttackResolve(entityId, data.march);
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
        const marchComp = entityManager.getComponent(armyId, "March");
        if (marchComp) {
          marchComp.status = "returning";
          console.log(`[COMBAT] Survivors of Army ${armyId} heading back to origin.`);
        }
      }
    } else {
      console.log(`[COMBAT] No structural target at ${march.targetX}:${march.targetY}. Empty Sector.`);
      const marchComp = entityManager.getComponent(armyId, "March");
      if (marchComp) marchComp.status = "returning";
    }
  }
  update(deltaTime) {
  }
  executeRaid(armyId, army, targetId, village) {
    console.log(`[COMBAT] STRATEGIC ENGAGEMENT: Army ${armyId} vs Village ${targetId}`);
    const attackerUnit = entityManager.getComponent(armyId, "Unit");
    const defenderUnit = entityManager.getComponent(targetId, "Unit");
    const attackerQty = Object.values(army.units).reduce((a, b) => a + b, 0);
    const attackBase = (attackerUnit == null ? void 0 : attackerUnit.attack) || 100;
    const attackBonus = (attackerUnit == null ? void 0 : attackerUnit.attackBonus) || 1;
    const totalAttack = attackBase * attackBonus * attackerQty;
    const totalDefense = ((defenderUnit == null ? void 0 : defenderUnit.defense) || 1500) + village.resources.wood * 0.01;
    console.log(`[COMBAT] CALCULATED FORCE: ATK(${totalAttack}) vs DEF(${totalDefense})`);
    const attackerWins = totalAttack > totalDefense;
    const attackerLossPercent = attackerWins ? 0.2 : 0.8;
    const attackerQtyBefore = Object.values(army.units).reduce((a, b) => a + b, 0);
    for (const type in army.units) {
      army.units[type] = Math.floor(army.units[type] * (1 - attackerLossPercent));
    }
    const lossesQty = attackerQtyBefore - Object.values(army.units).reduce((a, b) => a + b, 0);
    if (attackerWins) {
      const totalCapacity = ((attackerUnit == null ? void 0 : attackerUnit.capacity) || 1e3) * attackerQty;
      let possibleWood = Math.floor(village.resources.wood * 0.3);
      let possibleStone = Math.floor(village.resources.stone * 0.3);
      let possibleIron = Math.floor(village.resources.iron * 0.3);
      const totalRequested = possibleWood + possibleStone + possibleIron;
      if (totalRequested > totalCapacity) {
        const ratio = totalCapacity / totalRequested;
        possibleWood = Math.floor(possibleWood * ratio);
        possibleStone = Math.floor(possibleStone * ratio);
        possibleIron = Math.floor(possibleIron * ratio);
      }
      village.resources.wood -= possibleWood;
      village.resources.stone -= possibleStone;
      village.resources.iron -= possibleIron;
      army.loot.wood += possibleWood;
      army.loot.stone += possibleStone;
      army.loot.iron += possibleIron;
      const reportData = {
        vencedor: "ATACANTE",
        resultado: "VICTORY",
        perdas_atacante: lossesQty,
        perdas_defensor: 0,
        loot: { wood: possibleWood, stone: possibleStone, iron: possibleIron }
      };
      eventBus.emit(Events.ATTACK_ARRIVED, {
        entityId: armyId,
        data: {
          result: "VICTORY",
          looted: reportData.loot,
          report: reportData
        }
      });
      console.log(`[COMBAT] VICTORY: Resources captured and casualties reported.`);
    } else {
      const reportData = {
        vencedor: "DEFENSOR",
        resultado: "DEFEAT",
        perdas_atacante: lossesQty,
        perdas_defensor: 0,
        loot: null
      };
      eventBus.emit(Events.ATTACK_ARRIVED, {
        entityId: armyId,
        data: {
          result: "DEFEAT",
          looted: { wood: 0, stone: 0, iron: 0 },
          report: reportData
        }
      });
      console.log(`[COMBAT] DEFEAT: Attack repelled. High casualties sustained.`);
    }
    const remainingTroops = Object.values(army.units).reduce((a, b) => a + b, 0);
    if (remainingTroops <= 0) {
      entityManager.removeEntity(armyId);
    } else {
      entityManager.removeEntity(armyId);
    }
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
class ArmyComponent {
  constructor(ownerId, units = {}, targetId, loot = { wood: 0, stone: 0, iron: 0 }) {
    __publicField(this, "type", "Army");
    this.ownerId = ownerId;
    this.units = units;
    this.targetId = targetId;
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
class MarchComponent {
  constructor(id, originX, originY, targetX, targetY, units, startTime, arrivalTime, returnTime, status) {
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
  }
}
class AttackSystem {
  init() {
    console.log("[SYSTEM] AttackSystem - War Room Operational.");
    eventBus.subscribe(Events.ATTACK_LAUNCH, (payload) => {
      this.launchAttack(payload.data);
    });
  }
  update(deltaTime) {
    const now = Date.now();
    const marches = entityManager.getEntitiesWith(["March"]);
    for (const armyId of marches) {
      const march = entityManager.getComponent(armyId, "March");
      if (march && march.status === "going" && now >= march.arrivalTime) {
        console.log(`[WAR] CONTACT: Army ${armyId} reached objective at ${march.targetX}:${march.targetY}`);
        eventBus.emit("ATTACK:RESOLVE", {
          entityId: armyId,
          timestamp: now,
          data: { march }
        });
        march.status = "completed";
      }
    }
  }
  launchAttack(data) {
    const { originX, originY, targetX, targetY, ownerId, troops } = data;
    const missionId = `MSN_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const armyId = entityManager.createEntity();
    entityManager.addComponent(armyId, new ArmyComponent(ownerId, troops));
    entityManager.addComponent(armyId, new GridPositionComponent(originX, originY, true));
    const dx = targetX - originX;
    const dy = targetY - originY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let slowestSpeed = 10;
    const travelTimeMs = distance / slowestSpeed * (3600 / 5) * 1e3;
    entityManager.addComponent(armyId, new MarchComponent(
      missionId,
      originX,
      originY,
      targetX,
      targetY,
      troops,
      Date.now(),
      Date.now() + travelTimeMs,
      Date.now() + travelTimeMs * 2,
      // Estimativa de retorno
      "going"
    ));
    entityManager.addComponent(armyId, { type: "Army" });
    console.log(`[WAR] Army ${armyId} [${missionId}] deployed. ETA: ${(travelTimeMs / 1e3).toFixed(1)}s`);
  }
  postUpdate(deltaTime) {
  }
  destroy() {
    console.log("[SYSTEM] AttackSystem - War Room Offline.");
  }
}
const attackSystem = new AttackSystem();
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
    __publicField(this, "debug", true);
    // Ativar para monitorização
    __publicField(this, "TILE_SIZE", 64);
  }
  init() {
    console.log("[SYSTEM] RenderSystem - Initializing Visual Canvas...");
    this.createCanvas();
  }
  preUpdate(deltaTime) {
  }
  update(deltaTime) {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.frameCount++;
    const entities = entityManager.getEntitiesWith(["GridPosition"]);
    entities.forEach((entityId) => {
      const gridPos = entityManager.getComponent(entityId, "GridPosition");
      const march = entityManager.getComponent(entityId, "March");
      if (!gridPos) return;
      if (march && march.status !== "completed") {
        const now2 = Date.now();
        if (march.status === "going") {
          const duration = march.arrivalTime - march.startTime;
          if (duration > 0) {
            const progress = Math.min(1, Math.max(0, (now2 - march.startTime) / duration));
            gridPos.x = march.originX + (march.targetX - march.originX) * progress;
            gridPos.y = march.originY + (march.targetY - march.originY) * progress;
          }
        } else if (march.status === "returning") {
          const duration = march.returnTime - march.arrivalTime;
          if (duration > 0) {
            const progress = Math.min(1, Math.max(0, (now2 - march.arrivalTime) / duration));
            gridPos.x = march.targetX + (march.originX - march.targetX) * progress;
            gridPos.y = march.targetY + (march.originY - march.targetY) * progress;
          }
        }
      }
      const pos = {
        x: gridPos.x * this.TILE_SIZE + this.TILE_SIZE / 2,
        y: gridPos.y * this.TILE_SIZE + this.TILE_SIZE / 2
      };
      const sprite = entityManager.getComponent(entityId, "Sprite");
      const health = entityManager.getComponent(entityId, "Health");
      const isSelected = entityManager.getComponent(entityId, "Selection");
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
    console.log("[SYSTEM] SyncSystem - Uplink Established.");
    eventBus.subscribe(Events.LARAVEL_SYNC_ATTACKS, (p) => {
      this.syncLaravelAttacks(p.data.attacks);
    });
    eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
      if (ev.data.report) {
        this.persistReport(ev.data.report);
      }
    });
  }
  async persistReport(report) {
    var _a;
    try {
      await fetch("/api/relatorios/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) || ""
        },
        body: JSON.stringify({
          titulo: `OPERATIONAL REPORT: ${report.resultado}`,
          detalhes: report,
          vencedor_id: report.vencedor === "ATACANTE" ? 1 : 2
          // Mock IDs por agora
        })
      });
      console.log("[SYNC] Battle report uploaded to Central Command.");
    } catch (err) {
      console.error("[SYNC] Failed to transmit battle report:", err);
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
    console.log("[SYSTEM] SyncSystem - Uplink Terminated.");
  }
}
const syncSystem = new SyncSystem();
const systemsRegistry = [
  inputSystem,
  gameModeSystem,
  timeSystem,
  worldSystem,
  resourceSystem,
  buildQueueSystem,
  orderSystem,
  aiSystem,
  movementSystem,
  combatSystem,
  attackSystem,
  visionSystem,
  new ResearchSystem(),
  renderSystem,
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
    console.log("[UI_MGR] Commands Interfaces NORMALIZING.");
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
        console.log(`[UI] Telemetry ${hudVisible ? "ENABLED" : "DISABLED"}`);
      }
    });
    this.createScreens();
  }
  handleModeChange(mode) {
    console.log("CURRENT MODE:", mode);
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
class PlayerComponent {
  constructor() {
    __publicField(this, "type", "Player");
  }
}
class ResourceComponent {
  constructor(wood = 0, stone = 0, iron = 0, cap = 1e4) {
    __publicField(this, "type", "Resource");
    this.wood = wood;
    this.stone = stone;
    this.iron = iron;
    this.cap = cap;
  }
}
class VillageComponent {
  constructor(ownerId, level = 1, resources = { wood: 0, stone: 0, iron: 0 }, name = "Base_Outpost") {
    __publicField(this, "type", "Village");
    this.ownerId = ownerId;
    this.level = level;
    this.resources = resources;
    this.name = name;
  }
}
class BuildingComponent {
  constructor(buildingType, level = 1) {
    __publicField(this, "type", "Building");
    this.buildingType = buildingType;
    this.level = level;
  }
}
class VisionComponent {
  constructor(range = 3) {
    __publicField(this, "type", "Vision");
    this.range = range;
  }
}
console.log("APP START");
console.log("BEFORE GAMELOOP");
gameLoop.start();
uiManager.initialize();
const playerUnit = entityManager.createEntity();
entityManager.addComponent(playerUnit, new PlayerComponent());
const villageEntity = entityManager.createEntity();
entityManager.addComponent(villageEntity, new VillageComponent(
  playerUnit,
  1,
  { wood: 5e3, stone: 5e3, iron: 5e3 },
  "Vila Alfa"
));
entityManager.addComponent(villageEntity, new VisionComponent(5));
entityManager.addComponent(villageEntity, new GridPositionComponent(5, 5));
entityManager.addComponent(villageEntity, {
  type: "Renderable",
  renderType: "building"
});
const villageBeta = entityManager.createEntity();
entityManager.addComponent(villageBeta, new VillageComponent(
  playerUnit,
  1,
  { wood: 2e3, stone: 2e3, iron: 2e3 },
  "Base Beta"
));
entityManager.addComponent(villageBeta, new VisionComponent(5));
entityManager.addComponent(villageBeta, new GridPositionComponent(15, 10));
entityManager.addComponent(villageBeta, {
  type: "Renderable",
  renderType: "building"
});
entityManager.addComponent(playerUnit, new ResourceComponent(5e3, 5e3, 5e3));
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
entityManager.addComponent(qg, new BuildingComponent("HQ", 1));
const mina = entityManager.createEntity();
entityManager.addComponent(mina, new BuildingComponent("MINE", 1));
console.log(`[BOOT] Player Unit Alpha (ID: ${playerUnit}) deployed with Spatial Village infrastructure.`);
const testUnit = entityManager.createEntity();
entityManager.addComponent(testUnit, new PlayerComponent());
entityManager.addComponent(testUnit, new VelocityComponent(0, 0));
entityManager.addComponent(testUnit, new SpriteComponent("/images/unidades/agente_espiao.png"));
console.log(`[BOOT] Test Unit Alpha-Zero (ID: ${testUnit}) deployed at ORIGIN.`);
const enemyUnit = entityManager.createEntity();
entityManager.addComponent(enemyUnit, new VelocityComponent(0, 0));
entityManager.addComponent(enemyUnit, new VelocityComponent(0, 0));
entityManager.addComponent(enemyUnit, new HealthComponent(2e3, 2e3));
entityManager.addComponent(enemyUnit, new AttackComponent(100, 200, 3));
entityManager.addComponent(enemyUnit, new AIComponent("AGGRESSIVE"));
entityManager.addComponent(enemyUnit, new SpriteComponent("/images/unidades/tanque_combate.png"));
console.log(`[BOOT] Enemy Unit Omega (ID: ${enemyUnit}) detected with Main Battle Tank.`);
entityManager.addComponent(enemyUnit, new GridPositionComponent(10, 10));
entityManager.addComponent(enemyUnit, {
  type: "Renderable",
  renderType: "unit"
});
stateManager.setState(GameState.PLAYING);
console.log("--- OPERATIONS ACTIVE: VISUAL TACTICAL ENGAGEMENT ONGOING ---");
//# sourceMappingURL=index-C_CPIqM1.js.map
