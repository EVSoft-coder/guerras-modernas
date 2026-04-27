import { e as entityManager } from "./GameStateService-JU-Qr4Cd.js";
class ResourceSystem {
  init() {
    console.log("[SYSTEM] ResourceSystem - Logistics and Upkeep Engine ACTIVE.");
  }
  update(deltaTime) {
    this.processLogistics(deltaTime);
  }
  processLogistics(deltaTime) {
  }
  sync(resources) {
    if (!resources) return;
    const baseEntity = 1;
    if (entityManager.hasEntity(baseEntity)) {
      const resComp = entityManager.getComponent(baseEntity, "Resource");
      if (resComp) {
        resComp.suprimentos = Number(resources.suprimentos);
        resComp.combustivel = Number(resources.combustivel);
        resComp.municoes = Number(resources.municoes);
        resComp.metal = Number(resources.metal);
        resComp.pessoal = Number(resources.pessoal);
        resComp.energia = Number(resources.energia);
        console.log("[ECS] ResourceSystem - Synchronized via Backend Uplink.");
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
const resourceSystem = new ResourceSystem();
export {
  resourceSystem as r
};
//# sourceMappingURL=ResourceSystem-D4E_jIuV.js.map
