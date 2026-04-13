import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, Z as Zap } from "./app-D-1ZeixE.js";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogDescription } from "./dialog-02l4DUmy.js";
import { c as cn, a as cva, B as Button } from "./app-logo-icon-BXpRMiVG.js";
import { T as Target, C as ChevronRight } from "./app-layout-CCMk9I_B.js";
import { S as Sword } from "./sword-BDWiZlwj.js";
import { S as Shield } from "./shield-6nCEncAs.js";
import { L as LoaderCircle } from "./loader-circle-CVXFMmdA.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("Clock", __iconNode$3);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "l9bcsi" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12", key: "13hhkx" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2", key: "10w3f3" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18", key: "15g9kq" }]
];
const Crosshair = createLucideIcon("Crosshair", __iconNode$2);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("Flag", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
];
const Search = createLucideIcon("Search", __iconNode);
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const AttackModal = ({
  isOpen,
  onClose,
  origemBase,
  destinoBase,
  tropasDisponiveis,
  onEnviar,
  isSending,
  gameConfig
}) => {
  const [selectedTropas, setSelectedTropas] = reactExports.useState({});
  const [missionType, setMissionType] = reactExports.useState("ataque");
  reactExports.useMemo(() => {
    if (isOpen) {
      const initial = {};
      tropasDisponiveis.forEach((t) => {
        initial[t.unidade] = 0;
      });
      setSelectedTropas(initial);
      setMissionType("ataque");
    }
  }, [isOpen]);
  const handleTropaChange = (unidade, value) => {
    setSelectedTropas((prev) => ({ ...prev, [unidade]: value }));
  };
  const hasTropasSelected = Object.values(selectedTropas).some((v) => v > 0);
  const stats = reactExports.useMemo(() => {
    var _a;
    if (!destinoBase || !origemBase) return null;
    const dx = destinoBase.coordenada_x - origemBase.coordenada_x;
    const dy = destinoBase.coordenada_y - origemBase.coordenada_y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    let minSpeed = 999;
    let totalAttack = 0;
    let totalCapacity = 0;
    Object.entries(selectedTropas).forEach(([unidade, qtd]) => {
      var _a2;
      if (qtd > 0) {
        const config = ((_a2 = gameConfig == null ? void 0 : gameConfig.units) == null ? void 0 : _a2[unidade]) || {};
        if (config.speed < minSpeed) minSpeed = config.speed;
        totalAttack += qtd * (config.attack || 0);
        totalCapacity += qtd * (config.capacity || 0);
      }
    });
    if (minSpeed === 999) minSpeed = 10;
    const speedTravel = ((_a = gameConfig == null ? void 0 : gameConfig.speed) == null ? void 0 : _a.travel) || 1;
    const segundos = Math.max(30, distancia * 100 / (minSpeed * speedTravel));
    return {
      distancia: distancia.toFixed(1),
      tempo: Math.floor(segundos),
      ataque: totalAttack,
      capacidade: totalCapacity
    };
  }, [destinoBase, origemBase, selectedTropas]);
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-neutral-950 border-white/10 text-white max-w-2xl overflow-hidden p-0 rounded-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "p-6 border-b border-white/5 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-red-500/20 rounded-xl border border-red-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "text-red-500 animate-pulse", size: 24 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-black uppercase tracking-tighter", children: "Preparar Ofensiva Militar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-neutral-500 text-[10px] uppercase font-bold", children: [
          "Alvo: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: (destinoBase == null ? void 0 : destinoBase.nome) || "Coordenadas Remotas" }),
          " [",
          destinoBase == null ? void 0 : destinoBase.coordenada_x,
          ":",
          destinoBase == null ? void 0 : destinoBase.coordenada_y,
          "]"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-r border-white/5 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar bg-white/[0.02]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 12 }),
          " Unidades de Combate"
        ] }),
        tropasDisponiveis.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center border border-dashed border-white/10 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-neutral-600 uppercase", children: "Guarnição Vazia" }) }) : tropasDisponiveis.map((tropa) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wide text-neutral-300", children: tropa.unidade.replace(/_/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[9px] bg-sky-500/10 border-sky-500/20 text-sky-400 font-mono", children: [
              selectedTropas[tropa.unidade] || 0,
              " / ",
              tropa.quantidade
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: tropa.quantidade,
              step: "1",
              value: selectedTropas[tropa.unidade] || 0,
              onChange: (e) => handleTropaChange(tropa.unidade, parseInt(e.target.value)),
              className: "w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
            }
          )
        ] }, tropa.unidade))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-black/40 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3", children: "Protocolo de Operação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
              { id: "ataque", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 14 }), label: "SAQUE" },
              { id: "espionagem", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14 }), label: "ESP" },
              { id: "conquista", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { size: 14 }), label: "CONQ" }
            ].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setMissionType(type.id),
                className: `flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${missionType === type.id ? "bg-red-500/20 border-red-500/50 text-white" : "bg-white/5 border-white/10 text-neutral-500 hover:text-white"}`,
                children: [
                  type.icon,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black mt-1", children: type.label })
                ]
              },
              type.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/5 rounded-xl border border-white/5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12, className: "text-orange-500" }),
              " Estimativa de Combate"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-neutral-500 uppercase font-black tracking-tighter block", children: "Tempo de Viagem" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-white font-mono text-sm tracking-widest", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "text-neutral-500" }),
                  formatTime((stats == null ? void 0 : stats.tempo) || 0)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-neutral-500 uppercase font-black tracking-tighter block", children: "Poder Ofensivo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-red-400 font-mono text-sm tracking-widest", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 12, className: "text-red-500/50" }),
                  stats == null ? void 0 : stats.ataque.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-neutral-500 uppercase font-black tracking-tighter block", children: "Capac. Saque" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-emerald-400 font-mono text-sm tracking-widest", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12, className: "text-emerald-500/50" }),
                  stats == null ? void 0 : stats.capacidade.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-neutral-500 uppercase font-black tracking-tighter block", children: "Distância" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-neutral-400 font-mono text-sm tracking-widest", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 12, className: "text-neutral-500/50" }),
                  stats == null ? void 0 : stats.distancia,
                  " KM"
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: `w-full py-6 font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 rounded-2xl ${hasTropasSelected ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" : "bg-neutral-800 text-neutral-500 cursor-not-allowed"}`,
            disabled: !hasTropasSelected || isSending,
            onClick: () => onEnviar({
              destino_id: (destinoBase == null ? void 0 : destinoBase.id) || null,
              destino_x: destinoBase == null ? void 0 : destinoBase.coordenada_x,
              destino_y: destinoBase == null ? void 0 : destinoBase.coordenada_y,
              tropas: selectedTropas,
              tipo: missionType
            }),
            children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "AUTORIZAR INVASÃO ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "ml-2" })
            ] })
          }
        ) })
      ] })
    ] })
  ] }) });
};
export {
  AttackModal as A,
  Badge as B,
  Clock as C,
  Search as S,
  Crosshair as a
};
//# sourceMappingURL=AttackModal-B1hRbTb7.js.map
