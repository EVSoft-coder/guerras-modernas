var G=Object.defineProperty;var P=(d,e,t)=>e in d?G(d,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[e]=t;var c=(d,e,t)=>P(d,typeof e!="symbol"?e+"":e,t);import{C as r,E as p}from"./app-CX9FUG-q.js";import{g as _,e as n,G as f,s as b,a as x}from"./GameStateService-CsgvNyaT.js";class w{static info(e){console.log(`[INFO] [${new Date().toISOString()}] ${e}`)}static warn(e){console.warn(`[WARN] [${new Date().toISOString()}] ${e}`)}static error(e,t){console.error(`[ERROR] [${new Date().toISOString()}] ${e}`,t)}static event(e,t){}}class k{constructor(){c(this,"keys",{up:!1,down:!1,left:!1,right:!1})}init(){console.log("[SYSTEM] InputSystem - Continuous Sensors ONLINE."),window.addEventListener("keydown",e=>this.handleKeyDown(e)),window.addEventListener("keyup",e=>this.handleKeyUp(e))}handleKeyDown(e){this.updateKeyState(e.code,!0),r.emit({type:p.INPUT_KEY_DOWN,timestamp:Date.now(),data:{code:e.code}})}handleKeyUp(e){this.updateKeyState(e.code,!1),r.emit({type:p.INPUT_KEY_UP,timestamp:Date.now(),data:{code:e.code}})}updateKeyState(e,t){switch(e){case"KeyW":case"ArrowUp":this.keys.up=t;break;case"KeyS":case"ArrowDown":this.keys.down=t;break;case"KeyA":case"ArrowLeft":this.keys.left=t;break;case"KeyD":case"ArrowRight":this.keys.right=t;break}}preUpdate(e){}update(e){r.emit({type:"PLAYER:INPUT_STATE",timestamp:Date.now(),data:{...this.keys}})}postUpdate(e){}destroy(){console.log("[SYSTEM] InputSystem - Continuous Sensors OFFLINE.")}}const B=new k;class V{constructor(){c(this,"currentMode","VILLAGE")}init(){console.log("GameModeSystem INIT"),console.log(`[SYSTEM] GameModeSystem - Strategy Layer ONLINE. Initial Mode: ${this.currentMode}`),r.subscribe("GAME:CHANGE_MODE",e=>{console.log("MODE CHANGE EVENT RECEIVED",e),e.data&&e.data.mode&&this.handleModeChange(e.data.mode)})}handleModeChange(e){if(console.log("MODE CHANGED:",e),e!=="VILLAGE"&&e!=="WORLD_MAP"){console.error(`[GAMEMODE_SYSTEM] Invalid mode requested: ${e}`);return}this.currentMode!==e&&(console.log(`[GAMEMODE_SYSTEM] Perspective shift: ${this.currentMode} -> ${e}`),this.currentMode=e,_.setMode(e))}getCurrentMode(){return this.currentMode}preUpdate(e){}update(e){}postUpdate(e){}destroy(){console.log("[SYSTEM] GameModeSystem - Strategy Layer OFFLINE.")}}const Y=new V;class ${constructor(){c(this,"accumulator",0);c(this,"TICK_INTERVAL",1)}init(){console.log("[SYSTEM] TimeSystem - Global Clock ONLINE.")}preUpdate(e){}update(e){this.accumulator+=e,this.accumulator>=this.TICK_INTERVAL&&(this.emitTick(),this.accumulator-=this.TICK_INTERVAL)}emitTick(){r.emit({type:"GAME:TICK",timestamp:Date.now(),data:{deltaTime:this.TICK_INTERVAL}})}postUpdate(e){}destroy(){console.log("[SYSTEM] TimeSystem - Global Clock OFFLINE.")}}const z=new $,W={mina_suprimentos:{resource:"wood",baseProduction:10},refinaria:{resource:"iron",baseProduction:5},fabrica_municoes:{resource:"stone",baseProduction:5}};class H{init(){console.log("[SYSTEM] ResourceSystem - Economic Core ONLINE."),r.subscribe("GAME:TICK",e=>{this.generateResources()})}generateResources(){const e=n.getEntitiesWith(["Resource","Building"]);for(const t of e){const o=n.getComponent(t,"Resource"),i=n.getComponent(t,"Building");if(o&&i){const s=W[i.type];if(!s)continue;const a=i.level||1,l=s.baseProduction*a;s.resource==="all"?(o.wood+=l,o.stone+=l,o.iron+=l):o[s.resource]+=l}}}preUpdate(e){}update(e){}postUpdate(e){}destroy(){console.log("[SYSTEM] ResourceSystem - Economic Core OFFLINE.")}}const K=new H;class F{constructor(e=[]){c(this,"type","BuildQueue");this.queue=e}}class q{init(){console.log("[SYSTEM] BuildQueueSystem - Logistics Core ONLINE."),r.subscribe(p.BUILDING_UPGRADE_REQUEST,e=>{this.handleUpgradeRequest(e)})}handleUpgradeRequest(e){const t=e.data.id;if(t===void 0)return;const o=n.getComponent(t,"Building");if(!o)return;const i=o.villageId,s=n.getComponent(i,"Resource"),a=n.getComponent(i,"BuildQueue");if(!s||!a){console.error(`[BUILD_SYSTEM] Owner ${i} missing Resource or BuildQueue components.`);return}const l=o.level*150;if(s.wood>=l&&s.stone>=l&&s.iron>=l){s.wood-=l,s.stone-=l,s.iron-=l;const h=o.level*5;a.queue.push({type:"UPGRADE",buildingType:o.buildingType,targetEntityId:t,totalTime:h,remainingTime:h}),console.log(`[BUILD_SYSTEM] Upgrade of ${o.name} (LVL ${o.level} -> ${o.level+1}) initiated for Player ${i}.`),r.emit({type:p.BUILDING_REQUEST,entityId:i,timestamp:Date.now(),data:{status:"STARTED",buildingId:t}})}else console.warn(`[BUILD_SYSTEM] Insufficient resources for upgrade of ${o.name}. Required: ${l}`)}update(e){const t=n.getEntitiesWith(["BuildQueue"]);for(const o of t){const i=n.getComponent(o,"BuildQueue");if(i&&i.queue.length>0){const s=i.queue[0];s.remainingTime-=e,s.remainingTime<=0&&(i.queue.shift(),this.completeTask(s))}}}completeTask(e){if(e.type==="UPGRADE"&&e.targetEntityId!==void 0){const t=n.getComponent(e.targetEntityId,"Building");t&&(t.level+=1,console.log(`[BUILD_SYSTEM] Building ${t.name} upgraded to Level ${t.level}!`),r.emit({type:p.BUILDING_COMPLETED,entityId:e.targetEntityId,timestamp:Date.now(),data:{buildingType:e.buildingType,newLevel:t.level}}))}}preUpdate(e){}postUpdate(e){}destroy(){console.log("[SYSTEM] BuildQueueSystem - Logistics Core OFFLINE.")}}const Q=new q;class M{constructor(e=100,t=100){c(this,"type","Health");this.value=e,this.max=t}}class v{constructor(e){c(this,"type","Sprite");this.imagePath=e}}class N{constructor(e=10,t=50,o=1,i=0){c(this,"type","Attack");this.power=e,this.range=t,this.cooldown=o,this.lastAttack=i}}class X{constructor(e="AGGRESSIVE"){c(this,"type","AI");this.behavior=e}}class L{constructor(e,t){c(this,"type","Target");this.x=e,this.y=t}}class Z{constructor(e=!0){c(this,"type","Selection");this.isSelected=e}}class j{init(){console.log("[SYSTEM] OrderSystem - Tactical Downlink ACTIVE."),window.addEventListener("mousedown",this.handleMouseClick.bind(this)),window.addEventListener("contextmenu",e=>e.preventDefault())}preUpdate(e){}update(e){}handleMouseClick(e){const t=e.clientX,o=e.clientY;e.button===0?this.processSelection(t,o):e.button===2&&this.processMoveOrder(t,o)}processSelection(e,t){const o=n.getEntitiesWith(["Position","Sprite"]);let i=!1;n.getEntitiesWith(["Selection"]).forEach(a=>n.removeComponent(a,"Selection"));for(const a of o){const l=n.getComponent(a,"Position");if(Math.sqrt(Math.pow(e-l.x,2)+Math.pow(t-l.y,2))<40){n.addComponent(a,new Z),r.emit({type:p.PLAYER_UNIT_SELECTED,entityId:a,timestamp:Date.now(),data:{x:l.x,y:l.y}}),i=!0;break}}i||r.emit({type:p.PLAYER_SELECTION_CLEARED,timestamp:Date.now(),data:{}})}processMoveOrder(e,t){n.getEntitiesWith(["Selection","Position"]).forEach(i=>{n.addComponent(i,new L(e,t)),r.emit({type:p.PLAYER_MOVE_ORDER,entityId:i,timestamp:Date.now(),data:{targetX:e,targetY:t}})})}postUpdate(e){}destroy(){window.removeEventListener("mousedown",this.handleMouseClick),console.log("[SYSTEM] OrderSystem - Tactical Downlink Offline.")}}const J=new j;class ee{init(){console.log("[SYSTEM] AISystem - Decision Engine ACTIVE.")}preUpdate(e){}update(e){const t=n.getEntitiesWith(["AI","Position"]),o=n.getEntitiesWith(["Health","Position"]);for(const i of t){if(n.getComponent(i,"Target"))continue;const s=n.getComponent(i,"AI"),a=n.getComponent(i,"Position");s.behavior==="AGGRESSIVE"&&this.pursueTarget(i,a,o)}}pursueTarget(e,t,o){let i=1/0,s=null;for(const a of o){if(a===e)continue;const l=n.getComponent(a,"Position"),m=Math.sqrt(Math.pow(l.x-t.x,2)+Math.pow(l.y-t.y,2));m<i&&(i=m,s=l)}s&&i>20&&n.addComponent(e,new L(s.x,s.y))}postUpdate(e){}destroy(){console.log("[SYSTEM] AISystem - Decision Engine SUSPENDED.")}}const te=new ee;class oe{init(){console.log("[SYSTEM] MovementSystem - Cinematic Processor ONLINE."),r.subscribe("PLAYER:INPUT_STATE",e=>{this.handleInputState(e.data)})}handleInputState(e){const t=n.getEntitiesWith(["Position","Velocity","Player"]);for(const o of t){const i=n.getComponent(o,"Velocity");if(!i)continue;i.vx=0,i.vy=0,e.up&&(i.vy-=1),e.down&&(i.vy+=1),e.left&&(i.vx-=1),e.right&&(i.vx+=1);const s=Math.sqrt(i.vx*i.vx+i.vy*i.vy);s>0&&(i.vx/=s,i.vy/=s)}}preUpdate(e){}update(e){const t=n.getEntitiesWith(["Position","Velocity"]);for(const o of t){const i=n.getComponent(o,"Position"),s=n.getComponent(o,"Velocity");i&&s&&(i.x+=s.vx*e,i.y+=s.vy*e)}}postUpdate(e){}destroy(){console.log("[SYSTEM] MovementSystem - Cinematic Processor OFFLINE.")}}const ne=new oe;class ie{init(){console.log("[SYSTEM] CombatSystem - Engagement Protocols Normalizing.")}preUpdate(e){}update(e){const t=Date.now()/1e3,o=n.getEntitiesWith(["Attack","Position"]),i=n.getEntitiesWith(["Health","Position"]);for(const s of o){const a=n.getComponent(s,"Attack"),l=n.getComponent(s,"Position");if(!(t-a.lastAttack<a.cooldown))for(const m of i){if(s===m)continue;const h=n.getComponent(m,"Position");if(Math.sqrt(Math.pow(h.x-l.x,2)+Math.pow(h.y-l.y,2))<=a.range){this.executeAttack(s,m,a.power),a.lastAttack=t;break}}}}executeAttack(e,t,o){const i=n.getComponent(t,"Health");i&&(i.value-=o,r.emit({type:p.COMBAT_UNIT_DAMAGED,entityId:t,timestamp:Date.now(),data:{attackerId:e,damage:o,newHealth:i.value}}),i.value<=0&&r.emit({type:p.COMBAT_UNIT_DESTROYED,entityId:t,timestamp:Date.now(),data:{attackerId:e}}))}postUpdate(e){}destroy(){console.log("[SYSTEM] CombatSystem - Engagement Suspended.")}}const se=new ie;class ae{init(){console.log("[SYSTEM] AttackSystem - Frontline Deployment Operational."),r.subscribe("GAME:TICK",()=>{this.processMarches()})}processMarches(){const e=n.getEntitiesWith(["AttackMarch"]);for(const t of e){const o=n.getComponent(t,"AttackMarch");o&&(o.remainingTime-=1,o.remainingTime<=0&&this.handleMarchArrival(t,o))}}handleMarchArrival(e,t){t.state==="GOING"?(console.log(`[WAR] Attack arrived at [${t.targetX}:${t.targetY}]`),this.resolveCombat(e,t)):t.state==="RETURNING"&&(console.log(`[WAR] Attack returned to origin ${t.originId}`),this.concludeMarch(e,t))}resolveCombat(e,t){const o=n.getEntitiesWith(["Position","Resource"]);let i=null;for(const s of o){const a=n.getComponent(s,"Position");if(Math.round(a.x)===t.targetX&&Math.round(a.y)===t.targetY){i=s;break}}if(i!==null){const s=n.getComponent(i,"Resource");t.loot.wood=Math.floor(s.wood*.5),t.loot.stone=Math.floor(s.stone*.5),t.loot.iron=Math.floor(s.iron*.5),s.wood-=t.loot.wood,s.stone-=t.loot.stone,s.iron-=t.loot.iron,r.emit({type:p.ATTACK_ARRIVED,entityId:e,timestamp:Date.now(),data:{result:"VICTORY",loot:t.loot,targetId:i}})}else r.emit({type:p.ATTACK_ARRIVED,entityId:e,timestamp:Date.now(),data:{result:"EMPTY_TARGET",loot:t.loot}});t.state="RETURNING",t.remainingTime=t.totalTime}concludeMarch(e,t){const o=n.getComponent(t.originId,"Resource");o&&(o.wood+=t.loot.wood,o.stone+=t.loot.stone,o.iron+=t.loot.iron),r.emit({type:p.ATTACK_RETURNED,entityId:e,timestamp:Date.now(),data:{originId:t.originId,finalLoot:t.loot}}),n.destroyEntity(e)}preUpdate(e){}update(e){}postUpdate(e){}destroy(){console.log("[SYSTEM] AttackSystem - Frontline Deployment Offline.")}}const de=new ae;class le{constructor(){c(this,"canvas",null);c(this,"ctx",null);c(this,"images",new Map)}init(){console.log("[SYSTEM] RenderSystem - Initializing Visual Canvas..."),this.createCanvas()}preUpdate(e){}update(e){if(!this.ctx||!this.canvas)return;this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),n.getEntitiesWith(["Position"]).forEach(o=>{const i=n.getComponent(o,"Position");console.log("RENDER ENTITY:",i);const s=n.getComponent(o,"Sprite"),a=n.getComponent(o,"Health"),l=n.getComponent(o,"Selection");this.drawEntity(i,s,a,l,o)})}createCanvas(){const e=document.createElement("canvas");e.id="battle-canvas",e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100vw",e.style.height="100vh",e.style.zIndex="50",e.style.pointerEvents="none",e.width=window.innerWidth,e.height=window.innerHeight,document.body.appendChild(e),this.canvas=e,this.ctx=e.getContext("2d")}drawEntity(e,t,o,i,s){if(!this.ctx)return;const a=32,l=n.getComponent(s,"Player"),m=n.getComponent(s,"AI");if(this.ctx.fillStyle=l?"#0ea5e9":m?"#ef4444":"#ffffff",this.ctx.fillRect(e.x-a/2,e.y-a/2,a,a),i&&(this.ctx.strokeStyle="#00ff00",this.ctx.lineWidth=2,this.ctx.strokeRect(e.x-a/2-2,e.y-a/2-2,a+4,a+4)),o){const U=o.value/o.max;this.ctx.fillStyle="#333333",this.ctx.fillRect(e.x-32/2,e.y-a/2-10,32,4),this.ctx.fillStyle=l?"#22c55e":"#ef4444",this.ctx.fillRect(e.x-32/2,e.y-a/2-10,32*U,4)}}postUpdate(e){}destroy(){this.canvas&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}}const re=new le,y=[B,Y,z,K,Q,J,te,ne,se,de,re];class ce{constructor(){c(this,"lastTime",0);c(this,"running",!1);c(this,"frameId",null)}start(){this.running||(this.running=!0,w.info("[ENGINE] GameLoop starting sequence..."),y.forEach(e=>{try{e.init()}catch(t){console.error("[CRITICAL_FAILURE] System init error:",e,t)}}),this.lastTime=performance.now(),this.frameId=requestAnimationFrame(this.loop.bind(this)))}loop(e){if(!this.running)return;const t=(e-this.lastTime)/1e3;this.lastTime=e;try{y.forEach(o=>o.preUpdate(t)),y.forEach(o=>o.update(t)),y.forEach(o=>o.postUpdate(t))}catch(o){console.error("[GAMELOOP_EXCEPTION] State integrity compromised:",o)}this.frameId=requestAnimationFrame(this.loop.bind(this))}stop(){this.running=!1,this.frameId!==null&&cancelAnimationFrame(this.frameId),y.forEach(e=>e.destroy()),w.info("[ENGINE] GameLoop halted.")}}const pe=new ce;class me{show(){const e=document.getElementById("tactical-hud");e&&(e.style.display="block")}hide(){const e=document.getElementById("tactical-hud");e&&(e.style.display="none")}initialize(){this.createDOM(),this.subscribeToEvents(),console.log("[UI_HUD] Tactical Monitors & Navigation ONLINE.")}createDOM(){var t,o;const e=document.createElement("div");e.id="tactical-hud",e.style.cssText=`
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
        `,e.innerHTML=`
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
        `,document.body.appendChild(e),(t=document.getElementById("nav-village"))==null||t.addEventListener("click",()=>{console.log("CLICK BASE"),this.changeMode("VILLAGE")}),(o=document.getElementById("nav-map"))==null||o.addEventListener("click",()=>{console.log("CLICK MAPA"),r.emit({type:p.GAME_CHANGE_MODE,timestamp:Date.now(),data:{mode:"WORLD_MAP"}})})}changeMode(e){r.emit({type:p.GAME_CHANGE_MODE,timestamp:Date.now(),data:{mode:e}})}subscribeToEvents(){r.subscribe(p.COMBAT_UNIT_DAMAGED,e=>{this.updateHealth(e.data.newHealth)}),r.subscribe(p.PLAYER_MOVE_ORDER,e=>{this.updateProgress(e.data.targetX)}),r.subscribe(p.GAME_STATE_CHANGED,e=>{this.updateState(e.data.newState)}),r.subscribe(p.GAMEMODE_CHANGED,e=>{this.updateNavButtons(e.data.mode)})}updateNavButtons(e){const t=document.getElementById("nav-village"),o=document.getElementById("nav-map");e==="VILLAGE"?(t&&(t.style.background="#00ff00",t.style.color="#000"),o&&(o.style.background="#000",o.style.color="#00ff00")):(t&&(t.style.background="#000",t.style.color="#00ff00"),o&&(o.style.background="#00ff00",o.style.color="#000"))}updateHealth(e){const t=document.getElementById("hud-health");t&&(t.innerText=`INTEGRITY: ${Math.max(0,e)}%`)}updateProgress(e){const t=document.getElementById("hud-score");t&&(t.innerText=`DESTINATION_X: ${Math.floor(e)}m`)}updateState(e){const t=document.getElementById("hud-state");t&&(t.innerText=`STATUS: ${e}`)}}const S=new me;class ue{constructor(){c(this,"container",null);c(this,"CELL_SIZE",120);c(this,"selectedBuildingId",null)}initialize(){this.createDOM(),this.setupInteractions(),this.startUpdateLoop(),console.log("[UI_VILLAGE] Command & Upgrade Interface ONLINE.")}createDOM(){this.container=document.createElement("div"),this.container.id="village-view-container",this.container.style.cssText=`
            position: absolute;
            top: 150px;
            left: 20px;
            z-index: 1000;
            display: none; /* Escondido por defeito */
            gap: 20px;
            font-family: 'Courier New', Courier, monospace;
        `,document.body.appendChild(this.container)}show(){this.container&&(this.container.style.display="flex")}hide(){this.container&&(this.container.style.display="none")}setupInteractions(){this.container&&this.container.addEventListener("click",e=>{const t=e.target;if(t.closest('[data-action="upgrade"]')&&this.selectedBuildingId){this.requestUpgrade(this.selectedBuildingId);return}const i=t.closest("[data-entity-id]");if(i){const s=parseInt(i.getAttribute("data-entity-id")||"0");this.selectBuilding(s)}else t.id==="grid-canvas"&&(this.selectedBuildingId=null)})}selectBuilding(e){this.selectedBuildingId=e,r.emit({type:p.BUILDING_SELECTED,entityId:e,timestamp:Date.now(),data:{id:e}})}requestUpgrade(e){r.emit({type:p.BUILDING_UPGRADE_REQUEST,entityId:e,timestamp:Date.now(),data:{id:e}})}startUpdateLoop(){setInterval(()=>this.update(),500)}update(){if(!this.container)return;const e=n.getEntitiesWith(["Building"]);let t=`
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
        `;e.forEach(i=>{const s=n.getComponent(i,"Building");if(s){const a=s.position.x*this.CELL_SIZE,l=s.position.y*this.CELL_SIZE,m=this.selectedBuildingId===i;t+=`
                    <div data-entity-id="${i}" style="
                        position: absolute;
                        left: ${a}px;
                        top: ${l}px;
                        width: 100px;
                        height: 100px;
                        background: ${m?"rgba(0, 255, 0, 0.2)":"rgba(0, 255, 0, 0.05)"};
                        border: 2px solid ${m?"#fff":"#00ff00"};
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        padding: 10px;
                        box-sizing: border-box;
                        cursor: pointer;
                        ${m?"box-shadow: 0 0 15px #fff;":""}
                    ">
                        <div style="font-size: 9px; opacity: 0.7; color: #00ff00;">[[${s.buildingType}]]</div>
                        <div style="font-size: 11px; margin: 8px 0; font-weight: bold; color: #00ff00;">${s.name.toUpperCase()}</div>
                        <div style="color: #000; background: #00ff00; padding: 1px 6px; font-size: 10px; font-weight: bold;">LV ${s.level}</div>
                    </div>
                `}}),t+="</div></div>";let o="";if(this.selectedBuildingId){const i=n.getComponent(this.selectedBuildingId,"Building");i&&(o=`
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
                            <div style="font-size: 18px; color: #fff;">${i.name}</div>
                        </div>

                        <div>
                            <div style="font-size: 10px; color: #666;">RANK_STATUS</div>
                            <div style="font-size: 14px;">LEVEL ${i.level}</div>
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
                `)}this.container.innerHTML=t+o}}const E=new ue;class ge{constructor(){c(this,"container",null)}initialize(){this.createDOM(),console.log("[UI_MAP] World Map View INITIALIZED.")}createDOM(){this.container=document.createElement("div"),this.container.id="world-map-view",this.container.style.cssText=`
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
        `,this.container.innerHTML=`
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
        `,document.body.appendChild(this.container)}show(){this.container&&(this.container.style.display="block")}hide(){this.container&&(this.container.style.display="none")}}const T=new ge;class he{constructor(){c(this,"screens",new Map)}initialize(){console.log("[UI_MGR] Commands Interfaces NORMALIZING."),S.initialize(),E.initialize(),T.initialize(),r.subscribe(p.GAMEMODE_CHANGED,t=>{this.handleModeChange(t.data.mode)}),r.subscribe(p.GAME_STATE_CHANGED,t=>{const o=t.data.newState;this.handleStateChange(o),o===f.PLAYING?this.handleModeChange(b.getMode()):(E.hide(),T.hide())});let e=!1;r.subscribe(p.INPUT_KEY_DOWN,t=>{t.data.code==="KeyT"&&(e=!e,e?(S.show(),b.getMode()===x.VILLAGE&&E.show()):(S.hide(),E.hide()),console.log(`[UI] Telemetry ${e?"ENABLED":"DISABLED"}`))}),this.createScreens()}handleModeChange(e){console.log("CURRENT MODE:",e),e===x.WORLD_MAP?(E.hide(),T.show()):T.hide()}handleStateChange(e){this.screens.forEach(o=>{o.style.display="none",o.style.pointerEvents="none"});const t=this.screens.get(e);t&&(t.style.display="flex",t.style.pointerEvents=e===f.PLAYING?"none":"auto")}createScreens(){const e=this.createScreen(f.MENU,"MAIN_MENU");e.innerHTML=`
            <div style="text-align: center;">
                <h1 style="font-size: 64px; margin-bottom: 20px;">GUERRAS MODERNAS</h1>
                <p style="font-size: 16px; color: #aaa; margin-bottom: 50px;">DOUCTRINE V1.2 - NORMALIZED SIGNAL</p>
                <button id="btn-start" style="padding: 15px 40px; font-size: 20px; cursor: pointer; background: #00ff00; color: #000; font-weight: bold; border: none;">START_MISSION</button>
            </div>
        `,document.body.appendChild(e);const t=this.createScreen(f.PLAYING,"GAME_SCREEN");document.body.appendChild(t);const o=this.createScreen(f.PAUSED,"PAUSE_SCREEN");o.innerHTML=`
            <div style="text-align: center; background: rgba(0,0,0,0.8); padding: 40px; border: 2px solid #00ff00;">
                <h2 style="font-size: 48px;">PAUSE</h2>
                <p>DOCTRINE VALIDATION ACTIVE</p>
            </div>
        `,document.body.appendChild(o)}createScreen(e,t){const o=document.createElement("div");return o.id=t,o.style.position="fixed",o.style.top="0",o.style.left="0",o.style.width="100vw",o.style.height="100vh",o.style.display="none",o.style.flexDirection="column",o.style.alignItems="center",o.style.justifyContent="center",o.style.backgroundColor="transparent",o.style.color="#fff",o.style.fontFamily="monospace",o.style.zIndex="400",o.style.pointerEvents="none",this.screens.set(e,o),o}}const fe=new he;class A{constructor(e=0,t=0){c(this,"type","Position");this.x=e,this.y=t}}class C{constructor(e=0,t=0){c(this,"type","Velocity");this.vx=e,this.vy=t}}class R{constructor(){c(this,"type","Player")}}class ye{constructor(e=0,t=0,o=0){c(this,"type","Resource");this.wood=e,this.stone=t,this.iron=o}}class Ee{constructor(e){c(this,"type","Village");this.name=e}}class D{constructor(e,t,o,i,s){c(this,"type","Building");this.name=e,this.buildingType=t,this.level=o,this.position=i,this.villageId=s}}console.log("APP START");console.log("BEFORE GAMELOOP");pe.start();fe.initialize();const u=n.createEntity();n.addComponent(u,new R);n.addComponent(u,new ye(5e3,5e3,5e3));n.addComponent(u,new F);n.addComponent(u,new Ee("Vila Alfa"));n.addComponent(u,new A(100,200));n.addComponent(u,new C(0,0));n.addComponent(u,new M(1e3,1e3));n.addComponent(u,new N(50,150,1));n.addComponent(u,new v("/images/unidades/blindado_apc.png"));n.addComponent(u,{type:"Position",x:100,y:100});n.addComponent(u,{type:"Renderable",renderType:"unit"});const Ie=n.createEntity();n.addComponent(Ie,new D("Quartel General","HQ",1,{x:0,y:0},u));const Te=n.createEntity();n.addComponent(Te,new D("Mina de Ferro","MINE",1,{x:1,y:0},u));console.log(`[BOOT] Player Unit Alpha (ID: ${u}) deployed with Spatial Village infrastructure.`);const I=n.createEntity();n.addComponent(I,new R);n.addComponent(I,new A(0,0));n.addComponent(I,new C(0,0));n.addComponent(I,new v("/images/unidades/agente_espiao.png"));console.log(`[BOOT] Test Unit Alpha-Zero (ID: ${I}) deployed at ORIGIN.`);const g=n.createEntity();n.addComponent(g,new A(500,200));n.addComponent(g,new C(0,0));n.addComponent(g,new M(2e3,2e3));n.addComponent(g,new N(100,200,3));n.addComponent(g,new X("AGGRESSIVE"));n.addComponent(g,new v("/images/unidades/tanque_combate.png"));console.log(`[BOOT] Enemy Unit Omega (ID: ${g}) detected with Main Battle Tank.`);n.addComponent(g,{type:"Position",x:500,y:200});n.addComponent(g,{type:"Renderable",renderType:"unit"});b.setState(f.PLAYING);console.log("--- OPERATIONS ACTIVE: VISUAL TACTICAL ENGAGEMENT ONGOING ---");
