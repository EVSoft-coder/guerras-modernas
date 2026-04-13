import { c as createLucideIcon, j as jsxRuntimeExports, L as Le, Z as Zap, m as motion } from "./app-DZb0IV3g.js";
import { A as AppLayout, C as ChevronRight } from "./app-layout-C3WXeZtZ.js";
import { S as Sword } from "./sword-Cd1vP2Bk.js";
import { S as Shield } from "./shield-CT8F6abw.js";
import "./app-logo-icon-XBv9aIHR.js";
import "./index-BcTM5pAn.js";
import "./index-DLWye9en.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("Calendar", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12.5 17-.5-1-.5 1h1z", key: "3me087" }],
  [
    "path",
    {
      d: "M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",
      key: "1o5pge"
    }
  ],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }]
];
const Skull = createLucideIcon("Skull", __iconNode);
function Index({ relatorios }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs: [{ title: "Intel: Relatórios de Batalha", href: "/relatorios" }], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "SITREP: Relatórios de Batalha" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto p-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end border-b border-white/5 pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-sky-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]", children: "MILITARY_INTELLIGENCE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl font-black text-white uppercase tracking-tighter", children: [
            "Histórico de ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sky-500", children: "Confrontos" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-neutral-600 uppercase", children: [
          "Archive_Status: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-500", children: "SECURE" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: relatorios.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 border border-dashed border-white/10 rounded-3xl p-12 text-center text-neutral-600 uppercase font-black text-xs tracking-widest", children: "Nenhum registo de combate detetado nos arquivos." }) : relatorios.map((rel, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: idx * 0.05 },
          className: "group relative bg-neutral-900/40 hover:bg-neutral-800/40 border border-white/5 hover:border-sky-500/30 rounded-[2rem] p-6 transition-all shadow-xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0 left-0 w-1 h-full ${rel.vitoria ? "bg-emerald-500" : "bg-red-500"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-2xl border ${rel.vitoria ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`, children: rel.vitoria ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 text-[10px] font-mono", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10, className: "text-neutral-500" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-500 uppercase", children: new Date(rel.created_at).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xl font-black text-white uppercase tracking-tight flex items-center gap-3", children: [
                    rel.atacante.nome,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-neutral-700" }),
                    rel.defensor.nome
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "CASUALTIES", value: rel.dados.losses, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { size: 10 }), color: "text-red-400" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "STATUS", value: rel.vitoria ? "VICTORY" : "DEFEAT", color: rel.vitoria ? "text-emerald-400" : "text-red-400" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-6", children: Object.entries(rel.dados.loot || {}).length > 0 ? Object.entries(rel.dados.loot).map(([res, qty]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-600 uppercase tracking-tighter", children: res }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-white font-mono", children: [
                  "+",
                  qty
                ] })
              ] }, res)) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-700 uppercase italic", children: "Nenhum espólio capturado" }) })
            ] })
          ]
        },
        rel.id
      )) })
    ] })
  ] });
}
const Badge = ({ label, value, icon, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5", children: [
  icon,
  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-black text-neutral-500 uppercase tracking-tighter", children: [
    label,
    ":"
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-black uppercase tracking-tighter ${color}`, children: value })
] });
export {
  Index as default
};
//# sourceMappingURL=Index-Xe_t0ZPZ.js.map
