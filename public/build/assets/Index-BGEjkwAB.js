import { c as createLucideIcon, u as useToasts, j as jsxRuntimeExports, L as Le, r as reactExports, S as Sr, Z as Zap } from "./app-CXpFlQEF.js";
import { A as AppLayout, a as Award } from "./app-layout-CfVqL5DD.js";
import { C as Check } from "./index-XdeZQvPp.js";
import { T as Trophy } from "./trophy-9MZ1-R44.js";
import { T as Target, S as Shield } from "./target-CV_lGRPT.js";
import { S as Sword } from "./sword-DJRnWoRC.js";
import { T as Truck } from "./truck-eaTpW0I_.js";
import "./app-logo-icon-BP-_QPoY.js";
import "./index-Bj7QDTvw.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("Pen", __iconNode$1);
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
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("Star", __iconNode);
const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Alto Comando: O General", href: "/general" }
];
function Index({ general, skillsDisponiveis, xpNextLevel }) {
  const { addToast } = useToasts();
  if (!general) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Alto Comando - O General" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in zoom-in duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 bg-zinc-900 border border-white/10 rounded-full shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "text-white/10", size: 80 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black text-white uppercase tracking-tighter", children: "Nenhum General Ativo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-500 max-w-md mx-auto leading-relaxed", children: "O Alto Comando ainda não designou um oficial superior para liderar as tuas tropas. Continua a expandir a tua influência para recrutar o teu primeiro líder." })
        ] })
      ] })
    ] });
  }
  const [isEditingName, setIsEditingName] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState(general.nome);
  const handleRename = (e) => {
    e.preventDefault();
    Sr.post("/general/rename", { nome: newName }, {
      onSuccess: () => {
        setIsEditingName(false);
        addToast("Codinome atualizado, Comandante.", "success");
      }
    });
  };
  const handleUpgrade = (skillSlug) => {
    Sr.post("/general/upgrade", { skill: skillSlug }, {
      onSuccess: () => addToast("Especialização militar aprimorada.", "success"),
      onError: (err) => addToast(Object.values(err)[0], "error")
    });
  };
  const getSkillLevel = (slug) => {
    var _a, _b;
    return ((_b = (_a = general.skills) == null ? void 0 : _a.find((s) => s.skill_slug === slug)) == null ? void 0 : _b.nivel) || 0;
  };
  const xpProgress = general.experiencia / xpNextLevel * 100;
  const skillIcons = {
    logistica: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "text-blue-400", size: 20 }),
    ofensiva: /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "text-red-400", size: 20 }),
    defensiva: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "text-emerald-400", size: 20 }),
    saque: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "text-amber-400", size: 20 }),
    recrutamento: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-purple-400", size: 20 })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Alto Comando - O General" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden bg-zinc-900 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] -mr-32 -mt-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-32 h-32 rounded-full bg-black border-4 border-white/10 flex items-center justify-center relative overflow-hidden group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "text-white/20 group-hover:text-white/40 transition-colors", size: 64 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-2 -right-2 bg-sky-600 text-white font-black text-sm px-3 py-1 rounded-full border-2 border-zinc-900 shadow-lg", children: [
            "NÍVEL ",
            general.nivel
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center md:text-left space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center md:justify-start gap-4", children: isEditingName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRename, className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                autoFocus: true,
                value: newName,
                onChange: (e) => setNewName(e.target.value),
                className: "bg-black border border-sky-500/50 rounded px-3 py-1 text-2xl font-black text-white outline-none"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "p-2 bg-sky-600 rounded text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 20 }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black uppercase tracking-tighter text-white", children: general.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsEditingName(true), className: "text-neutral-500 hover:text-white transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 18 }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center md:justify-start gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "text-amber-500", size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-neutral-400 uppercase", children: [
                "Pontos de Comando: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: general.pontos_skill })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "text-sky-500", size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-neutral-400 uppercase", children: [
                "Experiência Total: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: general.experiencia })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Progresso para Nível ",
                general.nivel + 1
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                general.experiencia,
                " / ",
                xpNextLevel,
                " XP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-1000",
                style: { width: `${xpProgress}%` }
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Object.entries(skillsDisponiveis).map(([slug, skill]) => {
        const level = getSkillLevel(slug);
        const isMax = level >= skill.max_nivel;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-zinc-900 border rounded-2xl p-6 transition-all duration-500 flex flex-col ${level > 0 ? "border-white/10" : "border-white/5 opacity-80"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-black rounded-xl border border-white/5 shadow-inner", children: skillIcons[slug] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1", children: "Especialização" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-black text-white", children: [
                level,
                " / ",
                skill.max_nivel
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-white uppercase tracking-tighter mb-2", children: skill.nome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-neutral-400 leading-relaxed mb-6 h-8", children: skill.descricao }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-black/50 border border-white/5 rounded-lg px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-sky-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-neutral-300", children: [
                "Bónus Atual: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-400", children: [
                  "+",
                  level * skill.bonus,
                  "%"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                disabled: isMax || general.pontos_skill <= 0,
                onClick: () => handleUpgrade(slug),
                className: `w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isMax ? "bg-emerald-500/10 text-emerald-500 cursor-default" : general.pontos_skill > 0 ? "bg-white text-black hover:bg-sky-400 shadow-xl" : "bg-white/5 text-neutral-600 cursor-not-allowed"}`,
                children: isMax ? "Mestria Alcançada" : "Aprimorar"
              }
            )
          ] })
        ] }, slug);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 border border-white/5 rounded-xl p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]", children: "As competências do General são aplicadas a todas as operações militares da conta." }) })
    ] })
  ] });
}
export {
  Index as default
};
//# sourceMappingURL=Index-BGEjkwAB.js.map
