import { u as useToasts, r as reactExports, m as me, j as jsxRuntimeExports, L as Le, Z as Zap, a as motion, $ as $e } from "./app-BjbVjDVo.js";
import { A as AppLayout, C as ChevronRight } from "./app-layout-DpLuHBP4.js";
import { P as Plus } from "./plus-vHxUK-mY.js";
import { M as MessageSquare } from "./message-square-C8ghOx_p.js";
import { U as User } from "./user-A5UXhm5J.js";
import { C as Calendar } from "./calendar-BIAVm9xZ.js";
import "./app-logo-icon-BpJqBxUi.js";
import "./index-Dw3ZUxQb.js";
import "./index-COMy9gTC.js";
import "./target-uS6TvDbj.js";
function Index({ topicos, alianca }) {
  const { addToast } = useToasts();
  const [showNew, setShowNew] = reactExports.useState(false);
  const { data, setData, post, processing, reset } = me({
    titulo: "",
    conteudo: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/alianca/forum/topico", {
      onSuccess: () => {
        setShowNew(false);
        reset();
        addToast("Novo tópico estratégico aberto!", "success");
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs: [
    { title: "Aliança", href: "/alianca" },
    { title: "Fórum da Coligação", href: "/alianca/forum" }
  ], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: `Fórum [${alianca.tag}]` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto p-4 md:p-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-sky-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]", children: "ALLIANCE_INTEL_NETWORK" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl font-black text-white uppercase tracking-tighter", children: [
            "Assembleia da ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sky-500", children: "Coligação" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-neutral-500 text-xs font-mono mt-2 italic uppercase", children: [
            "[",
            alianca.tag,
            "] Canal de Discussão Interno - Nível de Acesso: CONFIDENCIAL"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowNew(!showNew),
            className: "flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
              " Abrir Novo Tópico"
            ]
          }
        )
      ] }),
      showNew && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: "bg-neutral-900/60 border border-sky-500/30 rounded-[2rem] p-8 shadow-2xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-white uppercase tracking-tight mb-6", children: "Iniciar Novo Protocolo de Discussão" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-black uppercase text-neutral-500 mb-1", children: "Título do Assunto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    required: true,
                    value: data.titulo,
                    onChange: (e) => setData("titulo", e.target.value),
                    className: "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500 transition-all font-bold",
                    placeholder: "Ex: Estratégia de Invasão ao Setor Norte"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-black uppercase text-neutral-500 mb-1", children: "Mensagem Inicial" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    required: true,
                    rows: 5,
                    value: data.conteudo,
                    onChange: (e) => setData("conteudo", e.target.value),
                    className: "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500 transition-all text-sm",
                    placeholder: "Descreve os detalhes da proposta ou informação..."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-4 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowNew(false),
                    className: "px-6 py-3 text-neutral-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all",
                    children: "Cancelar"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    disabled: processing,
                    className: "px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50",
                    children: processing ? "Transmitindo..." : "Publicar Protocolo"
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 divide-y divide-white/5", children: topicos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mx-auto text-neutral-800 mb-4", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-neutral-600 uppercase font-black text-xs tracking-widest", children: "Nenhum debate activo nos arquivos da coligação." })
      ] }) : topicos.map((topico) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        $e,
        {
          href: `/alianca/forum/topico/${topico.id}`,
          className: "group flex flex-col md:flex-row justify-between items-center p-6 hover:bg-white/[0.02] transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 p-4 rounded-2xl border border-white/5 text-neutral-500 group-hover:text-sky-400 group-hover:border-sky-500/30 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 24 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-black text-white uppercase tracking-tight group-hover:text-sky-400 transition-colors", children: topico.titulo }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 10, className: "text-neutral-700" }),
                    " ",
                    topico.jogador.username
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10, className: "text-neutral-700" }),
                    " ",
                    new Date(topico.created_at).toLocaleDateString()
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] font-black text-neutral-600 uppercase tracking-tighter", children: "Última Transmissão" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-neutral-400 uppercase", children: new Date(topico.last_post_at).toLocaleString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "text-neutral-800 group-hover:text-sky-500 transition-all" })
            ] })
          ]
        },
        topico.id
      )) }) })
    ] })
  ] });
}
export {
  Index as default
};
//# sourceMappingURL=Index-CSyfLsYV.js.map
