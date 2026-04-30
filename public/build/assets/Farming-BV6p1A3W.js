import { c as createLucideIcon, r as reactExports, m as me, j as jsxRuntimeExports, L as Le, Z as Zap, T as TriangleAlert } from "./app-ev2knBTG.js";
import { A as AppLayout, b as Crosshair } from "./app-layout-Bku8Fj9x.js";
import { S as Sword } from "./sword-CTSqg1iL.js";
import { S as Save } from "./save-Dx6xlLk8.js";
import { M as MapPin } from "./map-pin-BZUbtwbt.js";
import { C as CircleCheck } from "./circle-check-DtPHtu98.js";
import { S as Search } from "./search-RGDC1eoH.js";
import "./app-logo-icon-DpANJGH8.js";
import "./index-bder2aWa.js";
import "./index-CGxr798k.js";
import "./target-iFUagk2C.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("History", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "12 2 19 21 12 17 5 21 12 2", key: "x8c0qg" }]
];
const Navigation2 = createLucideIcon("Navigation2", __iconNode);
function Farming({ templates, targets, unitTypes, currentBaseId }) {
  var _a;
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState(((_a = templates[0]) == null ? void 0 : _a.id) || null);
  const [sending, setSending] = reactExports.useState({});
  const { data, setData, post, processing, reset } = me({
    nome: "",
    unidades: {}
  });
  const handleSaveTemplate = (e) => {
    e.preventDefault();
    post(route("premium.farming.templates.store"), {
      onSuccess: () => reset()
    });
  };
  const handleQuickAttack = (targetId) => {
    if (!selectedTemplate) return;
    setSending((prev) => ({ ...prev, [targetId]: true }));
    axios.post(route("premium.farming.attack"), {
      target_id: targetId,
      template_id: selectedTemplate,
      origin_id: currentBaseId
    }).then((response) => {
      setSending((prev) => ({ ...prev, [targetId]: false }));
    }).catch((error) => {
      var _a2, _b;
      console.error(error);
      setSending((prev) => ({ ...prev, [targetId]: false }));
      alert(((_b = (_a2 = error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || "Erro ao enviar tropas");
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Assistente de Farming" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-white flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crosshair, { className: "w-8 h-8 text-primary" }),
            "Assistente de Farming"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-1", children: "Automatize saques a aldeias bárbaras e rebeldes próximos." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-gray-900/50 p-2 rounded-xl border border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-yellow-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-300", children: "Funcionalidade Premium Ativa" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "w-5 h-5 text-primary" }),
              "Modelos de Tropas"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              templates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setSelectedTemplate(template.id),
                  className: `w-full text-left px-4 py-3 rounded-xl transition-all border ${selectedTemplate === template.id ? "bg-primary/20 border-primary text-white" : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: template.nome }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-60", children: Object.entries(template.unidades).map(([id, qty]) => {
                      const unit = unitTypes.find((u) => u.id === parseInt(id));
                      return qty > 0 ? `${qty}x ${unit == null ? void 0 : unit.display_name}, ` : null;
                    }) })
                  ]
                },
                template.id
              )),
              templates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 italic text-center py-4", children: "Nenhum modelo criado." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider", children: "Novo Modelo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveTemplate, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Nome do Modelo",
                  value: data.nome,
                  onChange: (e) => setData("nome", e.target.value),
                  className: "w-full bg-black/40 border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary transition-all",
                  required: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar", children: unitTypes.map((unit) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-400", children: unit.display_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "0",
                    className: "w-20 bg-black/40 border-white/10 rounded-lg px-2 py-1 text-white text-right",
                    value: data.unidades[unit.id] || 0,
                    onChange: (e) => setData("unidades", { ...data.unidades, [unit.id]: parseInt(e.target.value) })
                  }
                )
              ] }, unit.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "submit",
                  disabled: processing,
                  className: "w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" }),
                    "Guardar Modelo"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold text-white flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation2, { className: "w-6 h-6 text-primary rotate-45" }),
              "Alvos Próximos"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5", children: [
              "Mostrando ",
              targets.length,
              " bases bárbaras num raio de 50km"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Aldeia / Coords" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Distância" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Último Relatório" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-center", children: "Recursos Vistos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right", children: "Ação" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-white/5", children: [
              targets.map((target) => {
                var _a2;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/[0.02] transition-colors group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-white group-hover:text-primary transition-colors", children: target.nome }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                      target.x,
                      "|",
                      target.y
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-300", children: [
                    target.distancia,
                    " km"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: target.last_report ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      target.last_report.vitoria ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-red-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: new Date(target.last_report.created_at).toLocaleDateString() })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: route("relatorio.show", target.last_report.id),
                        className: "text-xs text-primary hover:underline",
                        children: "Ver Relatório"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-600 italic", children: "Sem histórico" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: ((_a2 = target.last_report) == null ? void 0 : _a2.resources) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-green-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "SUP:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: target.last_report.resources.suprimentos })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "COM:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: target.last_report.resources.combustivel })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-red-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "MUN:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: target.last_report.resources.municoes })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-yellow-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "MET:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-200", children: target.last_report.resources.metal })
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5 text-white/10" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => handleQuickAttack(target.id),
                      disabled: !selectedTemplate || sending[target.id],
                      className: `px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ml-auto ${!selectedTemplate ? "bg-white/5 text-gray-600 cursor-not-allowed" : "bg-primary hover:bg-primary-hover text-black shadow-lg shadow-primary/20"}`,
                      children: [
                        sending[target.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { className: "w-4 h-4" }),
                        "Ataque Rápido"
                      ]
                    }
                  ) })
                ] }, target.id);
              }),
              targets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 5, className: "px-6 py-12 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-12 h-12 text-gray-700 mx-auto mb-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 font-bold", children: "Nenhuma aldeia bárbara encontrada neste setor." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-600 text-sm", children: "Tente mudar de base ou expandir o seu território." })
              ] }) })
            ] })
          ] }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(var(--primary-rgb), 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(var(--primary-rgb), 0.4);
                }
            ` } })
  ] });
}
export {
  Farming as default
};
//# sourceMappingURL=Farming-BV6p1A3W.js.map
