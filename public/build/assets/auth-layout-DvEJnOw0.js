import { j as jsxRuntimeExports, $ as $e, r as reactExports } from "./app-Dd86GwVv.js";
import { A as AppLogoIcon } from "./app-logo-icon-DwFB1T6d.js";
function AuthSimpleLayout({ children, title, description }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs($e, { href: route("home"), className: "flex flex-col items-center gap-2 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 flex h-9 w-9 items-center justify-center rounded-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogoIcon, { className: "size-9 fill-current text-[var(--foreground)] dark:text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-medium", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center text-sm", children: description })
      ] })
    ] }),
    children
  ] }) }) });
}
function AuthLayout({ children, title, description, ...props }) {
  reactExports.useEffect(() => {
    const layers = ["GAME_SCREEN", "MAIN_MENU", "PAUSE_SCREEN", "village-view-container", "tactical-hud", "world-map-view"];
    layers.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = "none";
        el.style.pointerEvents = "none";
      }
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthSimpleLayout, { title, description, ...props, children });
}
export {
  AuthLayout as A
};
//# sourceMappingURL=auth-layout-DvEJnOw0.js.map
