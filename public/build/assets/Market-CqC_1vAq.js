import { c as createLucideIcon, r as reactExports, m as me, j as jsxRuntimeExports, L as Le, A as AnimatePresence, a as motion, Z as Zap, I as Info, S as Sr } from "./app-0fwKqyr9.js";
import { A as AppLayout, S as ShoppingBag } from "./app-layout-zB76SOA_.js";
import { t as toast } from "./index-D4TKQ6Fn.js";
import { S as Search } from "./search-ReQ913xA.js";
import { P as Plus } from "./plus-nHk9kymi.js";
import { T as Trash2 } from "./trash-2-D7n7DdB1.js";
import "./app-logo-icon-CkcE2dVq.js";
import "./index-DB7kgpoC.js";
import "./index-C35zR0l_.js";
import "./target-BkiThDOO.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("ArrowRight", __iconNode$2);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("ArrowUpRight", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3", key: "1yg77f" }]
];
const Filter = createLucideIcon("Filter", __iconNode);
function PremiumMarket({ offers, myOffers, bases }) {
  var _a, _b;
  const [filterType, setFilterType] = reactExports.useState("all");
  const offerForm = me({
    base_id: ((_a = bases[0]) == null ? void 0 : _a.id) || "",
    resource_type: "suprimentos",
    amount: 1e3,
    price_pp: 10
  });
  const buyForm = me({
    target_base_id: ((_b = bases[0]) == null ? void 0 : _b.id) || ""
  });
  const handleCreateOffer = (e) => {
    e.preventDefault();
    offerForm.post(route("premium.market.store"), {
      onSuccess: () => {
        toast.success("Oferta colocada no mercado!");
        offerForm.reset("amount", "price_pp");
      },
      onError: (errors) => toast.error(errors.error || "Erro ao criar oferta")
    });
  };
  const handleBuy = (offerId) => {
    buyForm.post(route("premium.market.buy", offerId), {
      onSuccess: () => toast.success("Recursos adquiridos com sucesso!"),
      onError: (errors) => toast.error(errors.error || "Erro na transação")
    });
  };
  const handleCancel = (offerId) => {
    if (!confirm("Deseja cancelar esta oferta? Os recursos serão devolvidos.")) return;
    Sr.delete(route("premium.market.destroy", offerId), {
      onSuccess: () => toast.success("Oferta cancelada.")
    });
  };
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Área Premium", href: "/premium" },
    { title: "Mercado Premium", href: "/premium/market" }
  ];
  const filteredOffers = offers.filter((o) => filterType === "all" || o.recurso_tipo === filterType);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Mercado Premium - Guerras Modernas" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tactical-crt-overlay" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-10 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-black tracking-tighter text-white flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 text-amber-500" }),
            "MERCADO_PREMIUM"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-500 font-mono text-[10px] tracking-widest uppercase", children: "Rede de Negócios Táticos Inter-Jogadores" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { size: 14, className: "text-neutral-600 ml-2" }),
          ["all", "suprimentos", "combustivel", "municoes", "metal", "energia"].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilterType(type),
              className: `px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${filterType === type ? "bg-amber-500 text-black" : "text-neutral-500 hover:text-white hover:bg-white/5"}`,
              children: type
            },
            type
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-8 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filteredOffers.length > 0 ? filteredOffers.map((offer) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            layout: true,
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95 },
            className: "bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-amber-500/20 transition-all group relative overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-500 border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 20 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-neutral-500 font-black uppercase block mb-0.5", children: "Vendedor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-white", children: offer.vendedor.username })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-neutral-500 font-black uppercase block mb-0.5", children: "Preço" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black text-amber-500", children: offer.preco_pp }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-amber-500 fill-amber-500/20" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black/60 rounded-xl p-4 border border-white/5 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1", children: "Recurso" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white uppercase tracking-tighter", children: offer.recurso_tipo })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16, className: "text-neutral-700" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-neutral-600 font-black uppercase tracking-widest mb-1", children: "Quantidade" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-black text-emerald-400", children: [
                    offer.quantidade.toLocaleString(),
                    "x"
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleBuy(offer.id),
                  className: "w-full py-3 bg-white/5 hover:bg-amber-500 text-neutral-400 hover:text-black font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-amber-500",
                  children: [
                    "EXECUTAR COMPRA ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { size: 14 })
                  ]
                }
              )
            ]
          },
          offer.id
        )) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl opacity-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 40, className: "mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black uppercase tracking-widest", children: "Sem ofertas disponíveis no setor" })
        ] }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 80 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" }),
              "PUBLICAR_OFERTA"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateOffer, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1", children: "Setor de Origem" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: offerForm.data.base_id,
                    onChange: (e) => offerForm.setData("base_id", e.target.value),
                    className: "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 transition-all outline-none",
                    children: bases.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: b.id, children: [
                      b.nome,
                      " (",
                      b.coordenada_x,
                      "|",
                      b.coordenada_y,
                      ")"
                    ] }, b.id))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1", children: "Recurso" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: offerForm.data.resource_type,
                      onChange: (e) => offerForm.setData("resource_type", e.target.value),
                      className: "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 outline-none",
                      children: ["suprimentos", "combustivel", "municoes", "metal", "energia"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t.toUpperCase() }, t))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1", children: "Quantidade" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: offerForm.data.amount,
                      onChange: (e) => offerForm.setData("amount", parseInt(e.target.value)),
                      className: "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 outline-none"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-1", children: "Preço em Pontos Premium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: offerForm.data.price_pp,
                      onChange: (e) => offerForm.setData("price_pp", parseInt(e.target.value)),
                      className: "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-bold focus:border-amber-500/50 outline-none pr-10"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "absolute right-4 top-1/2 -translate-y-1/2 text-amber-500", size: 14 })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  disabled: offerForm.processing,
                  className: "w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50",
                  children: "REGISTAR OFERTA NA REDE"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] px-2 flex items-center justify-between", children: [
              "MINHAS_ATIVAS",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/5 px-2 py-0.5 rounded text-neutral-700", children: myOffers.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: myOffers.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-white uppercase tracking-tighter", children: [
                  o.quantidade.toLocaleString(),
                  "x ",
                  o.recurso_tipo
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] text-neutral-600 font-bold uppercase", children: [
                  o.preco_pp,
                  " PP"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleCancel(o.id),
                  className: "p-2 text-neutral-600 hover:text-red-500 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                }
              )
            ] }, o.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "text-amber-500 shrink-0", size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-amber-500 uppercase tracking-widest block", children: "Diretriz Operacional" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-500/60 leading-relaxed font-mono", children: "As trocas no mercado premium são instantâneas. Ao cancelar uma oferta, os recursos são devolvidos à sua base principal." })
            ] })
          ] })
        ] })
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
                    opacity: 0.1;
                }
            ` })
  ] });
}
export {
  PremiumMarket as default
};
//# sourceMappingURL=Market-CqC_1vAq.js.map
