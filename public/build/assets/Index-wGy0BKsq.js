import { c as createLucideIcon, m as me, j as jsxRuntimeExports, L as Le, Z as Zap } from "./app-C33sIJtt.js";
import { A as AppLayout, c as Crown } from "./app-layout-Y062SkOH.js";
import { t as toast } from "./index-DtkrpIb3.js";
import { P as Plus } from "./plus-CzAeksbt.js";
import { C as Clock } from "./clock-CxmZ_rb7.js";
import { C as CircleCheck } from "./circle-check-D5O22G58.js";
import { U as Users } from "./users-BLQuPIeG.js";
import { A as Activity } from "./activity-DRfvHcf_.js";
import "./app-logo-icon-C1K7rCIc.js";
import "./index-RDjnq4YG.js";
import "./index-Cnns3f0Q.js";
import "./target-B8wXYa3E.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("CreditCard", __iconNode$2);
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
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
      key: "m3kijz"
    }
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
      key: "1fmvmk"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", key: "1f8sc4" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }]
];
const Rocket = createLucideIcon("Rocket", __iconNode$1);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("ShieldCheck", __iconNode);
function PremiumIndex({ jogador, prices }) {
  const buyForm = me({ amount: 1e3 });
  const activateForm = me({ days: 30 });
  const handleBuyPoints = () => {
    buyForm.post(route("premium.buy"), {
      onSuccess: () => toast.success("Pontos Premium creditados!")
    });
  };
  const handleActivate = (days) => {
    activateForm.setData("days", days);
    activateForm.post(route("premium.activate"), {
      onSuccess: () => toast.success("Conta Premium ativada!"),
      onError: (errors) => toast.error(Object.values(errors)[0])
    });
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Área Premium", href: "/premium" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Área Premium - Guerras Modernas" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tactical-crt-overlay" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-10 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/60 border border-amber-500/20 p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 120, className: "text-amber-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-black tracking-tighter text-white flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-10 h-10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" }),
              "ÁREA PREMIUM"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amber-500/60 font-mono text-sm tracking-widest uppercase", children: "Upgrade tático e vantagens de comando avançado" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col items-center min-w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-500 font-black uppercase tracking-tighter", children: "Saldo Atual" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-white", children: jogador.pontos_premium }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 text-amber-500 fill-amber-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleBuyPoints,
                className: "mt-3 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.3)]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                  " ADQUIRIR PONTOS"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 hover:border-blue-500/30 transition-all group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white", children: "REDUÇÃO DE TEMPO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm leading-relaxed", children: "Corta o tempo restante de qualquer construção ou recrutamento pela metade instantaneamente." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-6 border-t border-white/5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono text-blue-400", children: [
              prices.reduce_time,
              " PP / uso"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12, className: "text-blue-500" }),
              " Ativo na Fila"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-8 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl -z-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-white", children: "CONTA PREMIUM" }),
                  jogador.e_premium && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter", children: "Ativa" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300", children: "Acesso total às ferramentas de elite para jogadores que gerem grandes impérios." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BenefitItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "w-4 h-4" }), text: "+20% Produção de Recursos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BenefitItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }), text: "Overviews Massivos (Command Center)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BenefitItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }), text: "Fila de Construção Alargada (+5)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BenefitItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }), text: "Estatísticas e Gráficos de Evolução" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BenefitItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" }), text: "Avisos de Ataque Via Notificação" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BenefitItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" }), text: "Sem Publicidade / Layout Clean" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-[250px] bg-black/40 border border-amber-500/20 p-6 rounded-xl flex flex-col justify-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-500 font-bold uppercase tracking-widest", children: "Plano Mensal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-black text-white", children: prices.premium_30 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-amber-500", children: "PP" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleActivate(30),
                  disabled: activateForm.processing,
                  className: "w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50",
                  children: "ATIVAR 30 DIAS"
                }
              ),
              jogador.premium_until && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-center text-gray-500 font-mono italic", children: [
                "Válido até: ",
                new Date(jogador.premium_until).toLocaleDateString()
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-xs font-mono uppercase tracking-widest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 p-4 rounded-lg border border-white/5", children: "[!] Os Pontos Premium não podem ser trocados por recursos entre jogadores nesta fase." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/40 p-4 rounded-lg border border-white/5", children: "[!] Ativar a Conta Premium renova automaticamente as vantagens táticas por 30 ciclos solares." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .tactical-crt-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
                                linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
                    background-size: 100% 4px, 3px 100%;
                    pointer-events: none;
                    z-index: 50;
                    opacity: 0.15;
                }
            ` })
  ] });
}
function BenefitItem({ icon, text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-sm text-gray-400 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity", children: icon }),
    text
  ] });
}
export {
  PremiumIndex as default
};
//# sourceMappingURL=Index-wGy0BKsq.js.map
