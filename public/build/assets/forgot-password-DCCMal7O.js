import { a as me, j as jsxRuntimeExports, L as Le } from "./app-De9dAqfY.js";
import { L as Label, I as InputError } from "./label-BEVT1cm7.js";
import { T as TextLink } from "./text-link-C613lN3y.js";
import { B as Button } from "./app-logo-icon-2jgDCAQe.js";
import { I as Input } from "./index-4Obz9-NB.js";
import { A as AuthLayout } from "./auth-layout-CO-TEC2F.js";
import { L as LoaderCircle } from "./loader-circle-6ab9uYv9.js";
function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = me({
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthLayout, { title: "Forgot password", description: "Enter your email to receive a password reset link", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Le, { title: "Forgot password" }),
    status && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: status }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              type: "email",
              name: "email",
              autoComplete: "off",
              value: data.email,
              autoFocus: true,
              onChange: (e) => setData("email", e.target.value),
              placeholder: "email@example.com"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InputError, { message: errors.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-6 flex items-center justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", disabled: processing, children: [
          processing && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Email password reset link"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground space-x-1 text-center text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Or, return to" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextLink, { href: route("login"), children: "log in" })
      ] })
    ] })
  ] });
}
export {
  ForgotPassword as default
};
//# sourceMappingURL=forgot-password-DCCMal7O.js.map
