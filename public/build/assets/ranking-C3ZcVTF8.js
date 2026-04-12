import { c as createLucideIcon, j as jsxRuntimeExports, L as Le, Z as Zap } from "./app-DeScd2lX.js";
import { A as AppLayout } from "./app-layout-B3Y0F5uJ.js";
import { U as Users } from "./users-BkWgJY2H.js";
import "./app-logo-icon-BflHDIV4.js";
import "./index-B7j3r5Tz.js";
import "./index-Dt266jQh.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "3", x2: "21", y1: "22", y2: "22", key: "j8o0r" }],
  ["line", { x1: "6", x2: "6", y1: "18", y2: "11", key: "10tf0k" }],
  ["line", { x1: "10", x2: "10", y1: "18", y2: "11", key: "54lgf6" }],
  ["line", { x1: "14", x2: "14", y1: "18", y2: "11", key: "380y" }],
  ["line", { x1: "18", x2: "18", y1: "18", y2: "11", key: "1kevvc" }],
  ["polygon", { points: "12 2 20 7 4 7", key: "jkujk7" }]
];
const Landmark = createLucideIcon("Landmark", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("Trophy", __iconNode);
const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "ClassificaÃ§Ã£o Mundial", href: "/ranking" }
];
function Ranking({ jogadores }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "ClassificaÃ§Ã£o Mundial - Elite Militar" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-8 p-6 bg-neutral-950 text-white min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-black uppercase tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "text-orange-500", size: 32 }),
          "Elite Militar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-500 text-sm uppercase font-bold tracking-widest", children: "Hierarquia de Poder e InfluÃªncia Global" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/5 border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-neutral-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 w-16 text-center", children: "Pos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4", children: "Oficial / ColigaÃ§Ã£o" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-center", children: "Bases" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-4 text-right", children: "PontuaÃ§Ã£o Total" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: jogadores.map((j, index) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/5 transition-colors duration-200 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs ${index === 0 ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : index === 1 ? "bg-neutral-300/20 text-neutral-300 border border-neutral-300/30" : index === 2 ? "bg-amber-700/20 text-amber-700 border border-amber-700/30" : "text-neutral-500"}`, children: index + 1 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black uppercase tracking-tight text-white group-hover:text-sky-400 transition-colors", children: j.username }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-neutral-500 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10 }),
                ((_a = j.alianca) == null ? void 0 : _a.nome) || "Sem ColigaÃ§Ã£o"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { size: 12, className: "text-neutral-600" }),
              j.total_bases
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 font-mono font-bold text-sky-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
              j.pontos.toLocaleString()
            ] }) })
          ] }, j.id);
        }) })
      ] }) })
    ] })
  ] });
}
export {
  Ranking as default
};
//# sourceMappingURL=ranking-C3ZcVTF8.js.map
