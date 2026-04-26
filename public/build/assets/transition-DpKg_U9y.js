import { r as reactExports, U as U$2, t as t$2 } from "./app-Yef8cUl3.js";
var i$1 = Object.defineProperty;
var d = (t2, e, n2) => e in t2 ? i$1(t2, e, { enumerable: true, configurable: true, writable: true, value: n2 }) : t2[e] = n2;
var r = (t2, e, n2) => (d(t2, typeof e != "symbol" ? e + "" : e, n2), n2);
let o$2 = class o {
  constructor() {
    r(this, "current", this.detect());
    r(this, "handoffState", "pending");
    r(this, "currentId", 0);
  }
  set(e) {
    this.current !== e && (this.handoffState = "pending", this.currentId = 0, this.current = e);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
  }
  handoff() {
    this.handoffState === "pending" && (this.handoffState = "complete");
  }
  get isHandoffComplete() {
    return this.handoffState === "complete";
  }
};
let s$2 = new o$2();
function t$1(e) {
  typeof queueMicrotask == "function" ? queueMicrotask(e) : Promise.resolve().then(e).catch((o3) => setTimeout(() => {
    throw o3;
  }));
}
function o$1() {
  let n2 = [], r2 = { addEventListener(e, t2, s2, a) {
    return e.addEventListener(t2, s2, a), r2.add(() => e.removeEventListener(t2, s2, a));
  }, requestAnimationFrame(...e) {
    let t2 = requestAnimationFrame(...e);
    return r2.add(() => cancelAnimationFrame(t2));
  }, nextFrame(...e) {
    return r2.requestAnimationFrame(() => r2.requestAnimationFrame(...e));
  }, setTimeout(...e) {
    let t2 = setTimeout(...e);
    return r2.add(() => clearTimeout(t2));
  }, microTask(...e) {
    let t2 = { current: true };
    return t$1(() => {
      t2.current && e[0]();
    }), r2.add(() => {
      t2.current = false;
    });
  }, style(e, t2, s2) {
    let a = e.style.getPropertyValue(t2);
    return Object.assign(e.style, { [t2]: s2 }), this.add(() => {
      Object.assign(e.style, { [t2]: a });
    });
  }, group(e) {
    let t2 = o$1();
    return e(t2), this.add(() => t2.dispose());
  }, add(e) {
    return n2.includes(e) || n2.push(e), () => {
      let t2 = n2.indexOf(e);
      if (t2 >= 0) for (let s2 of n2.splice(t2, 1)) s2();
    };
  }, dispose() {
    for (let e of n2.splice(0)) e();
  } };
  return r2;
}
function p() {
  let [e] = reactExports.useState(o$1);
  return reactExports.useEffect(() => () => e.dispose(), [e]), e;
}
let n$1 = (e, t2) => {
  s$2.isServer ? reactExports.useEffect(e, t2) : reactExports.useLayoutEffect(e, t2);
};
function s$1(e) {
  let r2 = reactExports.useRef(e);
  return n$1(() => {
    r2.current = e;
  }, [e]), r2;
}
let o2 = function(t2) {
  let e = s$1(t2);
  return U$2.useCallback((...r2) => e.current(...r2), [e]);
};
function t(...r2) {
  return Array.from(new Set(r2.flatMap((n2) => typeof n2 == "string" ? n2.split(" ") : []))).filter(Boolean).join(" ");
}
function u$2(r2, n2, ...a) {
  if (r2 in n2) {
    let e = n2[r2];
    return typeof e == "function" ? e(...a) : e;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e) => `"${e}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u$2), t2;
}
var O = ((a) => (a[a.None = 0] = "None", a[a.RenderStrategy = 1] = "RenderStrategy", a[a.Static = 2] = "Static", a))(O || {}), A = ((e) => (e[e.Unmount = 0] = "Unmount", e[e.Hidden = 1] = "Hidden", e))(A || {});
function L$1() {
  let n2 = U$1();
  return reactExports.useCallback((r2) => C$1({ mergeRefs: n2, ...r2 }), [n2]);
}
function C$1({ ourProps: n2, theirProps: r2, slot: e, defaultTag: a, features: s2, visible: t2 = true, name: l2, mergeRefs: i2 }) {
  i2 = i2 != null ? i2 : $;
  let o3 = P(r2, n2);
  if (t2) return F(o3, e, a, l2, i2);
  let y2 = s2 != null ? s2 : 0;
  if (y2 & 2) {
    let { static: f2 = false, ...u2 } = o3;
    if (f2) return F(u2, e, a, l2, i2);
  }
  if (y2 & 1) {
    let { unmount: f2 = true, ...u2 } = o3;
    return u$2(f2 ? 0 : 1, { [0]() {
      return null;
    }, [1]() {
      return F({ ...u2, hidden: true, style: { display: "none" } }, e, a, l2, i2);
    } });
  }
  return F(o3, e, a, l2, i2);
}
function F(n2, r2 = {}, e, a, s2) {
  let { as: t$12 = e, children: l2, refName: i2 = "ref", ...o3 } = h(n2, ["unmount", "static"]), y2 = n2.ref !== void 0 ? { [i2]: n2.ref } : {}, f2 = typeof l2 == "function" ? l2(r2) : l2;
  "className" in o3 && o3.className && typeof o3.className == "function" && (o3.className = o3.className(r2)), o3["aria-labelledby"] && o3["aria-labelledby"] === o3.id && (o3["aria-labelledby"] = void 0);
  let u2 = {};
  if (r2) {
    let d2 = false, p2 = [];
    for (let [c2, T2] of Object.entries(r2)) typeof T2 == "boolean" && (d2 = true), T2 === true && p2.push(c2.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`));
    if (d2) {
      u2["data-headlessui-state"] = p2.join(" ");
      for (let c2 of p2) u2[`data-${c2}`] = "";
    }
  }
  if (t$12 === reactExports.Fragment && (Object.keys(m(o3)).length > 0 || Object.keys(m(u2)).length > 0)) if (!reactExports.isValidElement(f2) || Array.isArray(f2) && f2.length > 1) {
    if (Object.keys(m(o3)).length > 0) throw new Error(['Passing props on "Fragment"!', "", `The current component <${a} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(m(o3)).concat(Object.keys(m(u2))).map((d2) => `  - ${d2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((d2) => `  - ${d2}`).join(`
`)].join(`
`));
  } else {
    let d2 = f2.props, p2 = d2 == null ? void 0 : d2.className, c2 = typeof p2 == "function" ? (...R2) => t(p2(...R2), o3.className) : t(p2, o3.className), T2 = c2 ? { className: c2 } : {}, g = P(f2.props, m(h(o3, ["ref"])));
    for (let R2 in u2) R2 in g && delete u2[R2];
    return reactExports.cloneElement(f2, Object.assign({}, g, u2, y2, { ref: s2(H(f2), y2.ref) }, T2));
  }
  return reactExports.createElement(t$12, Object.assign({}, h(o3, ["ref"]), t$12 !== reactExports.Fragment && y2, t$12 !== reactExports.Fragment && u2), f2);
}
function U$1() {
  let n2 = reactExports.useRef([]), r2 = reactExports.useCallback((e) => {
    for (let a of n2.current) a != null && (typeof a == "function" ? a(e) : a.current = e);
  }, []);
  return (...e) => {
    if (!e.every((a) => a == null)) return n2.current = e, r2;
  };
}
function $(...n2) {
  return n2.every((r2) => r2 == null) ? void 0 : (r2) => {
    for (let e of n2) e != null && (typeof e == "function" ? e(r2) : e.current = r2);
  };
}
function P(...n2) {
  if (n2.length === 0) return {};
  if (n2.length === 1) return n2[0];
  let r2 = {}, e = {};
  for (let s2 of n2) for (let t2 in s2) t2.startsWith("on") && typeof s2[t2] == "function" ? (e[t2] != null || (e[t2] = []), e[t2].push(s2[t2])) : r2[t2] = s2[t2];
  if (r2.disabled || r2["aria-disabled"]) for (let s2 in e) /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(s2) && (e[s2] = [(t2) => {
    var l2;
    return (l2 = t2 == null ? void 0 : t2.preventDefault) == null ? void 0 : l2.call(t2);
  }]);
  for (let s2 in e) Object.assign(r2, { [s2](t2, ...l2) {
    let i2 = e[s2];
    for (let o3 of i2) {
      if ((t2 instanceof Event || (t2 == null ? void 0 : t2.nativeEvent) instanceof Event) && t2.defaultPrevented) return;
      o3(t2, ...l2);
    }
  } });
  return r2;
}
function K(n2) {
  var r2;
  return Object.assign(reactExports.forwardRef(n2), { displayName: (r2 = n2.displayName) != null ? r2 : n2.name });
}
function m(n2) {
  let r2 = Object.assign({}, n2);
  for (let e in r2) r2[e] === void 0 && delete r2[e];
  return r2;
}
function h(n2, r2 = []) {
  let e = Object.assign({}, n2);
  for (let a of r2) a in e && delete e[a];
  return e;
}
function H(n2) {
  return U$2.version.split(".")[0] >= "19" ? n2.props.ref : n2.ref;
}
let u$1 = Symbol();
function y(...t2) {
  let n2 = reactExports.useRef(t2);
  reactExports.useEffect(() => {
    n2.current = t2;
  }, [t2]);
  let c2 = o2((e) => {
    for (let o3 of n2.current) o3 != null && (typeof o3 == "function" ? o3(e) : o3.current = e);
  });
  return t2.every((e) => e == null || (e == null ? void 0 : e[u$1])) ? void 0 : c2;
}
function c$1(u2 = 0) {
  let [t2, l2] = reactExports.useState(u2), g = reactExports.useCallback((e) => l2(e), [t2]), s2 = reactExports.useCallback((e) => l2((a) => a | e), [t2]), m2 = reactExports.useCallback((e) => (t2 & e) === e, [t2]), n2 = reactExports.useCallback((e) => l2((a) => a & ~e), [l2]), F2 = reactExports.useCallback((e) => l2((a) => a ^ e), [l2]);
  return { flags: t2, setFlag: g, addFlag: s2, hasFlag: m2, removeFlag: n2, toggleFlag: F2 };
}
var define_process_env_default = {};
var T, b;
typeof process != "undefined" && typeof globalThis != "undefined" && typeof Element != "undefined" && ((T = process == null ? void 0 : define_process_env_default) == null ? void 0 : T["NODE_ENV"]) === "test" && typeof ((b = Element == null ? void 0 : Element.prototype) == null ? void 0 : b.getAnimations) == "undefined" && (Element.prototype.getAnimations = function() {
  return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.", "Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.", "", "Example usage:", "```js", "import { mockAnimationsApi } from 'jsdom-testing-mocks'", "mockAnimationsApi()", "```"].join(`
`)), [];
});
var L = ((r2) => (r2[r2.None = 0] = "None", r2[r2.Closed = 1] = "Closed", r2[r2.Enter = 2] = "Enter", r2[r2.Leave = 4] = "Leave", r2))(L || {});
function R(t2) {
  let n2 = {};
  for (let e in t2) t2[e] === true && (n2[`data-${e}`] = "");
  return n2;
}
function x(t2, n2, e, i2) {
  let [r2, o3] = reactExports.useState(e), { hasFlag: s2, addFlag: a, removeFlag: l2 } = c$1(t2 && r2 ? 3 : 0), u2 = reactExports.useRef(false), f2 = reactExports.useRef(false), E = p();
  return n$1(() => {
    var d2;
    if (t2) {
      if (e && o3(true), !n2) {
        e && a(3);
        return;
      }
      return (d2 = i2 == null ? void 0 : i2.start) == null || d2.call(i2, e), C(n2, { inFlight: u2, prepare() {
        f2.current ? f2.current = false : f2.current = u2.current, u2.current = true, !f2.current && (e ? (a(3), l2(4)) : (a(4), l2(2)));
      }, run() {
        f2.current ? e ? (l2(3), a(4)) : (l2(4), a(3)) : e ? l2(1) : a(1);
      }, done() {
        var p2;
        f2.current && typeof n2.getAnimations == "function" && n2.getAnimations().length > 0 || (u2.current = false, l2(7), e || o3(false), (p2 = i2 == null ? void 0 : i2.end) == null || p2.call(i2, e));
      } });
    }
  }, [t2, e, n2, E]), t2 ? [r2, { closed: s2(1), enter: s2(2), leave: s2(4), transition: s2(2) || s2(4) }] : [e, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }];
}
function C(t2, { prepare: n2, run: e, done: i2, inFlight: r2 }) {
  let o3 = o$1();
  return j(t2, { prepare: n2, inFlight: r2 }), o3.nextFrame(() => {
    e(), o3.requestAnimationFrame(() => {
      o3.add(M$1(t2, i2));
    });
  }), o3.dispose;
}
function M$1(t2, n2) {
  var o3, s2;
  let e = o$1();
  if (!t2) return e.dispose;
  let i2 = false;
  e.add(() => {
    i2 = true;
  });
  let r2 = (s2 = (o3 = t2.getAnimations) == null ? void 0 : o3.call(t2).filter((a) => a instanceof CSSTransition)) != null ? s2 : [];
  return r2.length === 0 ? (n2(), e.dispose) : (Promise.allSettled(r2.map((a) => a.finished)).then(() => {
    i2 || n2();
  }), e.dispose);
}
function j(t2, { inFlight: n2, prepare: e }) {
  if (n2 != null && n2.current) {
    e();
    return;
  }
  let i2 = t2.style.transition;
  t2.style.transition = "none", e(), t2.offsetHeight, t2.style.transition = i2;
}
let n = reactExports.createContext(null);
n.displayName = "OpenClosedContext";
var i = ((e) => (e[e.Open = 1] = "Open", e[e.Closed = 2] = "Closed", e[e.Closing = 4] = "Closing", e[e.Opening = 8] = "Opening", e))(i || {});
function u() {
  return reactExports.useContext(n);
}
function c({ value: o3, children: t2 }) {
  return U$2.createElement(n.Provider, { value: o3 }, t2);
}
function s() {
  let r2 = typeof document == "undefined";
  return "useSyncExternalStore" in t$2 ? ((o3) => o3.useSyncExternalStore)(t$2)(() => () => {
  }, () => false, () => !r2) : false;
}
function l() {
  let r2 = s(), [e, n2] = reactExports.useState(s$2.isHandoffComplete);
  return e && s$2.isHandoffComplete === false && n2(false), reactExports.useEffect(() => {
    e !== true && n2(true);
  }, [e]), reactExports.useEffect(() => s$2.handoff(), []), r2 ? false : e;
}
function f() {
  let e = reactExports.useRef(false);
  return n$1(() => (e.current = true, () => {
    e.current = false;
  }), []), e;
}
function ue(e) {
  var t2;
  return !!(e.enter || e.enterFrom || e.enterTo || e.leave || e.leaveFrom || e.leaveTo) || ((t2 = e.as) != null ? t2 : de) !== reactExports.Fragment || U$2.Children.count(e.children) === 1;
}
let w = reactExports.createContext(null);
w.displayName = "TransitionContext";
var _e = ((n2) => (n2.Visible = "visible", n2.Hidden = "hidden", n2))(_e || {});
function De() {
  let e = reactExports.useContext(w);
  if (e === null) throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
function He() {
  let e = reactExports.useContext(M);
  if (e === null) throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
let M = reactExports.createContext(null);
M.displayName = "NestingContext";
function U(e) {
  return "children" in e ? U(e.children) : e.current.filter(({ el: t2 }) => t2.current !== null).filter(({ state: t2 }) => t2 === "visible").length > 0;
}
function Te(e, t2) {
  let n2 = s$1(e), l2 = reactExports.useRef([]), S = f(), R2 = p(), d2 = o2((o3, i2 = A.Hidden) => {
    let a = l2.current.findIndex(({ el: s2 }) => s2 === o3);
    a !== -1 && (u$2(i2, { [A.Unmount]() {
      l2.current.splice(a, 1);
    }, [A.Hidden]() {
      l2.current[a].state = "hidden";
    } }), R2.microTask(() => {
      var s2;
      !U(l2) && S.current && ((s2 = n2.current) == null || s2.call(n2));
    }));
  }), y2 = o2((o3) => {
    let i2 = l2.current.find(({ el: a }) => a === o3);
    return i2 ? i2.state !== "visible" && (i2.state = "visible") : l2.current.push({ el: o3, state: "visible" }), () => d2(o3, A.Unmount);
  }), p$1 = reactExports.useRef([]), c2 = reactExports.useRef(Promise.resolve()), C2 = reactExports.useRef({ enter: [], leave: [] }), h2 = o2((o3, i2, a) => {
    p$1.current.splice(0), t2 && (t2.chains.current[i2] = t2.chains.current[i2].filter(([s2]) => s2 !== o3)), t2 == null || t2.chains.current[i2].push([o3, new Promise((s2) => {
      p$1.current.push(s2);
    })]), t2 == null || t2.chains.current[i2].push([o3, new Promise((s2) => {
      Promise.all(C2.current[i2].map(([r2, f2]) => f2)).then(() => s2());
    })]), i2 === "enter" ? c2.current = c2.current.then(() => t2 == null ? void 0 : t2.wait.current).then(() => a(i2)) : a(i2);
  }), g = o2((o3, i2, a) => {
    Promise.all(C2.current[i2].splice(0).map(([s2, r2]) => r2)).then(() => {
      var s2;
      (s2 = p$1.current.shift()) == null || s2();
    }).then(() => a(i2));
  });
  return reactExports.useMemo(() => ({ children: l2, register: y2, unregister: d2, onStart: h2, onStop: g, wait: c2, chains: C2 }), [y2, d2, l2, h2, g, C2, c2]);
}
let de = reactExports.Fragment, fe = O.RenderStrategy;
function Ae(e, t$12) {
  var ee, te;
  let { transition: n2 = true, beforeEnter: l$1, afterEnter: S, beforeLeave: R$1, afterLeave: d2, enter: y$1, enterFrom: p2, enterTo: c$12, entered: C2, leave: h2, leaveFrom: g, leaveTo: o$12, ...i$12 } = e, [a, s2] = reactExports.useState(null), r2 = reactExports.useRef(null), f2 = ue(e), j2 = y(...f2 ? [r2, t$12, s2] : t$12 === null ? [] : [t$12]), H2 = (ee = i$12.unmount) == null || ee ? A.Unmount : A.Hidden, { show: u2, appear: z, initial: K2 } = De(), [v, G] = reactExports.useState(u2 ? "visible" : "hidden"), Q = He(), { register: A$1, unregister: I } = Q;
  n$1(() => A$1(r2), [A$1, r2]), n$1(() => {
    if (H2 === A.Hidden && r2.current) {
      if (u2 && v !== "visible") {
        G("visible");
        return;
      }
      return u$2(v, { ["hidden"]: () => I(r2), ["visible"]: () => A$1(r2) });
    }
  }, [v, r2, A$1, I, u2, H2]);
  let B = l();
  n$1(() => {
    if (f2 && B && v === "visible" && r2.current === null) throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [r2, v, B, f2]);
  let ce = K2 && !z, Y = z && u2 && K2, W = reactExports.useRef(false), L2 = Te(() => {
    W.current || (G("hidden"), I(r2));
  }, Q), Z = o2((k) => {
    W.current = true;
    let F2 = k ? "enter" : "leave";
    L2.onStart(r2, F2, (_) => {
      _ === "enter" ? l$1 == null || l$1() : _ === "leave" && (R$1 == null || R$1());
    });
  }), $2 = o2((k) => {
    let F2 = k ? "enter" : "leave";
    W.current = false, L2.onStop(r2, F2, (_) => {
      _ === "enter" ? S == null || S() : _ === "leave" && (d2 == null || d2());
    }), F2 === "leave" && !U(L2) && (G("hidden"), I(r2));
  });
  reactExports.useEffect(() => {
    f2 && n2 || (Z(u2), $2(u2));
  }, [u2, f2, n2]);
  let pe = /* @__PURE__ */ (() => !(!n2 || !f2 || !B || ce))(), [, T2] = x(pe, a, u2, { start: Z, end: $2 }), Ce = m({ ref: j2, className: ((te = t(i$12.className, Y && y$1, Y && p2, T2.enter && y$1, T2.enter && T2.closed && p2, T2.enter && !T2.closed && c$12, T2.leave && h2, T2.leave && !T2.closed && g, T2.leave && T2.closed && o$12, !T2.transition && u2 && C2)) == null ? void 0 : te.trim()) || void 0, ...R(T2) }), N = 0;
  v === "visible" && (N |= i.Open), v === "hidden" && (N |= i.Closed), T2.enter && (N |= i.Opening), T2.leave && (N |= i.Closing);
  let he = L$1();
  return U$2.createElement(M.Provider, { value: L2 }, U$2.createElement(c, { value: N }, he({ ourProps: Ce, theirProps: i$12, defaultTag: de, features: fe, visible: v === "visible", name: "Transition.Child" })));
}
function Ie(e, t2) {
  let { show: n2, appear: l$1 = false, unmount: S = true, ...R2 } = e, d2 = reactExports.useRef(null), y$1 = ue(e), p2 = y(...y$1 ? [d2, t2] : t2 === null ? [] : [t2]);
  l();
  let c2 = u();
  if (n2 === void 0 && c2 !== null && (n2 = (c2 & i.Open) === i.Open), n2 === void 0) throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [C2, h2] = reactExports.useState(n2 ? "visible" : "hidden"), g = Te(() => {
    n2 || h2("hidden");
  }), [o$12, i$12] = reactExports.useState(true), a = reactExports.useRef([n2]);
  n$1(() => {
    o$12 !== false && a.current[a.current.length - 1] !== n2 && (a.current.push(n2), i$12(false));
  }, [a, n2]);
  let s2 = reactExports.useMemo(() => ({ show: n2, appear: l$1, initial: o$12 }), [n2, l$1, o$12]);
  n$1(() => {
    n2 ? h2("visible") : !U(g) && d2.current !== null && h2("hidden");
  }, [n2, g]);
  let r2 = { unmount: S }, f2 = o2(() => {
    var u2;
    o$12 && i$12(false), (u2 = e.beforeEnter) == null || u2.call(e);
  }), j2 = o2(() => {
    var u2;
    o$12 && i$12(false), (u2 = e.beforeLeave) == null || u2.call(e);
  }), H2 = L$1();
  return U$2.createElement(M.Provider, { value: g }, U$2.createElement(w.Provider, { value: s2 }, H2({ ourProps: { ...r2, as: reactExports.Fragment, children: U$2.createElement(me, { ref: p2, ...r2, ...R2, beforeEnter: f2, beforeLeave: j2 }) }, theirProps: {}, defaultTag: reactExports.Fragment, features: fe, visible: C2 === "visible", name: "Transition" })));
}
function Le(e, t2) {
  let n2 = reactExports.useContext(w) !== null, l2 = u() !== null;
  return U$2.createElement(U$2.Fragment, null, !n2 && l2 ? U$2.createElement(X, { ref: t2, ...e }) : U$2.createElement(me, { ref: t2, ...e }));
}
let X = K(Ie), me = K(Ae), Fe = K(Le), ze = Object.assign(X, { Child: Fe, Root: X });
export {
  ze as z
};
//# sourceMappingURL=transition-DpKg_U9y.js.map
