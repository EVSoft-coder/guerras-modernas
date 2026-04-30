import { c as createLucideIcon, u as useToasts, U, f as eventBus, E as Events, S as Sr, j as jsxRuntimeExports, L as Le, $ as $e } from "./app-Bqrpuj8v.js";
import { A as AppLayout, M as Map, C as ChevronRight, b as Crosshair } from "./app-layout-BzfY8TYG.js";
import { C as ChevronUp, a as ChevronDown, A as AttackModal } from "./AttackModal-DT7rntL8.js";
import { g as gameStateService } from "./GameStateService-BVmZf5zp.js";
import { S as Search } from "./search-DbtSuL5d.js";
import { C as ChevronLeft } from "./chevron-left-BfC4bfrF.js";
import { T as Target } from "./target-7yacMeaf.js";
import "./app-logo-icon-BJXCMMJz.js";
import "./index-5XGGm5W9.js";
import "./index-CUsDN7AV.js";
import "./dialog-DIYBhnN7.js";
import "./sword-CkUrd9gy.js";
import "./clock-DUAGrNkR.js";
import "./loader-circle-j5ykWuxy.js";
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
const MapLegend = ({ color, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${color}` }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-500 uppercase tracking-tighter", children: label })
] });
function Mapa({ bases, x, y, raio, origemBase, gameConfig, ataquesEnviados, ataquesRecebidos, diplomacia, userAliancaId, auth, general, targetId, unitTypes }) {
  const { addToast } = useToasts();
  const [selectedTarget, setSelectedTarget] = U.useState(null);
  const [isSending, setIsSending] = U.useState(false);
  const [jumpX, setJumpX] = U.useState(x);
  const [jumpY, setJumpY] = U.useState(y);
  const [entities, setEntities] = U.useState(gameStateService.getGameState());
  U.useEffect(() => {
    if (ataquesEnviados) gameStateService.syncAttacks(ataquesEnviados);
    if (ataquesRecebidos) gameStateService.syncAttacks(ataquesRecebidos);
    if (targetId) {
      const target = bases.find((b) => b.id === parseInt(targetId));
      if (target) setSelectedTarget(target);
    }
    const unsubArrived = eventBus.subscribe(Events.ATTACK_ARRIVED, (ev) => {
      const res = ev.data.result === "VICTORY" ? "VITÃ“RIA" : "MISSÃƒO CONCLUÃ DA";
      addToast(`OFENSIVA: ${res} em [${ev.data.targetId || "Sector"}]. Saque iniciado.`, "success");
    });
    const unsubReturned = eventBus.subscribe(Events.ATTACK_RETURNED, (ev) => {
      addToast(`LOGÃ STICA: Tropas regressaram com recursos capturados.`, "info");
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
  const getDiplomacyStatus = (targetAliancaId) => {
    if (!targetAliancaId || !userAliancaId) return null;
    if (targetAliancaId === userAliancaId) return "OWN_ALLY";
    const relation = diplomacia.find((d) => d.alvo_alianca_id === targetAliancaId);
    return (relation == null ? void 0 : relation.tipo) || null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: `Setor [${x}:${y}] - Mapa Tático` }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-neutral-500 uppercase font-bold tracking-widest", children: "Vigilância de Satélite em Tempo Real" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapLegend, { color: "bg-emerald-500", label: "Próprio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapLegend, { color: "bg-sky-500", label: "Aliado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapLegend, { color: "bg-teal-400", label: "PNA" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapLegend, { color: "bg-red-500", label: "Inimigo" })
            ] })
          ] })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-[2px] bg-black/20 p-2 rounded-xl border border-white/10 shadow-2xl overflow-auto max-w-full max-h-[75vh]", children: grid.map((row, rowIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-[2px]", children: row.map((cell, cellIndex) => {
        var _a, _b, _c, _d;
        const isOwn = cell.base && ((_a = auth.user) == null ? void 0 : _a.id) && cell.base.jogador_id === auth.user.id;
        const isNpc = (_b = cell.base) == null ? void 0 : _b.is_npc;
        const isCenter = cell.x === x && cell.y === y;
        const isSelected = (selectedTarget == null ? void 0 : selectedTarget.coordenada_x) === cell.x && (selectedTarget == null ? void 0 : selectedTarget.coordenada_y) === cell.y;
        const diploStatus = ((_d = (_c = cell.base) == null ? void 0 : _c.jogador) == null ? void 0 : _d.alianca_id) ? getDiplomacyStatus(cell.base.jogador.alianca_id) : null;
        let cellClass = "bg-white/[0.03] border-white/[0.04] hover:border-white/20";
        if (cell.base) {
          if (isOwn) cellClass = "bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/40";
          else if (isNpc) cellClass = "bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/30";
          else {
            switch (diploStatus) {
              case "OWN_ALLY":
              case "aliado":
                cellClass = "bg-sky-500/20 border-sky-500/40 hover:bg-sky-500/40";
                break;
              case "pna":
                cellClass = "bg-teal-400/20 border-teal-400/40 hover:bg-teal-400/40";
                break;
              case "inimigo":
                cellClass = "bg-red-600/30 border-red-500/50 hover:bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                break;
              default:
                cellClass = "bg-red-500/10 border-red-500/40 hover:bg-red-500/30 hover:shadow-[0_0_10px_rgba(239,68,68,0.15)]";
            }
          }
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => {
              if (isOwn) return;
              setSelectedTarget(cell.base || { nome: `Setor [${cell.x}:${cell.y}]`, coordenada_x: cell.x, coordenada_y: cell.y, id: null });
            },
            title: cell.base ? `${cell.base.nome} [${cell.x}:${cell.y}]${isNpc ? " (NPC)" : ""}` : `${cell.x}:${cell.y}`,
            className: `w-8 h-8 md:w-10 md:h-10 border rounded-sm flex items-center justify-center relative transition-all duration-200 group cursor-pointer
                                                ${cellClass}
                                                ${isCenter ? "border-orange-500/60 ring-1 ring-orange-500/40" : ""}
                                                ${isSelected ? "ring-2 ring-sky-500 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]" : ""}
                                            `,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[6px] text-neutral-700 absolute top-0 left-0.5 hidden md:block", children: [
                cell.x,
                ":",
                cell.y
              ] }),
              cell.base ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: isNpc ? /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 12, className: "text-amber-500" }) : isOwn ? /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 12, className: "text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 12, className: diploStatus === "aliado" || diploStatus === "OWN_ALLY" ? "text-sky-400" : diploStatus === "pna" ? "text-teal-400" : "text-red-500" }) }) : null
            ]
          },
          `${cell.x}-${cell.y}`
        );
      }) }, rowIndex)) }) }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  eventBus.emit(Events.BUILDING_REQUEST, {
                    entityId: ent.id,
                    timestamp: Date.now(),
                    data: { buildingType: "MINE" }
                  });
                },
                className: "mt-2 w-full py-1 bg-sky-600/40 hover:bg-sky-500 text-[8px] font-black uppercase rounded transition-colors border border-sky-400/30",
                children: "Construir MINE"
              }
            ),
            ent.march && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 bg-red-500/10 p-1 border border-red-500/20 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[7px] font-black uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "EM MOVIMENTO" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
                Math.round(ent.march.remainingTime),
                "s"
              ] })
            ] }) })
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
        tropasDisponiveis: (origemBase == null ? void 0 : origemBase.units) || [],
        isSending,
        general,
        unitTypes,
        onEnviar: (params) => {
          setIsSending(true);
          const payload = {
            ...params,
            origem_id: origemBase == null ? void 0 : origemBase.id,
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
//# sourceMappingURL=mapa-Cv-tlA1B.js.map
