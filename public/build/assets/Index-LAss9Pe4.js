import { K, r as reactExports, j as jsxRuntimeExports, L as Le, Z as Zap, $ as $e } from "./app-C1CZNuKM.js";
import { A as AppLayout, C as ChevronRight } from "./app-layout-DC0YA1Ux.js";
import { S as Sword } from "./sword-BQcVSZKo.js";
import { U as Users } from "./users-oI-C4Jww.js";
import { S as Shield } from "./target-XyqMBh31.js";
import { C as Calendar } from "./calendar-D9P5rGvf.js";
import { S as Share2, a as Skull } from "./skull-dBlns9hQ.js";
import "./app-logo-icon-BDRvy038.js";
import "./index-C-btN2ru.js";
import "./index-BcMjPgBL.js";
function Index({ relatorios, relatoriosAlianca }) {
  const { auth } = K().props;
  const jogadorId = auth.user.jogador.id;
  const [tab, setTab] = reactExports.useState("meus");
  const calculateTotalLosses = (losses) => {
    return Object.values(losses || {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  };
  const currentRelatorios = tab === "meus" ? relatorios : relatoriosAlianca;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs: [{ title: "Intel: Relatórios de Batalha", href: "/relatorios" }], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "SITREP: Relatórios de Batalha" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto p-4 md:p-8 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-6", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setTab("meus"),
              className: `flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === "meus" ? "bg-sky-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 12 }),
                " Os Meus Arquivos"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setTab("alianca"),
              className: `flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === "alianca" ? "bg-sky-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12 }),
                " Inteligência da Coligação"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: currentRelatorios.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 border border-dashed border-white/10 rounded-3xl p-24 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-neutral-700", size: 32 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-neutral-600 uppercase font-black text-xs tracking-widest", children: "Nenhum registo de combate detetado." })
      ] }) : currentRelatorios.map((rel) => {
        const isVitoria = rel.vencedor_id === (tab === "meus" ? jogadorId : rel.atacante_id);
        const totalLosses = calculateTotalLosses(rel.detalhes.perdas_atacante);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          $e,
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
                      rel.partilhado_alianca && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-500 font-bold flex items-center gap-1 uppercase", children: [
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 10 }),
                        " SHARED_INTEL"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xl font-black text-white uppercase tracking-tight flex items-center gap-3", children: [
                      rel.origem_nome,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-neutral-700" }),
                      rel.destino_nome
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "CASUALTIES", value: totalLosses, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { size: 10 }), color: "text-red-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "MISSION", value: rel.titulo.split(":")[0], color: "text-neutral-400" }),
                      tab === "alianca" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { label: "COMANDANTE", value: rel.atacante.nome, color: "text-sky-400" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-6 shrink-0", children: Object.entries(rel.detalhes.saque || {}).some(([_, v]) => (Number(v) || 0) > 0) ? Object.entries(rel.detalhes.saque).map(([res, qty]) => {
                  if ((Number(qty) || 0) === 0) return null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-600 uppercase tracking-tighter", children: res }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-white font-mono", children: [
                      "+",
                      Number(qty).toLocaleString()
                    ] })
                  ] }, res);
                }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-neutral-700 uppercase italic", children: "Apenas Reconhecimento" }) })
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
//# sourceMappingURL=Index-LAss9Pe4.js.map
