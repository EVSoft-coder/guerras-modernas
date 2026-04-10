import{j as e,L as p,$ as c}from"./app-DgwdTzW7.js";import{A as m,C as f}from"./app-layout-Clkn4U1j.js";import{a as o}from"./app-logo-icon-DJfKcUOY.js";import"./index-B7O3JIpl.js";import"./index-i_r9RhnL.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],y=o("ChevronDown",u);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],g=o("ChevronLeft",b);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],v=o("ChevronUp",j);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]],N=o("Crosshair",k);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],$=o("Map",w);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9",key:"1vaf9d"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5",key:"u1ii0m"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5",key:"1j5fej"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19",key:"10b0cb"}]],C=o("Radio",_),M=[{title:"Dashboard",href:"/dashboard"},{title:"Mapa Tático",href:"/mapa"}];function S({bases:h,x:a,y:t,raio:i}){const d=[];for(let r=t-i;r<=t+i;r++){const n=[];for(let s=a-i;s<=a+i;s++){const l=h.find(x=>x.coordenada_x===s&&x.coordenada_y===r);n.push({x:s,y:r,base:l})}d.push(n)}return e.jsxs(m,{breadcrumbs:M,children:[e.jsx(p,{title:`Setor [${a}:${t}] - Mapa Tático`}),e.jsxs("div",{className:"flex flex-1 flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("h1",{className:"text-2xl font-black uppercase tracking-tighter flex items-center gap-2",children:[e.jsx($,{className:"text-sky-500",size:24}),"Setor Operacional [",a,":",t,"]"]}),e.jsx("p",{className:"text-[10px] text-neutral-500 uppercase font-bold tracking-widest",children:"Vigilância de Satélite em Tempo Real"})]}),e.jsxs("div",{className:"flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5",children:[e.jsx(c,{href:`/mapa?x=${a}&y=${t-5}`,className:"p-2 hover:bg-white/10 rounded transition-colors",children:e.jsx(v,{size:16})}),e.jsx(c,{href:`/mapa?x=${a}&y=${t+5}`,className:"p-2 hover:bg-white/10 rounded transition-colors",children:e.jsx(y,{size:16})}),e.jsx(c,{href:`/mapa?x=${a-5}&y=${t}`,className:"p-2 hover:bg-white/10 rounded transition-colors",children:e.jsx(g,{size:16})}),e.jsx(c,{href:`/mapa?x=${a+5}&y=${t}`,className:"p-2 hover:bg-white/10 rounded transition-colors",children:e.jsx(f,{size:16})})]})]}),e.jsx("div",{className:"flex-1 flex items-center justify-center p-4",children:e.jsx("div",{className:"grid gap-1 bg-black/20 p-2 rounded-xl border border-white/10 shadow-2xl overflow-auto max-w-full max-h-[70vh]",children:d.map((r,n)=>e.jsx("div",{className:"flex gap-1",children:r.map((s,l)=>e.jsxs("div",{className:`w-12 h-12 md:w-16 md:h-16 border rounded flex flex-col items-center justify-center relative transition-all duration-300 group
                                            ${s.base?"bg-sky-500/20 border-sky-500/40 hover:bg-sky-500/40":"bg-white/5 border-white/5 hover:border-white/20"}
                                            ${s.x===a&&s.y===t?"border-orange-500/60 ring-1 ring-orange-500/40":""}
                                        `,children:[e.jsxs("span",{className:"text-[8px] text-neutral-600 absolute top-1 left-1",children:[s.x,":",s.y]}),s.base?e.jsxs("div",{className:"flex flex-col items-center gap-1 group-hover:scale-110 transition-transform",children:[e.jsx(C,{size:16,className:s.base.jogador_id===1?"text-green-500":"text-red-500"}),e.jsx("span",{className:"text-[8px] font-bold uppercase truncate w-full text-center px-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 absolute -bottom-8 rounded z-10",children:s.base.nome})]}):e.jsx(N,{size:12,className:"text-neutral-800 opacity-20 group-hover:opacity-100"})]},`${s.x}-${s.y}`))},n))})})]})]})}export{S as default};
