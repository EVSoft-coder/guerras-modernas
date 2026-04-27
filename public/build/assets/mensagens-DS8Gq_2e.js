import { c as createLucideIcon, j as jsxRuntimeExports, a as motion, u as useToasts, r as reactExports, L as Le, $ as $e, S as Sr } from "./app-CtviB7P3.js";
import { H as House, A as AppLayout, c as Mail } from "./app-layout-Cmw4q7wG.js";
import { S as Search } from "./search-BxTWKn4O.js";
import { P as Package } from "./package-76Xl0OBh.js";
import { C as ChartColumn } from "./chart-column-DbY_Rnig.js";
import { S as Shield, T as Target } from "./target-lAf3rpe4.js";
import { S as Sword } from "./sword-DmIiavgN.js";
import { S as Send } from "./send-CF4M3rw_.js";
import { T as Trash2 } from "./trash-2-5ww3Ml6M.js";
import "./app-logo-icon-Btliqrb2.js";
import "./index-B0LzX_fb.js";
import "./index-B88tsmT5.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("CheckCheck", __iconNode$1);
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
      d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
      key: "1jhwl8"
    }
  ],
  ["path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10", key: "1qfld7" }]
];
const MailOpen = createLucideIcon("MailOpen", __iconNode);
const SpyReport = ({ report }) => {
  var _a, _b;
  const hasBuildings = report.buildings && report.buildings.length > 0;
  const hasUnits = report.units && report.units.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-sky-500/30 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-sky-500/20 rounded-lg border border-sky-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "text-sky-400", size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sky-400 font-black text-sm uppercase tracking-widest", children: "Relatório de Inteligência" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-neutral-500 uppercase font-bold", children: [
            "Setor: ",
            report.base_name,
            " (#",
            report.base_id,
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-neutral-500 block mb-1", children: "DATA DA INFILTRAÇÃO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-white", children: new Date(report.timestamp).toLocaleString() })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-black/40 rounded-xl border border-white/5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h5", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 12, className: "text-amber-500" }),
          " Reservas de Recursos"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.entries(report.resources).map(([res, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[9px] uppercase font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-500", children: res }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: (val || 0).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-white/5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { width: 0 },
              animate: { width: `${Math.min(100, val / 5e3 * 100)}%` },
              className: `h-full ${res === "suprimentos" ? "bg-emerald-500" : res === "combustivel" ? "bg-orange-500" : "bg-sky-500"}`
            }
          ) })
        ] }, res)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-sky-950/20 rounded-xl border border-sky-500/10 flex flex-col justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-sky-500/10 rounded-full border border-sky-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "text-sky-500", size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-sky-400 font-black uppercase", children: "Grau de Infiltração" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-white", children: hasUnits ? "TOTAL (NÍVEL 3)" : hasBuildings ? "AVANÇADO (NÍVEL 2)" : "BÁSICO (NÍVEL 1)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-neutral-500 italic leading-relaxed", children: "A profundidade dos dados obtidos depende do número de espiões que sobreviveram à missão e da capacidade de contra-espionagem do alvo." })
      ] })
    ] }),
    hasBuildings ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-black/40 rounded-xl border border-white/5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h5", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 12, className: "text-sky-400" }),
        " Estruturas e Infraestrutura"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: (_a = report.buildings) == null ? void 0 : _a.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between group hover:border-sky-500/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-neutral-400 uppercase font-black truncate mr-2", children: (b.type || b.tipo || "ESTRUTURA_DESCONHECIDA").replace(/_/g, " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20", children: [
          "LVL ",
          b.nivel || 0
        ] })
      ] }, i)) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-dashed border-white/5 rounded-xl text-center py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mx-auto text-neutral-700 mb-2", size: 24 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-neutral-600 uppercase font-bold tracking-widest", children: [
        "Dados de Infraestrutura Ocultos ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] opacity-50", children: "É necessário maior rácio de sobrevivência para mapear edifícios." })
      ] })
    ] }),
    hasUnits ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-red-950/20 rounded-xl border border-red-500/20 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h5", { className: "text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 12 }),
        " Guarnição e Defesas Ativas"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (_b = report.units) == null ? void 0 : _b.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 bg-black/40 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 14, className: "text-red-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-300 uppercase tracking-tighter", children: (u.name || u.nome || "UNIDADE_DESCONHECIDA").replace(/_/g, " ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-white font-black", children: (u.quantity || u.quantidade || 0).toLocaleString() })
      ] }, i)) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-dashed border-white/5 rounded-xl text-center py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "mx-auto text-neutral-700 mb-2 opacity-30", size: 24 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-neutral-600 uppercase font-bold tracking-widest", children: [
        "Análise de Guarnição Indisponível ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] opacity-50", children: "Dados interceptados pelo sistema de radar inimigo." })
      ] })
    ] })
  ] });
};
const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Mensagens", href: "/mensagens" }
];
function Mensagens({ mensagens, naoLidas, filtroAtivo }) {
  const { addToast } = useToasts();
  const [viewingMsg, setViewingMsg] = reactExports.useState(null);
  const [composing, setComposing] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({ destinatario: "", assunto: "", corpo: "" });
  const [isSending, setIsSending] = reactExports.useState(false);
  const openMessage = (msg) => {
    setViewingMsg(msg);
    if (!msg.lida) {
      fetch(`/mensagens/${msg.id}`).then((r) => r.json()).then(() => {
        Sr.reload({ only: ["mensagens", "naoLidas"] });
      });
    }
  };
  const deleteMessage = (id, e) => {
    e.stopPropagation();
    if (!confirm("Eliminar esta mensagem?")) return;
    Sr.delete(`/mensagens/${id}`, {
      onSuccess: () => {
        addToast("Mensagem eliminada.", "info");
        if ((viewingMsg == null ? void 0 : viewingMsg.id) === id) setViewingMsg(null);
      }
    });
  };
  const markAllRead = () => {
    Sr.post("/mensagens/marcar-lidas", {}, {
      onSuccess: () => addToast("Todas marcadas como lidas.", "success")
    });
  };
  const handleSend = (e) => {
    e.preventDefault();
    setIsSending(true);
    Sr.post("/mensagens/enviar", formData, {
      onSuccess: () => {
        addToast("Mensagem enviada com sucesso!", "success");
        setComposing(false);
        setFormData({ destinatario: "", assunto: "", corpo: "" });
      },
      onError: (err) => {
        addToast(Object.values(err)[0] || "Erro ao enviar.", "error");
      },
      onFinish: () => setIsSending(false)
    });
  };
  const changeFilter = (e) => {
    Sr.get("/mensagens", { tipo: e.target.value }, { preserveState: true });
  };
  const getIcon = (tipo, lida) => {
    if (!lida) return /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "text-sky-400 fill-sky-400/20 animate-pulse", size: 18 });
    if (tipo === "relatorio_ataque") return /* @__PURE__ */ jsxRuntimeExports.jsx(MailOpen, { className: "text-red-400", size: 18 });
    if (tipo === "relatorio_defesa") return /* @__PURE__ */ jsxRuntimeExports.jsx(MailOpen, { className: "text-emerald-400", size: 18 });
    if (tipo === "espionagem") return /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "text-sky-400", size: 18 });
    if (tipo === "sistema") return /* @__PURE__ */ jsxRuntimeExports.jsx(MailOpen, { className: "text-amber-400", size: 18 });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MailOpen, { className: "text-neutral-500", size: 18 });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Caixa de Mensagens" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-6 p-6 min-h-[calc(100vh-4rem)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-white/5 bg-white/5 flex flex-wrap gap-4 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "text-sky-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg uppercase tracking-widest text-white", children: "Comunicações" }),
            naoLidas > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-sky-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full", children: [
              naoLidas,
              " NOVA",
              naoLidas > 1 ? "S" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: filtroAtivo,
                onChange: changeFilter,
                className: "bg-black/50 border border-white/10 text-white text-xs p-2 rounded",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "todas", children: "Todas as Mensagens" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "privada", children: "Mensagens Privadas" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "relatorio_ataque", children: "Relatórios de Ofensiva" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "relatorio_defesa", children: "Relatórios de Defesa" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "espionagem", children: "Relatórios de Espionagem" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sistema", children: "Comunicações do Sistema" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: markAllRead, className: "p-2 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition", title: "Marcar todas como lidas", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 18 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setComposing(true);
                  setViewingMsg(null);
                },
                className: "px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase rounded flex items-center gap-2 transition",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 }),
                  " Nova Mensagem"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: mensagens.data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-neutral-500 font-mono text-sm uppercase", children: "Nenhuma comunicação registada nesta frequência." }) : mensagens.data.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => openMessage(msg),
            className: `p-4 border-b border-white/5 flex items-center gap-4 cursor-pointer transition-colors
                                        ${(viewingMsg == null ? void 0 : viewingMsg.id) === msg.id ? "bg-sky-900/30" : "hover:bg-white/5"}
                                        ${!msg.lida ? "bg-white/[0.02]" : ""}
                                    `,
            children: [
              getIcon(msg.tipo, msg.lida),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold truncate ${!msg.lida ? "text-white" : "text-neutral-400"}`, children: msg.remetente ? msg.remetente.username : "COMANDO CENTRAL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-neutral-500", children: new Date(msg.created_at).toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm truncate ${!msg.lida ? "text-sky-100 font-medium" : "text-neutral-500"}`, children: msg.assunto })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => deleteMessage(msg.id, e),
                  className: "p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                }
              )
            ]
          },
          msg.id
        )) }),
        mensagens.last_page > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-white/5 flex justify-center gap-2", children: mensagens.links.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          $e,
          {
            href: link.url || "#",
            className: `px-3 py-1 text-xs border rounded ${link.active ? "bg-sky-500 text-black border-sky-500 font-bold" : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30"} ${!link.url && "opacity-50 pointer-events-none"}`,
            dangerouslySetInnerHTML: { __html: link.label }
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:w-1/2 flex flex-col", children: composing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/5 border-b border-white/10 font-bold text-sky-400 uppercase tracking-widest flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nova Transmissão" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setComposing(false), className: "text-neutral-500 hover:text-white", children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSend, className: "p-6 flex flex-col gap-4 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-black uppercase text-neutral-500 mb-1", children: "Destinatário (Username)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                required: true,
                type: "text",
                value: formData.destinatario,
                onChange: (e) => setFormData({ ...formData, destinatario: e.target.value }),
                className: "w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-black uppercase text-neutral-500 mb-1", children: "Assunto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                required: true,
                type: "text",
                value: formData.assunto,
                onChange: (e) => setFormData({ ...formData, assunto: e.target.value }),
                className: "w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-black uppercase text-neutral-500 mb-1", children: "Mensagem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                required: true,
                value: formData.corpo,
                onChange: (e) => setFormData({ ...formData, corpo: e.target.value }),
                className: "w-full flex-1 bg-black/50 border border-white/10 rounded p-2 text-white font-mono text-sm resize-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[200px]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: isSending,
              className: "w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 disabled:opacity-50 transition",
              children: isSending ? "Transmitindo..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 }),
                " Enviar Comunicação"
              ] })
            }
          )
        ] })
      ] }) : viewingMsg ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/5 border-b border-white/10 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-white mb-1", children: viewingMsg.assunto }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-neutral-400", children: [
              "De: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sky-400 font-bold", children: viewingMsg.remetente ? viewingMsg.remetente.username : "COMANDO CENTRAL" }),
              " • ",
              new Date(viewingMsg.created_at).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewingMsg(null), className: "text-neutral-500 hover:text-white", children: "✕" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 overflow-y-auto flex-1 font-mono text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed", children: viewingMsg.tipo === "espionagem" && viewingMsg.metadata ? /* @__PURE__ */ jsxRuntimeExports.jsx(SpyReport, { report: viewingMsg.metadata }) : viewingMsg.corpo }),
        viewingMsg.remetente && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-black/20 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setFormData({ destinatario: viewingMsg.remetente.username, assunto: `RE: ${viewingMsg.assunto}`, corpo: `

--- Mensagem Original ---
${viewingMsg.corpo}` });
              setComposing(true);
            },
            className: "px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase rounded flex items-center gap-2 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 }),
              " Responder"
            ]
          }
        ) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/20 border border-white/5 rounded-xl flex-1 flex flex-col items-center justify-center text-neutral-600 p-8 text-center border-dashed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 48, className: "mb-4 opacity-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold uppercase tracking-widest mb-2 text-neutral-500", children: "Terminal de Comunicações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Selecione uma mensagem para ler ou inicie uma nova transmissão." })
      ] }) })
    ] })
  ] });
}
export {
  Mensagens as default
};
//# sourceMappingURL=mensagens-DS8Gq_2e.js.map
