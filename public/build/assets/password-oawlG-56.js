import { r as reactExports, m as me, j as jsxRuntimeExports, L as Le } from "./app-BUgMdwTt.js";
import { L as Label, I as InputError } from "./label-DYUX2TFW.js";
import { A as AppLayout } from "./app-layout-DbypQNMZ.js";
import { S as SettingsLayout, H as HeadingSmall } from "./layout-Bb8aBpyM.js";
import { B as Button } from "./app-logo-icon-kWHE4dPR.js";
import { I as Input } from "./index-DdJQu8P7.js";
import { z as ze } from "./transition-CRy_tmYn.js";
import "./index-BGe9TKXu.js";
import "./target-B6r3zikb.js";
const breadcrumbs = [
  {
    title: "Password settings",
    href: "/settings/password"
  }
];
function Password() {
  const passwordInput = reactExports.useRef(null);
  const currentPasswordInput = reactExports.useRef(null);
  const { data, setData, errors, put, reset, processing, recentlySuccessful } = me({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const updatePassword = (e) => {
    e.preventDefault();
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors2) => {
        var _a, _b;
        if (errors2.password) {
          reset("password", "password_confirmation");
          (_a = passwordInput.current) == null ? void 0 : _a.focus();
        }
        if (errors2.current_password) {
          reset("current_password");
          (_b = currentPasswordInput.current) == null ? void 0 : _b.focus();
        }
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Profile settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadingSmall, { title: "Update password", description: "Ensure your account is using a long, random password to stay secure" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: updatePassword, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "current_password", children: "Current password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "current_password",
              ref: currentPasswordInput,
              value: data.current_password,
              onChange: (e) => setData("current_password", e.target.value),
              type: "password",
              className: "mt-1 block w-full",
              autoComplete: "current-password",
              placeholder: "Current password"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.current_password })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "New password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "password",
              ref: passwordInput,
              value: data.password,
              onChange: (e) => setData("password", e.target.value),
              type: "password",
              className: "mt-1 block w-full",
              autoComplete: "new-password",
              placeholder: "New password"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.password })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password_confirmation", children: "Confirm password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "password_confirmation",
              value: data.password_confirmation,
              onChange: (e) => setData("password_confirmation", e.target.value),
              type: "password",
              className: "mt-1 block w-full",
              autoComplete: "new-password",
              placeholder: "Confirm password"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: processing, children: "Save password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ze,
            {
              show: recentlySuccessful,
              enter: "transition ease-in-out",
              enterFrom: "opacity-0",
              leave: "transition ease-in-out",
              leaveTo: "opacity-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-neutral-600", children: "Saved" })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Password as default
};
//# sourceMappingURL=password-oawlG-56.js.map
