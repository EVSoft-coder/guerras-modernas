import { c as createLucideIcon, r as reactExports, m as me, j as jsxRuntimeExports, L as Le, A as AnimatePresence, a as motion } from "./app-CmmyDCNe.js";
import { A as AppLayout, C as ChevronRight } from "./app-layout-DH_3-PgL.js";
import { S as ShieldAlert, H as Hammer, t as toast } from "./index-CyS0g3rw.js";
import { U as Users } from "./users-BGJFxwvl.js";
import { S as Search } from "./search-BxH8nYtX.js";
import { P as Plus } from "./plus-DctSBRvo.js";
import { T as Trash2 } from "./trash-2-Csh3gyL0.js";
import "./app-logo-icon-DDnKTLXd.js";
import "./index-DVQDzL9R.js";
import "./index-D7W0WJuZ.js";
import "./target-uuLGEDhe.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("LayoutDashboard", __iconNode$3);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("Play", __iconNode$2);
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("Save", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19", key: "1cbfv1" }],
  [
    "path",
    {
      d: "M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z",
      key: "135mg7"
    }
  ],
  ["circle", { cx: "6.5", cy: "9.5", r: ".5", fill: "currentColor", key: "5pm5xn" }]
];
const Tags = createLucideIcon("Tags", __iconNode);
function CommandCenter(props) {
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [filterGroup, setFilterGroup] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const filteredBases = props.bases.filter((base) => {
    const matchesGroup = filterGroup === null || base.groups.includes(filterGroup);
    const matchesSearch = base.nome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });
  const recruitForm = me({
    orders: {}
  });
  me({
    template_id: null,
    base_ids: []
  });
  me({
    name: "",
    color: "#3b82f6"
  });
  const handleRecruitChange = (baseId, unitTypeId, quantity) => {
    const qty = parseInt(quantity) || 0;
    recruitForm.setData("orders", {
      ...recruitForm.data.orders,
      [baseId]: {
        ...recruitForm.data.orders[baseId] || {},
        [unitTypeId]: qty
      }
    });
  };
  const submitRecruit = () => {
    recruitForm.post(route("command.recruit"), {
      onSuccess: () => toast.success("Ordens de recrutamento enviadas!"),
      onError: () => toast.error("Erro ao processar recrutamento em massa.")
    });
  };
  const [newTemplate, setNewTemplate] = reactExports.useState({
    name: "",
    steps: []
  });
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Alto Comando", href: "/command-center" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Alto Comando - Gestão de Massa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tactical-crt-overlay" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-[1600px] mx-auto space-y-6 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/60 border border-white/10 p-6 backdrop-blur-md rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold tracking-tighter text-white flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-8 h-8 text-blue-500" }),
            "ALTO COMANDO",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 uppercase", children: "Nível de Acesso: General" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm mt-1 font-mono uppercase tracking-widest", children: "Sincronização de recursos e unidades em tempo real" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-white/5 p-1 rounded-lg border border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabButton,
            {
              active: activeTab === "overview",
              onClick: () => setActiveTab("overview"),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-4 h-4" }),
              label: "Geral"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabButton,
            {
              active: activeTab === "recruit",
              onClick: () => setActiveTab("recruit"),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
              label: "Recrutar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabButton,
            {
              active: activeTab === "templates",
              onClick: () => setActiveTab("templates"),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "w-4 h-4" }),
              label: "Templates"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabButton,
            {
              active: activeTab === "groups",
              onClick: () => setActiveTab("groups"),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tags, { className: "w-4 h-4" }),
              label: "Grupos"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Procurar base...",
              className: "w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilterGroup(null),
              className: `px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filterGroup === null ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`,
              children: "Todas"
            }
          ),
          props.groups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setFilterGroup(group.id),
              className: `px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-2 ${filterGroup === group.id ? "text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`,
              style: {
                backgroundColor: filterGroup === group.id ? group.color : "transparent",
                borderColor: filterGroup === group.id ? "white" : "rgba(255,255,255,0.1)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-white/50" }),
                group.name
              ]
            },
            group.id
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.2 },
          className: "bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm",
          children: [
            activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTable, { bases: filteredBases }),
            activeTab === "recruit" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              RecruitGrid,
              {
                bases: filteredBases,
                unitTypes: props.unitTypes,
                form: recruitForm,
                onChange: handleRecruitChange,
                onSubmit: submitRecruit
              }
            ),
            activeTab === "templates" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              TemplatesPanel,
              {
                bases: filteredBases,
                templates: props.templates
              }
            ),
            activeTab === "groups" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              GroupsPanel,
              {
                bases: props.bases,
                groups: props.groups
              }
            )
          ]
        },
        activeTab
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .tactical-crt-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    background-size: 100% 4px, 3px 100%;
                    pointer-events: none;
                    z-index: 50;
                    opacity: 0.1;
                }
            ` })
  ] });
}
function TabButton({ active, onClick, icon, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`,
      children: [
        icon,
        label
      ]
    }
  );
}
function OverviewTable({ bases }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-400 font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Base" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Recursos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Capacidade" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Unidades" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Filas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4", children: "Ações" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: bases.map((base) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/5 transition-colors group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: base.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-gray-500", children: base.coordenadas })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceMini, { type: "suprimentos", value: base.resources.suprimentos }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceMini, { type: "combustivel", value: base.resources.combustivel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceMini, { type: "municoes", value: base.resources.municoes })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 w-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "POP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: Math.floor(base.resources.pessoal || 0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-white/5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-blue-500", style: { width: "60%" } }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: base.units.reduce((acc, u) => acc + u.quantity, 0) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        base.queues.buildings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-orange-500 animate-pulse", title: "Construção Ativa" }),
        base.queues.units > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse", title: "Recrutamento Ativo" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 bg-white/5 rounded hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" }) }) })
    ] }, base.id)) })
  ] }) });
}
function ResourceMini({ type, value }) {
  const colors = {
    suprimentos: "text-green-400",
    combustivel: "text-orange-400",
    municoes: "text-red-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-mono font-bold ${colors[type]}`, children: Math.floor(value).toLocaleString() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] uppercase text-gray-500", children: type.substring(0, 3) })
  ] });
}
function RecruitGrid({ bases, unitTypes, form, onChange, onSubmit }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-green-500" }),
        "MOBILIZAÇÃO EM MASSA"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onSubmit,
          disabled: form.processing,
          className: "px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2 transition-all disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
            "EXECUTAR ORDENS"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto border border-white/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/5 text-[10px] uppercase font-mono text-gray-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 min-w-[200px]", children: "Base" }),
        unitTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: type.name }, type.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: bases.map((base) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/5 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm font-bold", children: base.nome }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-gray-500 font-mono", children: [
            "POP: ",
            Math.floor(base.resources.pessoal)
          ] })
        ] }) }),
        unitTypes.map((type) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: "0",
              className: "w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-center text-sm text-white focus:ring-1 focus:ring-green-500/50",
              placeholder: "0",
              onChange: (e) => onChange(base.id, type.id, e.target.value),
              value: ((_a = form.data.orders[base.id]) == null ? void 0 : _a[type.id]) || ""
            }
          ) }, type.id);
        })
      ] }, base.id)) })
    ] }) })
  ] });
}
function TemplatesPanel({ bases, templates }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid md:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-1 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "w-5 h-5 text-orange-500" }),
          "TEMPLATES"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 bg-white/5 rounded hover:bg-white/10 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: templates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 border border-white/5 p-4 rounded-lg hover:border-orange-500/30 transition-all cursor-pointer group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: template.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-gray-500 hover:text-red-400 transition-colors" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-500 mt-1 font-mono uppercase tracking-widest", children: [
          template.steps.length,
          " Passos de Construção"
        ] })
      ] }, template.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2 bg-white/5 border border-white/5 rounded-xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-12 h-12 mx-auto mb-4 opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Seleciona um template para aplicar às tuas bases em massa." })
    ] }) })
  ] });
}
function GroupsPanel({ bases, groups }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid md:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-1 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tags, { className: "w-5 h-5 text-blue-500" }),
          "GRUPOS TÁTICOS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 bg-white/5 rounded hover:bg-white/10 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: groups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-lg group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: group.color } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: group.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-gray-500 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-gray-500 hover:text-red-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] })
      ] }, group.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-4", children: bases.map((base) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-sm", children: base.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-gray-500", children: base.coordenadas })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
        base.groups.map((groupId) => {
          const g = groups.find((x) => x.id === groupId);
          return g ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] px-2 py-0.5 rounded-full text-white font-bold", style: { backgroundColor: g.color }, children: g.name }, g.id) : null;
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 text-gray-400" }) })
      ] })
    ] }, base.id)) }) })
  ] });
}
export {
  CommandCenter as default
};
//# sourceMappingURL=Index-CXW9vNbH.js.map
