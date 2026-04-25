import { j as jsxRuntimeExports, L as Le, Z as Zap } from "./app-53bo1oQQ.js";
import { A as AppLayout, C as ChevronRight } from "./app-layout-CM7qIzEm.js";
import { S as Sword } from "./sword-D0hWy3oG.js";
import { S as Shield } from "./target--XsK4i2b.js";
import { C as Calendar, S as Skull } from "./skull-dZbY2S-N.js";
import "./app-logo-icon-_a7zU46J.js";
import "./index-QzvxKlbG.js";
import "./index-Bq47Tq_5.js";
function Index({ relatorios }) {
  const { auth } = usePage().props;
  const jogadorId = auth.user.jogador.id;
  const calculateTotalLosses = (losses) => {
    return Object.values(losses || {}).reduce((acc, curr) => acc + curr, 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs: [{ title: "Intel: Relatórios de Batalha", href: "/relatorios" }], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "SITREP: Relatórios de Batalha" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto p-4 md:p-8 space-y-8", children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: relatorios.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 border border-dashed border-white/10 rounded-3xl p-12 text-center text-neutral-600 uppercase font-black text-xs tracking-widest", children: "Nenhum registo de combate detetado nos arquivos." }) : relatorios.map((rel, idx) => {
        const isVitoria = rel.vencedor_id === jogadorId;
        const totalLosses = calculateTotalLosses(rel.detalhes.perdas_atacante);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            href: `/relatorios/${rel.id}`,
            className: "group relative bg-neutral-900/40 hover:bg-neutral-800/40 border border-white/5 hover:border-sky-500/30 rounded-[2rem] p-6 transition-all shadow-xl overflow-hidden block",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0 left-0 w-1.5 h-full ${isVitoria ? "bg-emerald-500" : "bg-red-500"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-2xl border ${isVitoria ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`, children: isVitoria ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 text-[10px] font-mono", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10, className: "text-neutral-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-500 uppercase", children: new Date(rel.created_at).toLocaleString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-700", children: "|" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-500 font-bold", children: [
                        "SETOR ",
                        rel.detalhes.coords
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xl font-black text-white uppercase tracking-tight flex items-center gap-3", children: [
                      rel.origem_nome,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-neutral-700" }),
                      rel.destino_nome
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "CASUALTIES", value: totalLosses, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { size: 10 }), color: "text-red-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "STATUS", value: isVitoria ? "VICTORY" : "DEFEAT", color: isVitoria ? "text-emerald-400" : "text-red-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "MISSION", value: rel.titulo.split(":")[0], color: "text-neutral-400" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-6 shrink-0", children: Object.entries(rel.detalhes.saque || {}).some(([_, v]) => v > 0) ? Object.entries(rel.detalhes.saque).map(([res, qty]) => {
                  if (qty === 0) return null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-600 uppercase tracking-tighter", children: res }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-white font-mono", children: [
                      "+",
                      qty.toLocaleString()
                    ] })
                  ] }, res);
                }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-700 uppercase italic", children: "Reconhecimento apenas" }) })
              ] })
            ]
          },
          rel.id
        );
      }) })
    ] })
  ] });
}
const Badge = ({ label, value, icon, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5", children: [
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
//# sourceMappingURL=Index-D2KfA2NS.js.map
