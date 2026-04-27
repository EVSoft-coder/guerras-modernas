import { c as createLucideIcon, u as useToasts, r as reactExports, j as jsxRuntimeExports, L as Le, X, S as Sr } from "./app-DJfiCBdL.js";
import { A as AppLayout, L as LogOut, M as Map } from "./app-layout-BlMEkDgH.js";
import { S as Search } from "./search-CaSGwD-O.js";
import { C as Check } from "./index-Dorn97wu.js";
import { U as Users } from "./users-tluJt2dT.js";
import { S as Shield, T as Target } from "./target-D2tFYwrx.js";
import { M as MessageSquare } from "./message-square-D8JbRxZL.js";
import { S as Send } from "./send-BeJisPR4.js";
import "./app-logo-icon-Du27dbA6.js";
import "./index-C9rAfPsX.js";
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
  ["path", { d: "M9 12h6", key: "1c52cq" }],
  ["path", { d: "M12 9v6", key: "199k2o" }]
];
const ShieldPlus = createLucideIcon("ShieldPlus", __iconNode);
const breadcrumbs = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Quartel-General da Aliança", href: "/alianca" }
];
function Alianca({ temAlianca, jogador, alianca, aliancas, pedidoPendente, mensagens, convites, convitesEnviados, diplomacia, todasAliancas }) {
  var _a, _b, _c;
  const { addToast } = useToasts();
  const [nomeCriar, setNomeCriar] = reactExports.useState("");
  const [tagCriar, setTagCriar] = reactExports.useState("");
  const [jogadorConvidar, setJogadorConvidar] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [alvoDiplomacia, setAlvoDiplomacia] = reactExports.useState("");
  const [tipoDiplomacia, setTipoDiplomacia] = reactExports.useState("aliado");
  const [chatMsg, setChatMsg] = reactExports.useState("");
  const chatEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensagens]);
  const handleCreate = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    Sr.post("/alianca/store", { nome: nomeCriar, tag: tagCriar }, {
      onSuccess: () => addToast("Aliança fundada com sucesso!", "success"),
      onError: (err) => addToast(Object.values(err)[0] || "Erro ao criar aliança.", "error"),
      onFinish: () => setIsSubmitting(false)
    });
  };
  const handleApply = (id) => {
    Sr.post("/alianca/pedir", { alianca_id: id }, {
      onSuccess: () => addToast("Pedido de adesão enviado!", "success"),
      onError: (err) => addToast(Object.values(err)[0] || "Erro ao enviar pedido.", "error")
    });
  };
  const handleDecision = (pedidoId, decisao) => {
    Sr.post(`/alianca/decidir/${pedidoId}/${decisao}`, {}, {
      onSuccess: () => addToast("Decisão processada.", "success")
    });
  };
  const handleLeave = () => {
    if (confirm("Tens a certeza que queres desertar desta aliança? O Alto Comando não perdoa facilmente.")) {
      Sr.post("/alianca/sair", {}, {
        onSuccess: () => addToast("Saíste da aliança.", "info")
      });
    }
  };
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    Sr.post("/alianca/chat/enviar", { mensagem: chatMsg }, {
      preserveScroll: true,
      onSuccess: () => setChatMsg("")
    });
  };
  const handleInvite = (e) => {
    e.preventDefault();
    if (!jogadorConvidar.trim()) return;
    Sr.post("/alianca/convidar", { jogador_nome: jogadorConvidar }, {
      onSuccess: () => {
        setJogadorConvidar("");
        addToast("Convite enviado!", "success");
      },
      onError: (err) => addToast(Object.values(err)[0] || "Erro ao convidar.", "error")
    });
  };
  const handleDecisionConvite = (id, decisao) => {
    Sr.post(`/alianca/convites/${id}/${decisao}`, {}, {
      onSuccess: () => addToast("Convite processado.", "success")
    });
  };
  const handleDiplomacia = (e) => {
    e.preventDefault();
    if (!alvoDiplomacia) return;
    Sr.post("/alianca/diplomacia", { alvo_alianca_id: alvoDiplomacia, tipo: tipoDiplomacia }, {
      onSuccess: () => {
        setAlvoDiplomacia("");
        addToast("Relação diplomática atualizada!", "success");
      },
      onError: (err) => addToast(Object.values(err)[0] || "Erro na diplomacia.", "error")
    });
  };
  const handleDeleteDiplomacia = (id) => {
    if (confirm("Tens a certeza que queres dissolver este pacto? Isso pode ser visto como uma declaração de guerra.")) {
      Sr.delete(`/alianca/diplomacia/${id}`, {
        onSuccess: () => addToast("Pacto dissolvido.", "info")
      });
    }
  };
  if (!temAlianca) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Diplomacia" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[calc(100vh-4rem)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col h-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sky-900/40 p-4 border-b border-sky-500/30 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldPlus, { className: "text-sky-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg uppercase tracking-widest text-white", children: "Fundar Coligação" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "p-6 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-neutral-400 mb-2", children: "Estabelece uma nova super-potência militar. Define o nome e a TAG (sigla) da tua coligação." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-black uppercase text-neutral-500 mb-1", children: "Nome da Aliança" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  maxLength: 100,
                  value: nomeCriar,
                  onChange: (e) => setNomeCriar(e.target.value),
                  className: "w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-bold",
                  placeholder: "Ex: Organização do Tratado..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-black uppercase text-neutral-500 mb-1", children: "TAG (Max 10 chars)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  required: true,
                  maxLength: 10,
                  value: tagCriar,
                  onChange: (e) => setTagCriar(e.target.value),
                  className: "w-full bg-black/50 border border-white/10 rounded p-3 text-sky-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono uppercase",
                  placeholder: "Ex: NATO"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                disabled: isSubmitting,
                className: "mt-4 py-3 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-widest rounded transition disabled:opacity-50",
                children: isSubmitting ? "A Processar..." : "Estabelecer Coligação"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 p-4 border-b border-white/10 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "text-neutral-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-lg uppercase tracking-widest text-white", children: "Aliar-se" })
          ] }) }),
          pedidoPendente && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-center", children: [
            "Tens um pedido pendente para a aliança ID #",
            pedidoPendente.alianca_id,
            ". Aguarda decisão."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 overflow-y-auto flex-1", children: [
            convites && convites.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-black uppercase text-sky-400 tracking-widest mb-2", children: "Protocolos de Convite Recebidos" }),
              convites.map((c) => {
                var _a2;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sky-500/10 border border-sky-500/20 p-4 rounded-xl flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white font-bold", children: [
                      "[",
                      c.alianca.tag,
                      "] ",
                      c.alianca.nome
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-neutral-400 uppercase", children: [
                      "Enviado por: ",
                      (_a2 = c.convidado_por) == null ? void 0 : _a2.username
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleDecisionConvite(c.id, "aceitar"),
                        className: "p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded transition",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleDecisionConvite(c.id, "rejeitar"),
                        className: "p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                      }
                    )
                  ] })
                ] }, c.id);
              })
            ] }),
            aliancas && aliancas.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-2", children: "Coligações Ativas no Globo" }),
              aliancas.map((al) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded hover:bg-white/10 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white", children: [
                    "[",
                    al.tag,
                    "] ",
                    al.nome
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-neutral-400 flex items-center gap-1 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12 }),
                    " ",
                    al.membros_count,
                    " membro(s)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleApply(al.id),
                    disabled: !!pedidoPendente,
                    className: "px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded disabled:opacity-50 transition",
                    children: "Pedir Adesão"
                  }
                )
              ] }, al.id))
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-neutral-500 py-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 48, className: "mx-auto mb-4 opacity-20" }),
              "Nenhuma aliança registada no globo."
            ] })
          ] })
        ] })
      ] })
    ] });
  }
  const isFundador = alianca.fundador_id === jogador.id;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: `Aliança [${alianca.tag}]` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-4rem)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-sky-900/60 to-black border border-sky-500/30 rounded-xl p-6 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "absolute -right-4 -bottom-4 w-48 h-48 text-sky-500/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-black text-white uppercase tracking-wider mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sky-400", children: [
                  "[",
                  alianca.tag,
                  "]"
                ] }),
                " ",
                alianca.nome
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-neutral-400 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 }),
                " Fundador: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: ((_a = alianca.fundador) == null ? void 0 : _a.username) || "Desconhecido" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleLeave,
                className: "flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded text-xs font-bold uppercase transition",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 14 }),
                  " Desertar"
                ]
              }
            )
          ] })
        ] }),
        isFundador && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-900/20 border border-amber-500/30 rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-500/10 p-3 border-b border-amber-500/20 text-amber-400 font-bold uppercase text-xs tracking-widest", children: "Candidaturas Externas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 flex flex-col gap-2", children: alianca.pedidos && alianca.pedidos.filter((p) => p.status === "pendente").length > 0 ? alianca.pedidos.filter((p) => p.status === "pendente").map((pedido) => {
              var _a2;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-black/40 p-3 border border-white/5 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-white text-sm", children: (_a2 = pedido.jogador) == null ? void 0 : _a2.username }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleDecision(pedido.id, "aprovar"),
                      className: "p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded transition",
                      title: "Aprovar",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleDecision(pedido.id, "rejeitar"),
                      className: "p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition",
                      title: "Rejeitar",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                    }
                  )
                ] })
              ] }, pedido.id);
            }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-500 text-xs italic text-center py-4", children: "Sem candidaturas pendentes." }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sky-900/20 border border-sky-500/30 rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-sky-500/10 p-3 border-b border-sky-500/20 text-sky-400 font-bold uppercase text-xs tracking-widest", children: "Recrutamento Estratégico" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleInvite, className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: jogadorConvidar,
                    onChange: (e) => setJogadorConvidar(e.target.value),
                    placeholder: "Nome do Comandante...",
                    className: "flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded text-xs font-bold uppercase transition", children: "Convidar" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[8px] font-black text-neutral-500 uppercase tracking-widest", children: "Convites Enviados" }),
                convitesEnviados && convitesEnviados.length > 0 ? convitesEnviados.map((c) => {
                  var _a2;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-black/40 p-2 border border-white/5 rounded", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white font-bold", children: (_a2 = c.jogador) == null ? void 0 : _a2.username }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-sky-400 font-mono uppercase px-2 py-0.5 bg-sky-500/10 rounded", children: "Pendente" })
                  ] }, c.id);
                }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neutral-600 text-[9px] italic uppercase tracking-widest text-center py-2", children: "Sem convites ativos." })
              ] })
            ] })
          ] })
        ] }),
        isFundador && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neutral-800/40 p-4 border-b border-white/10 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "text-sky-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-sm uppercase tracking-widest text-white", children: "Conselho Diplomático" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-widest", children: "Formalizar Novo Pacto / Declaração" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleDiplomacia, className: "flex flex-col gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[8px] font-black uppercase text-neutral-500 mb-1", children: "Coligação Alvo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: alvoDiplomacia,
                      onChange: (e) => setAlvoDiplomacia(e.target.value),
                      className: "w-full bg-black/60 border border-white/10 rounded p-2 text-xs text-white",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecionar Aliança..." }),
                        todasAliancas == null ? void 0 : todasAliancas.map((al) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: al.id, children: [
                          "[",
                          al.tag,
                          "] ",
                          al.nome
                        ] }, al.id))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[8px] font-black uppercase text-neutral-500 mb-1", children: "Tipo de Relação" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setTipoDiplomacia("aliado"),
                        className: `py-2 px-1 text-[10px] font-black uppercase rounded border transition ${tipoDiplomacia === "aliado" ? "bg-sky-600 border-sky-500 text-white" : "bg-white/5 border-white/10 text-neutral-500 hover:bg-white/10"}`,
                        children: "Aliado"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setTipoDiplomacia("pna"),
                        className: `py-2 px-1 text-[10px] font-black uppercase rounded border transition ${tipoDiplomacia === "pna" ? "bg-teal-600 border-teal-500 text-white" : "bg-white/5 border-white/10 text-neutral-500 hover:bg-white/10"}`,
                        children: "PNA"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setTipoDiplomacia("inimigo"),
                        className: `py-2 px-1 text-[10px] font-black uppercase rounded border transition ${tipoDiplomacia === "inimigo" ? "bg-red-600 border-red-500 text-white" : "bg-white/5 border-white/10 text-neutral-500 hover:bg-white/10"}`,
                        children: "Inimigo"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-sky-400 transition", children: "Transmitir Protocolo" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] font-black text-neutral-500 uppercase tracking-widest", children: "Relações Ativas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar", children: diplomacia && diplomacia.length > 0 ? diplomacia.map((rel) => {
                var _a2, _b2;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-white", children: [
                      "[",
                      (_a2 = rel.alvo_alianca) == null ? void 0 : _a2.tag,
                      "] ",
                      (_b2 = rel.alvo_alianca) == null ? void 0 : _b2.nome
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8px] font-black uppercase tracking-tighter ${rel.tipo === "aliado" ? "text-sky-400" : rel.tipo === "pna" ? "text-teal-400" : "text-red-500"}`, children: rel.tipo })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleDeleteDiplomacia(rel.id),
                      className: "p-1.5 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 rounded transition-all",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                    }
                  )
                ] }, rel.id);
              }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 border border-dashed border-white/10 rounded-lg text-neutral-600 text-[10px] font-black uppercase tracking-widest", children: "Isolamento Diplomático Total" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 p-4 border-b border-white/10 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-sky-400", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-black text-sm uppercase tracking-widest text-white", children: [
              "Efetivos Militares (",
              (_b = alianca.membros) == null ? void 0 : _b.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm text-neutral-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-white/5 uppercase text-[10px] tracking-widest text-neutral-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2", children: "Comandante" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right", children: "Patente" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (_c = alianca.membros) == null ? void 0 : _c.map((membro) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-white/5 last:border-0 hover:bg-white/[0.02]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 font-bold text-white flex items-center gap-2", children: [
                membro.id === alianca.fundador_id && /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14, className: "text-amber-400" }),
                membro.username
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right", children: membro.id === alianca.fundador_id ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400 text-xs uppercase font-bold", children: "Líder Supremo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-500 text-xs uppercase", children: "Oficial" }) })
            ] }, membro.id)) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 md:max-w-md bg-black/60 border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sky-900/20 p-4 border-b border-sky-500/20 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "text-sky-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-black text-sm uppercase tracking-widest text-white", children: "Canal Seguro" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-sky-400 font-mono opacity-80", children: "ENCRIPTADO E2E - REDE TÁTICA" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-4 overflow-y-auto flex flex-col gap-3", children: [
          mensagens && mensagens.length > 0 ? mensagens.map((msg) => {
            var _a2;
            const isMe = msg.jogador_id === jogador.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col max-w-[85%] ${isMe ? "self-end" : "self-start"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] mb-1 font-bold ${isMe ? "text-right text-sky-400" : "text-neutral-500"}`, children: isMe ? "Eu" : (_a2 = msg.jogador) == null ? void 0 : _a2.username }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-lg text-sm ${isMe ? "bg-sky-600 text-white rounded-br-none" : "bg-white/10 text-neutral-200 rounded-bl-none border border-white/5"}`, children: msg.mensagem }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] text-neutral-600 mt-1 ${isMe ? "text-right" : ""}`, children: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
            ] }, msg.id);
          }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-center text-neutral-500 text-xs uppercase font-mono px-8", children: "O canal de comunicação encontra-se vazio. Inicia a coordenação militar." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-black/40 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendChat, className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: chatMsg,
              onChange: (e) => setChatMsg(e.target.value),
              placeholder: "Transmitir mensagem...",
              className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500 focus:bg-white/10 transition"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: !chatMsg.trim(),
              className: "p-3 bg-sky-600 hover:bg-sky-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-lg transition",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 })
            }
          )
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Alianca as default
};
//# sourceMappingURL=alianca-D53NtING.js.map
