import { u as useToasts, K, m as me, j as jsxRuntimeExports, L as Le, $ as $e, Z as Zap, a as motion } from "./app-W4_akyvL.js";
import { A as AppLayout } from "./app-layout-zVmEFjCd.js";
import { C as ChevronLeft } from "./chevron-left-J5lDPvgM.js";
import { M as MessageSquare } from "./message-square-CTeUQBeQ.js";
import { U as User } from "./user-CP9YBHwR.js";
import { C as Calendar } from "./calendar-BRbF2H3Q.js";
import { S as Send } from "./send-rAUpRQ4-.js";
import "./app-logo-icon-tm1Phrkp.js";
import "./index-5tm6G4vl.js";
import "./index-B7rWXqhj.js";
import "./target-ClwMquvZ.js";
function Show({ topico }) {
  const { addToast } = useToasts();
  const { auth } = K().props;
  const { data, setData, post, processing, reset } = me({
    conteudo: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/alianca/forum/topico/${topico.id}/post`, {
      onSuccess: () => {
        reset();
        addToast("Transmissão enviada com sucesso.", "success");
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs: [
    { title: "Aliança", href: "/alianca" },
    { title: "Fórum", href: "/alianca/forum" },
    { title: topico.titulo, href: `/alianca/forum/topico/${topico.id}` }
  ], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: topico.titulo }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto p-4 md:p-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          $e,
          {
            href: "/alianca/forum",
            className: "inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }),
              " Voltar à Assembleia"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-8 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 120 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-sky-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]", children: [
                "ALLIANCE_PROTOCOL_",
                topico.id
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tighter", children: topico.titulo }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-sky-400 border border-white/5", children: [
                "TAG: ",
                topico.alianca.tag
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-neutral-600 font-mono text-[10px] uppercase", children: [
                "Lançado por: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-400", children: topico.jogador.username })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: topico.posts.map((post2, idx) => {
        const isMe = post2.jogador.username === auth.user.name;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: isMe ? 20 : -20 },
            animate: { opacity: 1, x: 0 },
            className: `flex gap-4 ${isMe ? "flex-row-reverse" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex flex-col items-center gap-2 shrink-0 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-lg", children: post2.jogador.username[0].toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-500 uppercase tracking-tighter w-16 text-center truncate", children: post2.jogador.username })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 space-y-2 ${isMe ? "items-end" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-6 rounded-[2rem] border transition-all ${isMe ? "bg-sky-600/10 border-sky-500/20 text-sky-100 rounded-tr-none" : "bg-neutral-900/40 border-white/5 text-neutral-300 rounded-tl-none"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4 pb-4 border-b border-white/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12, className: isMe ? "text-sky-400" : "text-neutral-600" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-black uppercase tracking-widest ${isMe ? "text-sky-400" : "text-neutral-500"}`, children: post2.jogador.username })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-neutral-600 font-mono", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10 }),
                    " ",
                    new Date(post2.created_at).toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm leading-relaxed whitespace-pre-wrap font-medium", children: post2.conteudo })
              ] }) })
            ]
          },
          post2.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18, className: "text-sky-500" }),
          " Adicionar Transmissão"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              required: true,
              rows: 4,
              value: data.conteudo,
              onChange: (e) => setData("conteudo", e.target.value),
              className: "w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-sky-500 transition-all text-sm outline-none shadow-inner",
              placeholder: "Escreve a tua contribuição para este debate..."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              disabled: processing,
              className: "flex items-center gap-3 px-10 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50 group",
              children: [
                processing ? "Transmitindo..." : "Enviar Mensagem",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14, className: "group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" })
              ]
            }
          ) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
//# sourceMappingURL=Show-8JCPwk_Y.js.map
