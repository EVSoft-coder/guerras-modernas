import { c as createLucideIcon, B as useToasts, U, C as eventBus, E as Events, y as Sr, j as jsxRuntimeExports, L as Le, $ as $e } from "./app-CmCg_66f.js";
import { A as AppLayout, M as Map, C as ChevronRight, T as Target } from "./app-layout-y2jnNy5w.js";
import { S as Search, a as Crosshair, A as AttackModal } from "./AttackModal-C3aG-Klb.js";
import { g as gameStateService } from "./GameStateService-B978M-Db.js";
import "./app-logo-icon-oUPJKeJ-.js";
import "./index-BHkkpUc9.js";
import "./index-BlI0K2ca.js";
import "./dialog-cmhQmbg5.js";
import "./sword-CoPZhX-M.js";
import "./shield-DZGu2TuQ.js";
import "./loader-circle-DNHNaOJg.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("ChevronDown", __iconNode$3);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("ChevronLeft", __iconNode$2);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("ChevronUp", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
];
const Radio = createLucideIcon("Radio", __iconNode);
const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Mapa TÃ¡tico", href: "/mapa" }
];
function Mapa({ bases, x, y, raio, origemBase, gameConfig, ataquesEnviados, ataquesRecebidos }) {
  const { addToast } = useToasts();
  const [selectedTarget, setSelectedTarget] = U.useState(null);
  const [isSending, setIsSending] = U.useState(false);
  const [jumpX, setJumpX] = U.useState(x);
  const [jumpY, setJumpY] = U.useState(y);
  const [entities, setEntities] = U.useState(gameStateService.getGameState());
  U.useEffect(() => {
    if (ataquesEnviados) gameStateService.syncAttacks(ataquesEnviados);
    if (ataquesRecebidos) gameStateService.syncAttacks(ataquesRecebidos);
    const unsubArrived = eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
      const res = ev.data.result === "VICTORY" ? "VITÃ“RIA" : "MISSÃƒO CONCLUÃDA";
      addToast(`OFENSIVA: ${res} em [${ev.data.targetId || "Sector"}]. Saque iniciado.`, "success");
    });
    const unsubReturned = eventBus.subscribe(Events.ATTACK_RETURNED, (ev) => {
      addToast(`LOGÃSTICA: Tropas regressaram com recursos capturados.`, "info");
      Sr.reload({ only: ["origemBase"] });
    });
    let frameId;
    const sync = () => {
      setEntities([...gameStateService.getGameState()]);
      frameId = requestAnimationFrame(sync);
    };
    frameId = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(frameId);
      unsubArrived();
      unsubReturned();
    };
  }, [ataquesEnviados, ataquesRecebidos]);
  if (typeof window !== "undefined") {
    window.gameConfig = gameConfig;
  }
  const grid = [];
  for (let iy = y - raio; iy <= y + raio; iy++) {
    const row = [];
    for (let ix = x - raio; ix <= x + raio; ix++) {
      const base = bases.find((b) => b.coordenada_x === ix && b.coordenada_y === iy);
      row.push({ x: ix, y: iy, base });
    }
    grid.push(row);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: `Setor [${x}:${y}] - Mapa TÃ¡tico` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black uppercase tracking-tighter flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "text-sky-500", size: 24 }),
            "Setor Operacional [",
            x,
            ":",
            y,
            "]"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-neutral-500 uppercase font-bold tracking-widest", children: "VigilÃ¢ncia de SatÃ©lite em Tempo Real" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: jumpX,
                onChange: (e) => setJumpX(parseInt(e.target.value)),
                className: "w-12 bg-transparent text-center text-xs font-bold border-none focus:ring-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-600", children: ":" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                value: jumpY,
                onChange: (e) => setJumpY(parseInt(e.target.value)),
                className: "w-12 bg-transparent text-center text-xs font-bold border-none focus:ring-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => Sr.get(`/mapa?x=${jumpX}&y=${jumpY}`),
                className: "p-2 hover:bg-sky-500/20 text-sky-500 rounded transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx($e, { href: `/mapa?x=${x}&y=${y - 5}`, className: "p-2 hover:bg-white/10 rounded transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx($e, { href: `/mapa?x=${x}&y=${y + 5}`, className: "p-2 hover:bg-white/10 rounded transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx($e, { href: `/mapa?x=${x - 5}&y=${y}`, className: "p-2 hover:bg-white/10 rounded transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx($e, { href: `/mapa?x=${x + 5}&y=${y}`, className: "p-2 hover:bg-white/10 rounded transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-1 bg-black/20 p-2 rounded-xl border border-white/10 shadow-2xl overflow-auto max-w-full max-h-[70vh]", children: grid.map((row, rowIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: row.map((cell, cellIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => {
            if (cell.base && cell.base.jogador_id === (origemBase == null ? void 0 : origemBase.jogador_id)) return;
            setSelectedTarget(cell.base || { nome: `Setor [${cell.x}:${cell.y}]`, coordenada_x: cell.x, coordenada_y: cell.y, id: null });
          },
          className: `w-12 h-12 md:w-16 md:h-16 border rounded flex flex-col items-center justify-center relative transition-all duration-300 group cursor-pointer
                                            ${cell.base ? cell.base.jogador_id === (origemBase == null ? void 0 : origemBase.jogador_id) ? "bg-green-500/20 border-green-500/40 hover:bg-green-500/40" : "bg-red-500/10 border-red-500/40 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-white/5 border-white/5 hover:border-white/20"}
                                            ${cell.x === x && cell.y === y ? "border-orange-500/60 ring-1 ring-orange-500/40" : ""}
                                            ${(selectedTarget == null ? void 0 : selectedTarget.coordenada_x) === cell.x && (selectedTarget == null ? void 0 : selectedTarget.coordenada_y) === cell.y ? "ring-2 ring-sky-500 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]" : ""}
                                        `,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] text-neutral-600 absolute top-1 left-1", children: [
              cell.x,
              ":",
              cell.y
            ] }),
            cell.base ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 group-hover:scale-110 transition-transform", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 16, className: cell.base.jogador_id === 1 ? "text-green-500" : "text-red-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-bold uppercase truncate w-full text-center px-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 absolute -bottom-8 rounded z-10", children: cell.base.nome })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 12, className: "text-neutral-800 opacity-20 group-hover:opacity-100" })
          ]
        },
        `${cell.x}-${cell.y}`
      )) }, rowIndex)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto bg-black/60 p-4 border-t border-sky-500/30 font-mono text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sky-500 font-black mb-2 uppercase tracking-widest flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 12 }),
          " Telemetria de Unidades ECS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [
          entities.map((ent) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 p-2 rounded border border-white/5 hover:border-sky-500/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-400 font-bold", children: [
              "ENT_",
              ent.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-neutral-400", children: [
              "X: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: Math.round(ent.x) }),
              " | Y: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: Math.round(ent.y) })
            ] }),
            ent.resources && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1 text-[8px] font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-500", children: [
                "S: ",
                ent.resources.suprimentos
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-neutral-400", children: [
                "M: ",
                ent.resources.metal
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-400", children: [
                "E: ",
                ent.resources.energia
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  eventBus.emit({
                    type: Events.BUILDING_REQUEST,
                    entityId: ent.id,
                    timestamp: Date.now(),
                    data: { buildingType: "MINE" }
                  });
                },
                className: "mt-2 w-full py-1 bg-sky-600/40 hover:bg-sky-500 text-[8px] font-black uppercase rounded transition-colors border border-sky-400/30",
                children: "Construir MINE"
              }
            ),
            ent.march && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 bg-red-500/10 p-1 border border-red-500/20 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[7px] font-black uppercase", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: ent.march.state }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
                  ent.march.remainingTime,
                  "s"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1 bg-white/5 mt-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-red-500 transition-all duration-1000",
                  style: { width: `${(1 - ent.march.remainingTime / ent.march.totalTime) * 100}%` }
                }
              ) })
            ] })
          ] }, ent.id)),
          entities.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-4 text-center text-neutral-600 animate-pulse", children: "AGUARDANDO SINCRONIZAÃ‡ÃƒO COM O MOTOR NUCLEAR..." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttackModal,
      {
        isOpen: !!selectedTarget,
        onClose: () => setSelectedTarget(null),
        gameConfig,
        origemBase,
        destinoBase: selectedTarget,
        tropasDisponiveis: (origemBase == null ? void 0 : origemBase.tropas) || [],
        isSending,
        onEnviar: (params) => {
          setIsSending(true);
          const payload = {
            ...params,
            destino_id: selectedTarget == null ? void 0 : selectedTarget.id,
            destino_x: selectedTarget == null ? void 0 : selectedTarget.coordenada_x,
            destino_y: selectedTarget == null ? void 0 : selectedTarget.coordenada_y
          };
          Sr.post("/base/atacar", payload, {
            onSuccess: () => {
              addToast("ORDEM DE MARCHA CONFIRMADA!", "success");
              setSelectedTarget(null);
              setIsSending(false);
              Sr.reload({ only: ["ataquesEnviados"] });
            },
            onError: (e) => {
              addToast(e.error || "FALHA NA TRANSMISSÃƒO", "error");
              setIsSending(false);
            }
          });
        }
      }
    )
  ] });
}
export {
  Mapa as default
};
//# sourceMappingURL=mapa-BcVmqZCW.js.map
