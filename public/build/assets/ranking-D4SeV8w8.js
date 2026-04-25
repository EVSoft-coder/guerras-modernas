import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Le, A as AnimatePresence, z as motion, Z as Zap } from "./app-DVhCW0hA.js";
import { A as AppLayout } from "./app-layout-BDG2cE_h.js";
import { T as Trophy } from "./trophy-G8kcyIn3.js";
import { U as Users } from "./users-fFZiFFyP.js";
import { C as Crosshair } from "./crosshair-CnUSSxXn.js";
import { S as Shield } from "./target-CAvgcvAt.js";
import "./app-logo-icon-m9kGpDHn.js";
import "./index-DYdWR_ac.js";
import "./index-BI4xA-xU.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "3", x2: "21", y1: "22", y2: "22", key: "j8o0r" }],
  ["line", { x1: "6", x2: "6", y1: "18", y2: "11", key: "10tf0k" }],
  ["line", { x1: "10", x2: "10", y1: "18", y2: "11", key: "54lgf6" }],
  ["line", { x1: "14", x2: "14", y1: "18", y2: "11", key: "380y" }],
  ["line", { x1: "18", x2: "18", y1: "18", y2: "11", key: "1kevvc" }],
  ["polygon", { points: "12 2 20 7 4 7", key: "jkujk7" }]
];
const Landmark = createLucideIcon("Landmark", __iconNode);
const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Classificação Mundial", href: "/ranking" }
];
const MEDAL_STYLES = [
  "bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]",
  "bg-gradient-to-br from-slate-300 to-slate-400 text-black shadow-[0_0_15px_rgba(148,163,184,0.3)]",
  "bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 shadow-[0_0_15px_rgba(180,83,9,0.3)]"
];
function Ranking({ jogadores, aliancas, tab: initialTab }) {
  const [activeTab, setActiveTab] = reactExports.useState(initialTab === "aliancas" ? "aliancas" : "jogadores");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Classificação Mundial - Elite Militar" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-8 p-6 md:p-10 bg-[#020406] text-white min-h-screen relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-amber-500/5 blur-[200px] opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-[0.02]",
            style: { backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "80px 80px" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-amber-500/60 font-black tracking-[0.4em] uppercase", children: "Intel_Classificação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-black uppercase tracking-tighter flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 shadow-[0_0_30px_rgba(251,191,36,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "text-amber-400", size: 32 }) }),
            "Elite Militar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-600 text-xs uppercase font-bold tracking-widest", children: "Hierarquia de Poder e Influência Global" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-sm", children: ["jogadores", "aliancas"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setActiveTab(tab),
            className: `px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "text-neutral-500 hover:text-white hover:bg-white/5"}`,
            children: tab === "jogadores" ? "⚔️ Oficiais" : "🏴 Coligações"
          },
          tab
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: activeTab === "jogadores" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          className: "relative z-10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/30 border border-white/5 rounded-[1.5rem] overflow-hidden backdrop-blur-xl shadow-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/[0.02] border-b border-white/5 text-[9px] uppercase font-black tracking-widest text-neutral-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 w-16 text-center", children: "Pos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Oficial / Coligação" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-center hidden md:table-cell", children: "Bases" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-center hidden lg:table-cell", children: "Tropas" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-center hidden lg:table-cell", children: "Poder ATK" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-center hidden lg:table-cell", children: "Poder DEF" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-right", children: "Pontuação" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/[0.03]", children: jogadores.map((j, index) => {
                var _a, _b;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.tr,
                  {
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: index * 0.03 },
                    className: "hover:bg-white/[0.03] transition-colors duration-200 group",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center w-9 h-9 rounded-xl font-mono text-xs font-black ${index < 3 ? MEDAL_STYLES[index] : "text-neutral-600 bg-white/5 border border-white/5"}`, children: index + 1 }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors text-sm", children: j.username }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-neutral-500 flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10 }),
                          ((_a = j.alianca) == null ? void 0 : _a.nome) || "Sem Coligação",
                          ((_b = j.alianca) == null ? void 0 : _b.tag) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-500/60", children: [
                            "[",
                            j.alianca.tag,
                            "]"
                          ] })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 text-xs font-mono", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { size: 12, className: "text-neutral-600" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-300", children: j.total_bases })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-neutral-400", children: (j.total_units ?? 0).toLocaleString() }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 text-xs font-mono text-red-400", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { size: 10 }),
                        (j.attack_power ?? 0).toLocaleString()
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 text-xs font-mono text-cyan-400", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 10 }),
                        (j.defense_power ?? 0).toLocaleString()
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 font-mono font-black text-amber-400 text-sm", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
                        (j.pontos ?? 0).toLocaleString()
                      ] }) })
                    ]
                  },
                  j.id
                );
              }) })
            ] }),
            jogadores.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-neutral-700 text-xs uppercase tracking-widest", children: "Sem dados de classificação disponíveis" })
          ] })
        },
        "jogadores"
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          className: "relative z-10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/30 border border-white/5 rounded-[1.5rem] overflow-hidden backdrop-blur-xl shadow-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/[0.02] border-b border-white/5 text-[9px] uppercase font-black tracking-widest text-neutral-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 w-16 text-center", children: "Pos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Coligação" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-center", children: "Membros" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-center hidden md:table-cell", children: "Bases" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-right", children: "Pontuação Total" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/[0.03]", children: (aliancas ?? []).map((a, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.tr,
                {
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: index * 0.03 },
                  className: "hover:bg-white/[0.03] transition-colors duration-200 group",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center w-9 h-9 rounded-xl font-mono text-xs font-black ${index < 3 ? MEDAL_STYLES[index] : "text-neutral-600 bg-white/5 border border-white/5"}`, children: index + 1 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors text-sm", children: a.nome }),
                      a.tag && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-amber-500/60 font-mono", children: [
                        "[",
                        a.tag,
                        "]"
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 text-xs font-mono", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12, className: "text-neutral-600" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-300", children: a.total_membros ?? 0 })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 text-xs font-mono", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { size: 12, className: "text-neutral-600" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-300", children: a.total_bases ?? 0 })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 font-mono font-black text-amber-400 text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
                      (a.total_pontos ?? 0).toLocaleString()
                    ] }) })
                  ]
                },
                a.id
              )) })
            ] }),
            (aliancas ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-neutral-700 text-xs uppercase tracking-widest", children: "Sem coligações registadas" })
          ] })
        },
        "aliancas"
      ) })
    ] })
  ] });
}
export {
  Ranking as default
};
//# sourceMappingURL=ranking-D4SeV8w8.js.map
