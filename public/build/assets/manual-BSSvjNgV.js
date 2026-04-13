import { c as createLucideIcon, j as jsxRuntimeExports, L as Le, Z as Zap } from "./app-D6gs7trv.js";
import { A as AppLayout, T as Target } from "./app-layout-D1wKR__o.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Ce4cwJ6h.js";
import { S as Shield } from "./shield-C_qOEvLW.js";
import "./app-logo-icon-DE3nzYs9.js";
import "./index-CqVACHqf.js";
import "./index-BeOKNEBe.js";
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
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      key: "k3hazp"
    }
  ]
];
const Book = createLucideIcon("Book", __iconNode);
const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "InfopÃ©dia Militar", href: "/manual" }
];
function Manual({ units, buildings }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "InfopÃ©dia Militar - Manual do Oficial" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-8 p-6 bg-neutral-950 text-white min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-black uppercase tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Book, { className: "text-sky-500", size: 32 }),
          "InfopÃ©dia Militar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-500 text-sm uppercase font-bold tracking-widest", children: "DossiÃª de InteligÃªncia sobre Ativos e Estruturas" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold uppercase tracking-tight text-sky-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 20 }),
            "DivisÃµes de Combate"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: Object.entries(units).map(([key, unit]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg uppercase font-black tracking-tighter flex justify-between items-center", children: [
              unit.name,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-sky-500/20 text-sky-400 px-2 py-1 rounded", children: "ATIVO" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-sm text-neutral-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4 text-xs italic", children: [
                '"Unidade especializada em operaÃ§Ãµes de ',
                unit.name.toLowerCase(),
                '."'
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-[10px] uppercase font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-orange-500", size: 12 }),
                  "Ataque: ",
                  unit.attack
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-green-500", size: 12 }),
                  "Defesa: ",
                  unit.defense_infantry
                ] })
              ] })
            ] })
          ] }, key)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold uppercase tracking-tight text-orange-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20 }),
            "Infraestrutura de Base"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: Object.entries(buildings).map(([key, b]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg uppercase font-black tracking-tighter", children: b.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-sm text-neutral-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: b.description }) })
          ] }, key)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Manual as default
};
//# sourceMappingURL=manual-BSSvjNgV.js.map
