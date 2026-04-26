import { c as createLucideIcon, K, j as jsxRuntimeExports, L as Le, $ as $e, Z as Zap, I as Info, S as Sr } from "./app-zEnuvfbY.js";
import { A as AppLayout } from "./app-layout-whQsllPh.js";
import { C as ChevronLeft } from "./chevron-left-DPx3_gxP.js";
import { S as Share2, a as Skull } from "./skull-CXiA7Kcf.js";
import { T as Trophy } from "./trophy-BxaEDEG9.js";
import { C as Calendar } from "./calendar-Cpu4Jf_J.js";
import { S as Sword } from "./sword-DpXkvq5E.js";
import { C as ChartColumn } from "./chart-column-BeVZoGul.js";
import { T as TrendingUp } from "./trending-up-eKYT4L5R.js";
import { S as Shield } from "./target-DP1LL4cc.js";
import "./app-logo-icon-cK-48UX2.js";
import "./index-DyveJGaU.js";
import "./index-B4Qppahz.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "22 17 13.5 8.5 8.5 13.5 2 7", key: "1r2t7k" }],
  ["polyline", { points: "16 17 22 17 22 11", key: "11uiuu" }]
];
const TrendingDown = createLucideIcon("TrendingDown", __iconNode);
function Show({ relatorio }) {
  const { auth } = K().props;
  const isAtacante = relatorio.atacante_id === auth.user.jogador.id;
  const isVitoria = relatorio.vencedor_id === auth.user.jogador.id;
  const canShare = isAtacante || relatorio.defensor_id === auth.user.jogador.id;
  const det = relatorio.detalhes;
  const handleShare = () => {
    Sr.post(`/relatorios/${relatorio.id}/partilhar`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs: [
    { title: "Relatórios", href: "/relatorios" },
    { title: `SITREP: ${relatorio.id}`, href: `/relatorios/${relatorio.id}` }
  ], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: `Relatório de Batalha #${relatorio.id}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 md:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          $e,
          {
            href: "/relatorios",
            className: "inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }),
              " Arquivos Centrais"
            ]
          }
        ),
        canShare && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleShare,
            className: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${relatorio.partilhado_alianca ? "bg-sky-600 text-white" : "bg-white/5 text-neutral-500 hover:text-white border border-white/5"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 14 }),
              " ",
              relatorio.partilhado_alianca ? "Partilhado com a Coligação" : "Partilhar com a Coligação"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900/60 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0 right-0 p-12 opacity-5 pointer-events-none`, children: isVitoria ? /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 160 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skull, { size: 160 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isVitoria ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`, children: isVitoria ? "Missão Concluída" : "Falha na Operação" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-neutral-600 font-mono text-xs", children: [
                "ID: ",
                relatorio.id
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none", children: relatorio.titulo }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-neutral-500 font-mono text-xs flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
              " ",
              new Date(relatorio.created_at).toLocaleString(),
              " | Setor ",
              det.coords
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-neutral-600 uppercase", children: "Resultado Táctico" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-3xl font-black uppercase ${isVitoria ? "text-emerald-500" : "text-red-500"}`, children: isVitoria ? "+ VITÓRIA" : "- DERROTA" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          BattleForceCard,
          {
            title: "Desdobramento Ofensivo",
            actor: relatorio.atacante.nome,
            base: relatorio.origem_nome,
            units: det.attacker_units,
            color: "sky",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sword, { size: 18 })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 14, className: "text-sky-500" }),
              " Analítica de Combate"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatRow,
                {
                  label: "Probabilidade de Sorte",
                  value: `${(det.stats.luck * 100).toFixed(1)}%`,
                  desc: "Modificador aleatório de impacto",
                  color: det.stats.luck >= 0 ? "text-emerald-400" : "text-red-400",
                  icon: det.stats.luck >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatRow,
                {
                  label: "Moral da Tropa",
                  value: `${det.stats.moral}%`,
                  desc: "Eficiência baseada no porte do alvo",
                  color: det.stats.moral >= 100 ? "text-emerald-400" : "text-orange-400",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatRow,
                {
                  label: "Defesa de Perímetro",
                  value: `+${(det.stats.wall_bonus * 100).toFixed(0)}%`,
                  desc: "Vantagem táctica da muralha",
                  color: "text-white",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatRow,
                {
                  label: "Bónus Noturno",
                  value: det.stats.is_night ? "+100%" : "Inativo",
                  desc: "Operações sob cobertura da escuridão",
                  color: det.stats.is_night ? "text-indigo-400" : "text-neutral-600",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-white/5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-neutral-500 uppercase", children: "Força Atacante Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black text-white", children: Math.round(det.stats.attack_power).toLocaleString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-neutral-500 uppercase", children: "Resistência Defensiva" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black text-red-500", children: Math.round(det.stats.defense_power).toLocaleString() })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-950/10 border border-emerald-500/20 rounded-[2rem] p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
              " Espólio Capturado"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              Object.entries(det.saque).map(([res, qty]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black text-neutral-500 uppercase mb-1", children: res }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white", children: qty.toLocaleString() })
              ] }, res)),
              Object.values(det.saque).every((v) => v === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 py-4 text-center text-neutral-600 text-[10px] font-black uppercase italic", children: "Transmissão: Zero recursos capturados" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          BattleForceCard,
          {
            title: "Guarnição Defensiva",
            actor: relatorio.defensor ? relatorio.defensor.nome : "FORÇAS LOCAIS",
            base: relatorio.destino_nome,
            units: det.defender_units,
            color: "red",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 18 })
          }
        ) })
      ] })
    ] })
  ] });
}
const BattleForceCard = ({ title, actor, base, units, color, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 space-y-4", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2", children: [
      icon,
      " ",
      title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-white uppercase", children: actor }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-neutral-600 font-mono uppercase", children: base })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 px-2 py-1 text-[8px] font-black text-neutral-700 uppercase", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: "Unidade" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: "Total" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: "Perdas" })
    ] }),
    units.map((unit) => {
      const qty = unit.quantity + (unit.losses || 0);
      const loss = unit.losses || 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center bg-black/40 p-2 rounded-xl border border-white/5 group hover:border-white/10 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-[10px] font-bold text-neutral-300 uppercase truncate", children: unit.name.replace(/_/g, " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-[11px] font-mono font-bold text-white", children: qty }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-center text-[11px] font-mono font-bold ${loss > 0 ? "text-red-500" : "text-neutral-700"}`, children: [
          "-",
          loss
        ] })
      ] }, unit.name);
    }),
    units.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center border border-dashed border-white/10 rounded-xl text-neutral-600 text-[10px] font-black uppercase tracking-widest", children: "Sem registo de tropas" })
  ] })
] });
const StatRow = ({ label, value, desc, color, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between group", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-500", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black text-neutral-400 uppercase tracking-tighter", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] text-neutral-700 uppercase font-bold", children: desc })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-black font-mono ${color}`, children: value })
] });
export {
  Show as default
};
//# sourceMappingURL=Show-DdZjLgdG.js.map
