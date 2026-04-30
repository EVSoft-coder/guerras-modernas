import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Le, Z as Zap } from "./app-2JTo64Yl.js";
import { A as AppLayout, d as Calculator } from "./app-layout-BIf3bB1E.js";
import { t as toast } from "./index-JHZxFxwN.js";
import { S as Sword } from "./sword-DT7QoWdj.js";
import { S as Shield } from "./target-BhnPIlC8.js";
import { M as Moon, S as Sun } from "./sun-DiW0du9Q.js";
import { T as Trophy } from "./trophy-PDC7KUYl.js";
import { T as TrendingUp } from "./trending-up-BE83X-RF.js";
import "./app-logo-icon-Bdwv3T44.js";
import "./index-5DxqlTQX.js";
import "./index-Bvb7Oydl.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("CircleAlert", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("RefreshCw", __iconNode);
function Simulator({ unitTypes }) {
  const [attackerUnits, setAttackerUnits] = reactExports.useState({});
  const [defenderUnits, setDefenderUnits] = reactExports.useState({});
  const [wallLevel, setWallLevel] = reactExports.useState(0);
  const [luck, setLuck] = reactExports.useState(0);
  const [moral, setMoral] = reactExports.useState(100);
  const [nightBonus, setNightBonus] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const handleSimulate = () => {
    setLoading(true);
    axios.post(route("simulator.simulate"), {
      attacker_units: attackerUnits,
      defender_units: defenderUnits,
      wall_level: wallLevel,
      luck,
      moral,
      night_bonus: nightBonus
    }).then((response) => {
      setResult(response.data);
      setLoading(false);
      toast.success("Simulação concluída!");
    }).catch((error) => {
      console.error(error);
      setLoading(false);
      toast.error("Erro na simulação.");
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Simulador de Combate" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-white flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "w-8 h-8 text-primary" }),
          "Simulador Tático de Combate"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Preveja desfechos de batalhas e minimize perdas estratégicas." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white mb-6 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "w-5 h-5 text-rose-500" }),
                "Forças Atacantes"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar", children: unitTypes.map((unit) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 bg-white/5 p-3 rounded-xl border border-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-300", children: unit.display_name || unit.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    className: "w-24 bg-black/40 border-white/10 rounded-lg px-3 py-1.5 text-white text-right focus:border-rose-500 transition-all",
                    placeholder: "0",
                    value: attackerUnits[unit.id] || "",
                    onChange: (e) => setAttackerUnits({ ...attackerUnits, [unit.id]: parseInt(e.target.value) || 0 })
                  }
                )
              ] }, unit.id)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white mb-6 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-blue-500" }),
                "Forças Defensoras"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar", children: unitTypes.map((unit) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 bg-white/5 p-3 rounded-xl border border-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-300", children: unit.display_name || unit.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    className: "w-24 bg-black/40 border-white/10 rounded-lg px-3 py-1.5 text-white text-right focus:border-blue-500 transition-all",
                    placeholder: "0",
                    value: defenderUnits[unit.id] || "",
                    onChange: (e) => setDefenderUnits({ ...defenderUnits, [unit.id]: parseInt(e.target.value) || 0 })
                  }
                )
              ] }, unit.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest", children: "Variáveis de Ambiente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-2 uppercase", children: "Muralha (Nível)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    max: "20",
                    className: "w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white",
                    value: wallLevel,
                    onChange: (e) => setWallLevel(parseInt(e.target.value) || 0)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-2 uppercase", children: "Sorte (-25 a 25%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "-25",
                    max: "25",
                    className: "w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white",
                    value: luck,
                    onChange: (e) => setLuck(parseInt(e.target.value) || 0)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold text-gray-500 mb-2 uppercase", children: "Moral (30 a 100%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "30",
                    max: "100",
                    className: "w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white",
                    value: moral,
                    onChange: (e) => setMoral(parseInt(e.target.value) || 100)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setNightBonus(!nightBonus),
                  className: `w-full py-2 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold ${nightBonus ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-white/5 border-white/10 text-gray-400"}`,
                  children: [
                    nightBonus ? /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-4 h-4" }),
                    "Bónus Noturno"
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleSimulate,
              disabled: loading,
              className: "w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 text-xl group",
              children: [
                loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 group-hover:scale-125 transition-transform" }),
                "EXECUTAR SIMULAÇÃO"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1 space-y-6", children: result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border rounded-2xl p-6 backdrop-blur-md shadow-2xl ${result.attacker_won ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white", children: "VENCEDOR" }),
              result.attacker_won ? /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-10 h-10 text-green-500 animate-bounce" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-10 h-10 text-red-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-4xl font-black mb-4 uppercase tracking-tighter ${result.attacker_won ? "text-green-500" : "text-red-500"}`, children: result.attacker_won ? "Atacante" : "Defensor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-sm", children: [
              "A batalha foi resolvida com ",
              Math.round(result.stats.luck * 100),
              "% de sorte e ",
              result.stats.moral,
              "% de moral."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 px-6 py-4 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-white flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
              "Análise de Perdas"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-rose-500 uppercase tracking-widest mb-3", children: "Baixas do Atacante" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: result.attacker_units.map((u) => u.losses > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: u.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-rose-400 font-bold", children: [
                    "-",
                    u.losses
                  ] })
                ] }, u.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-blue-500 uppercase tracking-widest mb-3", children: "Baixas do Defensor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: result.defender_units.map((u) => u.losses > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: u.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400 font-bold", children: [
                    "-",
                    u.losses
                  ] })
                ] }, u.id)) })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/50 border border-dashed border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-16 h-16 text-gray-700 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500 font-bold text-lg", children: "Aguardando dados..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm mt-2", children: "Configure as tropas e clique em executar para ver os resultados táticos." })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            ` } })
  ] });
}
export {
  Simulator as default
};
//# sourceMappingURL=Index-D3lVq6D8.js.map
