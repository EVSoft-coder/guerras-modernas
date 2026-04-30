import { c as createLucideIcon, i as useAppearance, j as jsxRuntimeExports, L as Le } from "./app-BUgMdwTt.js";
import { c as cn } from "./app-logo-icon-kWHE4dPR.js";
import { S as Sun, M as Moon } from "./sun-CATqivKX.js";
import { S as SettingsLayout, H as HeadingSmall } from "./layout-Bb8aBpyM.js";
import { A as AppLayout } from "./app-layout-DbypQNMZ.js";
import "./index-DdJQu8P7.js";
import "./index-BGe9TKXu.js";
import "./target-B6r3zikb.js";
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
];
const Monitor = createLucideIcon("Monitor", __iconNode);
function AppearanceToggleTab({ className = "", ...props }) {
  const { appearance, updateAppearance } = useAppearance();
  const tabs = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800", className), ...props, children: tabs.map(({ value, icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: () => updateAppearance(value),
      className: cn(
        "flex items-center rounded-md px-3.5 py-1.5 transition-colors",
        appearance === value ? "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100" : "text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "-ml-1 h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-sm", children: label })
      ]
    },
    value
  )) });
}
const breadcrumbs = [
  {
    title: "Appearance settings",
    href: "/settings/appearance"
  }
];
function Appearance() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Appearance settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadingSmall, { title: "Appearance settings", description: "Update your account's appearance settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppearanceToggleTab, {})
    ] }) })
  ] });
}
export {
  Appearance as default
};
//# sourceMappingURL=appearance-CRk9cu0B.js.map
