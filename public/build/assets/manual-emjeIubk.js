import { c as createLucideIcon, j as jsxRuntimeExports, L as Le, $ as $e, a as motion, Z as Zap } from "./app-BGgB_693.js";
import { C as ChevronLeft } from "./chevron-left-Ct5vo4hb.js";
import { B as Book, G as Globe } from "./globe-Bpa6HOtq.js";
import { S as Shield, T as Target } from "./target-BqSJ-6oc.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      key: "hh9hay"
    }
  ],
  ["path", { d: "m3.3 7 8.7 5 8.7-5", key: "g66t2b" }],
  ["path", { d: "M12 22V12", key: "d0xqtd" }]
];
const Box = createLucideIcon("Box", __iconNode);
function Manual({ sections }) {
  const icons = [/* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 24 }), /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { size: 24 }), /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }), /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 24 }), /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 24 })];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#020406] text-white p-8 font-sans relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-[80%] h-[70%] bg-orange-500/5 blur-[180px] opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-0 opacity-[0.02]",
          style: { backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Manual Operacional" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          $e,
          {
            href: "/dashboard",
            className: "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }),
              "Regressar ao Comando"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-orange-500/50 bg-orange-500/5 px-4 py-1 rounded-full border border-orange-500/10", children: "DOC_ID: FIELD_MANUAL_v1.0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Book, { className: "text-orange-500", size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-black uppercase tracking-tighter", children: [
            "Manual ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-500", children: "Operacional" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-400 text-sm leading-relaxed max-w-2xl", children: "Este documento contém os protocolos de segurança e diretrizes estratégicas para todos os comandantes em campo. A leitura atenta é mandatória para garantir a sobrevivência e expansão no teatro de operações." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: sections.map((section, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: index * 0.1 },
          className: "group bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-3xl relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 items-start relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-orange-500/40 mt-1 bg-black/40 p-3 rounded-xl border border-white/5", children: icons[index % icons.length] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-black uppercase tracking-tight text-white mb-3 flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-orange-500/30", children: [
                    "0",
                    index + 1
                  ] }),
                  section.title
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-400 text-sm leading-relaxed font-medium", children: section.content })
              ] })
            ] })
          ]
        },
        index
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-20 pt-8 border-t border-white/5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-neutral-600 font-black uppercase tracking-[0.5em]", children: "Guerras Modernas © 2026 — Protocolo de Segurança Ativo" }) })
    ] })
  ] });
}
export {
  Manual as default
};
//# sourceMappingURL=manual-emjeIubk.js.map
